const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// 회원가입
router.post("/register", authController.register);

// 로그인
router.post("/login", authController.login);

// 토큰 재발급
router.post("/refresh-token", authController.refreshToken);

// 로그아웃
router.post("/logout", authController.logout);

// 보호된 라우트
router.get("/me", protect, (req, res) => {
  res.json({ message: "토큰 인증 성공", userId: req.user.id });
});

module.exports = router;
