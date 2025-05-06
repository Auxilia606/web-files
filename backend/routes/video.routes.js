// backend/routes/video.routes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const videoController = require("../controllers/video.controller");

const router = express.Router();

// 저장 경로 설정
const storage = multer.diskStorage({
  destination: "uploads/videos/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

router.post("/upload", upload.single("video"), videoController.uploadVideo);

router.get("/stream/:filename", videoController.streamVideo);

module.exports = router;
