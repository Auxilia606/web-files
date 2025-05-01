const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 토큰 생성 함수
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

// 회원가입
exports.register = async (req, res) => {
  const { loginId, password, nickname } = req.body;

  if (!loginId) {
    return res.status(400).json({ message: "아이디를 입력해주세요" });
  }
  if (!password) {
    return res.status(400).json({ message: "비밀번호를 입력해주세요" });
  }
  if (!nickname) {
    return res.status(400).json({ message: "닉네임을 입력해주세요" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (login_id, password, nickname) VALUES (?, ?, ?)",
      [loginId, hashedPassword, nickname]
    );

    res.status(201).json({ message: "회원가입 성공" });
  } catch {
    res.status(500).json({ message: "회원가입 실패" });
  }
};

// 아이디 중복 확인
exports.checkId = async (req, res) => {
  const { loginId } = req.body;

  if (!loginId) {
    return res.status(400).json({ message: "아이디를 입력해주세요" });
  }

  try {
    const [rows] = await db.execute("SELECT id FROM users WHERE loginId = ?", [
      loginId,
    ]);

    if (rows.length > 0) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    return res.status(200).json({ message: "사용 가능한 아이디입니다." });
  } catch {
    res.status(500).json({ message: "아이디 확인 실패" });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { loginId, password } = req.body;

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE loginId = ?", [
      loginId,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 틀립니다." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 틀립니다." });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // DB에 Refresh Token 저장
    await db.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // 프로덕션에서는 https만
        sameSite: "Strict", // 또는 'Lax' (CSRF 방어용)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      })
      .json({ message: "로그인 성공", result: { accessToken } });
  } catch {
    res.status(500).json({ message: "로그인 실패" });
  }
};

// Refresh Token으로 Access Token 재발급
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "리프레시 토큰을 전달해주세요." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(user);
    res.json({
      message: "토큰 발급 성공",
      result: { accessToken: newAccessToken },
    });
  } catch {
    return res.status(403).json({ message: "유효하지 않은 토큰" });
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
  } catch {
    res.status(500).json({ message: "로그아웃 실패" });
  }
};
