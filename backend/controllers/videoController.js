const fs = require("fs");
const path = require("path");

/**
 * GET /video/:filename
 * 비디오 스트리밍 처리
 */
exports.streaming = (req, res) => {
  try {
    const { filename } = req.params;
    const videoPath = path.join(process.env.FILE_LOCATION, filename);

    // 확장자 제한 (mp4만 허용)
    const ext = path.extname(videoPath).toLowerCase();
    if (ext !== ".mp4") {
      return res
        .status(400)
        .json({ message: "지원하지 않는 파일 형식입니다." });
    }

    // 존재 여부 확인
    if (!fs.existsSync(videoPath)) {
      return res
        .status(404)
        .json({ message: "비디오 파일을 찾을 수 없습니다." });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Range 헤더 필수
    if (!range) {
      return res.status(416).send("Range header required");
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // 잘못된 Range 방지
    if (start >= fileSize || end >= fileSize) {
      return res.status(416).send("Requested range not satisfiable");
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    res.flushHeaders(); // 모바일에서 초기 응답 지연 방지
    file.pipe(res);
  } catch (error) {
    console.error("비디오 스트리밍 오류:", error);
    res.status(500).json({ message: "서버 오류로 스트리밍에 실패했습니다." });
  }
};
