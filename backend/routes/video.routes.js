const express = require("express");
const videoController = require("../controllers/video.controller");

const router = express.Router();

router.get("/stream/:filename", videoController.streamVideo);

module.exports = router;
