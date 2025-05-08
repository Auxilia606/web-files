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

/**
 * @swagger
 * /api/file-info/files:
 *   get:
 *     summary: 디렉토리 내 파일 목록 조회
 *     tags: [File Info]
 *     parameters:
 *       - name: directoryId
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 디렉토리 ID
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - name: size
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 한 페이지당 항목 수
 *       - name: sort
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [original_name, created_at, download_count]
 *           default: created_at
 *         description: 정렬 기준 필드
 *       - name: order
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: 정렬 방향 (오름차순/내림차순)
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
router.get("/files", fileInfoController.getFiles);

module.exports = router;
