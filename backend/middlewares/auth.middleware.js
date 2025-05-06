const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 디코드된 사용자 정보 저장
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
