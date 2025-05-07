// middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.FILE_LOCATION);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    req.uniqueFileName = uniqueName; // controller에서 접근할 수 있도록 저장
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/x-matroska",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("이미지 또는 동영상만 업로드 가능합니다."));
  },
});

module.exports = upload;
