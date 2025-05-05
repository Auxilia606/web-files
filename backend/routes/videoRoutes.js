const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

/**
 * @swagger
 * /api/video/{filename}:
 *   get:
 *     summary: 비디오 스트리밍 요청
 *     description: 요청한 비디오 파일을 Range 기반으로 스트리밍합니다.
 *     tags:
 *       - Video
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         description: 스트리밍할 비디오 파일의 이름
 *         schema:
 *           type: string
 *     responses:
 *       206:
 *         description: 비디오 스트리밍 성공 (부분 컨텐츠)
 *       404:
 *         description: 해당 비디오 파일을 찾을 수 없음
 *       416:
 *         description: Range 헤더가 없거나 잘못됨
 */
router.get("/:filename", videoController.streaming);

module.exports = router;
