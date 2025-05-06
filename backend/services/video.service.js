const ffmpeg = require("fluent-ffmpeg");

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
