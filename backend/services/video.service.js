const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

exports.convertToMp4 = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-c:v libx264",
        "-preset fast",
        "-crf 23",
        "-c:a aac",
        "-b:a 128k",
        "-movflags +faststart",
      ])
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
};

exports.convertToHLS = (inputPath, outputDir) => {
  return new Promise((resolve, reject) => {
    // outputDir이 없으면 생성
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    ffmpeg(inputPath)
      .outputOptions([
        "-preset veryfast",
        "-g 48",
        "-sc_threshold 0",
        "-map 0:0",
        "-map 0:1",
        "-c:v libx264",
        "-c:a aac",
        "-f hls",
        "-hls_time 10",
        "-hls_playlist_type vod",
        "-hls_segment_filename",
        path.join(outputDir, "segment_%03d.ts"),
      ])
      .output(path.join(outputDir, "index.m3u8"))
      .on("end", () => resolve(path.join(outputDir, "index.m3u8")))
      .on("error", reject)
      .run();
  });
};

/**
 * 영상에서 1초 지점 썸네일 이미지 추출
 * @param {string} videoPath - 원본 영상 경로
 * @param {string} outputPath - 저장할 썸네일 경로 (jpg)
 */
exports.generateVideoThumbnail = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ["00:00:01.000"],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: "320x?",
      })
      .on("end", resolve)
      .on("error", reject);
  });
};
