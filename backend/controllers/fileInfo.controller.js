const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { exec } = require("child_process");
const sharp = require("sharp"); // ← 추가
const db = require("../config/db");

const UPLOAD_DIR = path.join(
  process.env.FILE_LOCATION ?? __dirname,
  process.env.UPLOAD_LOCATION
);

const THUMBNAIL_DIR = path.join(
  process.env.FILE_LOCATION ?? __dirname,
  process.env.THUMBNAIL_LOCATION
);

const STREAM_DIR = path.join(
  process.env.FILE_LOCATION ?? __dirname,
  process.env.STREAM_LOCATION
);

function convertToHLS(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i "${inputPath}" -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "${outputDir}/output.m3u8"`;
    exec(cmd, (error) => {
      if (error) return reject(error);
      resolve(`${outputDir}/output.m3u8`);
    });
  });
}

exports.uploadFile = async (req, res) => {
  const file = req.file;
  const { directoryId, comment, mediaCreatedAt } = req.body;
  const userId = req.user?.id || null;

  if (!file || !directoryId) {
    return res
      .status(400)
      .json({ message: "파일과 디렉토리 아이디는 필수입니다." });
  }

  try {
    const fileBuffer = fs.readFileSync(file.path);
    const fileHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    const uniqueName = req.uniqueFileName;
    const targetPath = path.join(UPLOAD_DIR, uniqueName);

    fs.renameSync(file.path, targetPath);
    let storagePath = targetPath;

    // 1️⃣ 이미지 썸네일 생성
    if (file.mimetype.startsWith("image/")) {
      fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });

      const thumbPath = path.join(THUMBNAIL_DIR, `${uniqueName}`);
      try {
        await sharp(targetPath)
          .resize(200, 200, { fit: "cover" })
          .toFile(thumbPath);
        // 필요 시 thumbPath를 DB에 추가 가능
      } catch (e) {
        console.error("썸네일 생성 실패:", e);
      }
    }

    // 2️⃣ 동영상 HLS 변환
    if (file.mimetype.startsWith("video/")) {
      const targetStreamDir = path.join(STREAM_DIR, uniqueName);
      fs.mkdirSync(targetStreamDir, { recursive: true });

      try {
        await convertToHLS(targetPath, targetStreamDir);
        storagePath = path.join(targetStreamDir, "output.m3u8");
      } catch (e) {
        console.error("HLS 변환 실패:", e);
        return res.status(500).json({ message: "HLS 변환 실패" });
      }
    }

    // 3️⃣ DB 저장
    const insertQuery = `
      INSERT INTO file_info (
        directory_id, file_name, original_name, file_size, mime_type,
        storage_path, uploader_id, comment, file_hash, media_created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(insertQuery, [
      directoryId,
      uniqueName,
      file.originalname,
      file.size,
      file.mimetype,
      storagePath,
      userId,
      comment || null,
      fileHash,
      mediaCreatedAt,
    ]);

    return res.status(200).json({ message: "파일 업로드 성공" });
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    return res.status(500).json({ message: "서버 오류로 파일 업로드 실패" });
  }
};
