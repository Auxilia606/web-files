const express = require("express");
const router = express.Router();
const fileInfoController = require("../controllers/fileInfo.controller");
const upload = require("../middlewares/upload.middleware");

/**
 * @swagger
 * tags:
 *   name: File Info
 *   description: 디렉토리 관련 API
 */

/**
 * @swagger
 * /api/file-info/upload:
 *   post:
 *     summary: 파일 업로드 (이미지 또는 동영상)
 *     tags: [File Info]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - directoryId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 파일 (이미지 또는 동영상)
 *               directoryId:
 *                 type: integer
 *                 description: 업로드할 디렉토리 ID
 *                 example: 1
 *               comment:
 *                 type: string
 *                 description: 파일에 대한 코멘트
 *                 example: 샘플 영상입니다
 *     responses:
 *       200:
 *         description: 파일 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 파일 업로드 성공
 *       400:
 *         description: 요청 오류 (파일 또는 디렉토리 ID 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 파일과 디렉토리 아이디는 필수입니다.
 *       500:
 *         description: 서버 오류 또는 HLS 변환 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 오류로 파일 업로드 실패
 */
router.post("/upload", upload.single("file"), fileInfoController.uploadFile);

module.exports = router;
