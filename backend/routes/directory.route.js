const express = require("express");
const router = express.Router();
const directoryController = require("../controllers/directory.controller");
const { protect } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Directory
 *   description: 디렉토리 관련 API
 */

/**
 * @swagger
 * /api/directory/create:
 *   post:
 *     summary: 디렉토리 생성
 *     tags: [Directory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentId
 *               - directoryName
 *             properties:
 *               parentId:
 *                 type: number | null
 *                 example: null
 *                 description: root directory는 parent Id null로 보내기
 *               directoryName:
 *                 type: string
 *                 example: 테스트
 *     responses:
 *       201:
 *         description: 디렉토리 생성 성공
 *       500:
 *         description: 서버 오류
 */
router.post("/create", protect, directoryController.create);

/**
 * @swagger
 * /api/directory/{id}:
 *   get:
 *     summary: 디렉토리 조회
 *     tags: [Directory]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: 디렉토리 ID, root를 조회할 때에는 0 입력
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 디렉토리 이름 변경 성공
 *       400:
 *         description: 디렉토리 이름 관련 오류
 *       404:
 *         description: 해당 디렉토리를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:id", protect, directoryController.getDirectory);

/**
 * @swagger
 * /api/directory/{id}/update-name:
 *   put:
 *     summary: 디렉토리 이름 변경
 *     tags: [Directory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 디렉토리 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - directoryName
 *             properties:
 *               directoryName:
 *                 type: string
 *                 example: 테스트
 *     responses:
 *       200:
 *         description: 디렉토리 이름 변경 성공
 *       400:
 *         description: 디렉토리 이름 관련 오류
 *       404:
 *         description: 해당 디렉토리를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put(
  "/:id/update-name",
  protect,
  directoryController.updateDirectoryName
);

/**
 * @swagger
 * /api/directory/{id}:
 *   delete:
 *     summary: 디렉토리 삭제
 *     tags: [Directory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 디렉토리 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 디렉토리 삭제 성공
 *       400:
 *         description: 디렉토리 관련 오류
 *       404:
 *         description: 해당 디렉토리를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", protect, directoryController.deleteDirectory);

module.exports = router;
