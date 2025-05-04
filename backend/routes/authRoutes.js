const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - password
 *               - nickname
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: test
 *               password:
 *                 type: string
 *                 example: test1234!
 *               nickname:
 *                 type: string
 *                 example: 테스트
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       500:
 *         description: 서버 오류
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/check-id:
 *   post:
 *     summary: 아이디 중복 체크
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: test
 *     responses:
 *       200:
 *         description: 사용 가능한 아이디
 *       400:
 *         description: 아이디 입력하지 않은 경우
 *       409:
 *         description: 아이디 중복
 *       500:
 *         description: 서버 오류
 */
router.post("/check-id", authController.checkId);

/**
 * @swagger
 * /api/auth/check-status:
 *   get:
 *     summary: 로그인 상태 확인
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그인 상태 정상
 *       304:
 *         description: Access Token 재발급
 *       401:
 *         description: 토큰 만료
 *       500:
 *         description: 서버 오류
 */
router.get("/check-status", authController.checkStatus);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - password
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: test
 *               password:
 *                 type: string
 *                 example: test1234!
 *     responses:
 *       200:
 *         description: 로그인 성공 (AccessToken, RefreshToken 반환)
 *       401:
 *         description: 로그인 실패
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh Token으로 Access Token 재발급
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 새로운 Access Token 반환
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 내 정보 확인 (Access Token 필요)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 인증된 사용자 정보 반환
 */
router.get("/me", protect, (req, res) => {
  res.json({ message: "토큰 인증 성공", userId: req.user.id });
});

module.exports = router;
