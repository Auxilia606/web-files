const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 토큰 생성 함수
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // 보통 15분
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, // 보통 7일
  });
};

// 회원가입
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "회원가입 실패" });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 틀립니다." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 틀립니다." });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // DB에 Refresh Token 저장
    await db.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "로그인 실패" });
  }
};

// Refresh Token으로 Access Token 재발급
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token이 필요합니다." });
  }

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );

    if (users.length === 0) {
      return res
        .status(403)
        .json({ message: "Refresh Token이 유효하지 않습니다." });
    }

    const user = users[0];

    // Refresh Token 검증
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken(user.id);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Refresh Token 검증 실패" });
  }
};

// 로그아웃
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // DB에서 Refresh Token 삭제
    await db.execute(
      "UPDATE users SET refresh_token = NULL WHERE refresh_token = ?",
      [refreshToken]
    );

    res.json({ message: "로그아웃 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "로그아웃 실패" });
  }
};
