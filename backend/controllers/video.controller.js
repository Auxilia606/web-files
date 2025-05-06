// backend/controllers/video.controller.js
const path = require("path");
const fs = require("fs");
const { convertToMp4 } = require("../services/video.service");

exports.uploadVideo = async (req, res) => {
  try {
    const { directoryId } = req.body;
    const uploadedPath = req.file.path;
    const outputPath = uploadedPath.replace(path.extname(uploadedPath), ".mp4");

    await convertToMp4(uploadedPath, outputPath);

    // 원본 파일 삭제 (선택)
    if (uploadedPath !== outputPath) fs.unlinkSync(uploadedPath);

    // DB에 등록하는 코드 필요 (file_info 테이블 등)
    // const fileRecord = await db.insert({...})

    return res.status(201).json({
      message: "영상 업로드 및 변환 완료",
      videoPath: outputPath,
    });
  } catch (error) {
    console.error("업로드 실패:", error);
    res.status(500).json({ message: "영상 업로드 실패" });
  }
};

exports.streamVideo = (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../uploads/videos",
    req.params.filename
  );
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // 스트리밍 (Range 요청)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });
    file.pipe(res);
  } else {
    // 전체 다운로드
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(filePath).pipe(res);
  }
};
