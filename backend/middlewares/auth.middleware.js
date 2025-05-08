const jwt = require("jsonwebtoken");

// 토큰 생성 함수
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.protect = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    // ✅ accessToken이 유효하면 그대로 통과
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    // ❗ accessToken이 만료됐지만 refreshToken이 있으면 재발급 시도
    if (!refreshToken) {
      return res.status(401).json({
        message: "accessToken이 만료되었고, refreshToken도 없습니다.",
      });
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      // ✅ refreshToken도 유효 → 새로운 accessToken 발급
      const newAccessToken = generateAccessToken(decodedRefresh.id);

      // 새 accessToken을 쿠키로 설정
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000,
      });

      // 사용자 정보 등록 후 통과
      req.user = decodedRefresh;
      return next();
    } catch {
      return res
        .status(401)
        .json({ message: "세션이 만료되었습니다. 다시 로그인해주세요." });
    }
  }
};
