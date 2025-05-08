const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { exec } = require("child_process");
const sharp = require("sharp"); // ← 추가
const db = require("../config/db");
const {
  UPLOAD_DIR,
  THUMBNAIL_DIR,
  STREAM_DIR,
} = require("../config/file-info");

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
    let thumbPath;

    // 1️⃣ 이미지 썸네일 생성
    if (file.mimetype.startsWith("image/")) {
      fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });

      thumbPath = path.join(THUMBNAIL_DIR, `${uniqueName}`);
      try {
        await sharp(targetPath)
          .rotate()
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
        storage_path, thumbnail_path, uploader_id, comment, file_hash, media_created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(insertQuery, [
      directoryId,
      uniqueName,
      file.originalname,
      file.size,
      file.mimetype,
      storagePath,
      thumbPath,
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

exports.getFiles = async (req, res) => {
  /** @type {import("../../types/file-info.dto").FileListReqDTO} */
  const query = req.query;
  /** @type {import("../../types/file-info.dto").FileListResDTO} */
  const result = {};
  const directoryId = Number(query.directoryId);
  const page = Number(query.page) || 1;
  const size = Number(query.size) || 20;
  const sortBy = query.sort || "created_at";
  const order = query.order === "desc" ? "DESC" : "ASC";
  const offset = (page - 1) * size;

  if (!directoryId) {
    result.message = "directoryId가 없습니다.";
    return res.status(400).json(result);
  }

  try {
    const [files] = await db.execute(
      `SELECT * FROM file_info WHERE directory_id = ? AND is_deleted = FALSE ORDER BY ${sortBy} ${order} LIMIT ${size} OFFSET ${offset}`,
      [directoryId]
    );

    const [[{ count }]] = await db.execute(
      `SELECT COUNT(*) as count FROM file_info WHERE directory_id = ? AND is_deleted = FALSE`,
      [directoryId]
    );

    result.message = "파일 목록 조회 성공";
    result.files = files;
    result.pagination = {
      page,
      size,
      totalCount: count,
      totalPages: Math.ceil(count / size),
    };

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    result.message = "파일 목록 조회 실패";
    res.status(500).json(result);
  }
};

exports.getThumbnail = async (req, res) => {
  const fileId = Number(req.params.id);

  try {
    // DB에서 썸네일 경로 조회
    const [[file]] = await db.execute(
      `SELECT thumbnail_path FROM file_info WHERE id = ? AND is_deleted = FALSE`,
      [fileId]
    );

    if (!file) {
      return res.status(404).send("파일을 찾을 수 없습니다");
    }

    if (!fs.existsSync(file.thumbnail_path)) {
      return res.status(404).send("썸네일이 존재하지 않습니다");
    }

    res.sendFile(file.thumbnail_path);
  } catch (e) {
    console.error(e);
    res.status(500).send("썸네일 제공 중 오류 발생");
  }
};
