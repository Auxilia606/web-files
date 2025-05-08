const path = require("path");

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

module.exports = {
  UPLOAD_DIR,
  THUMBNAIL_DIR,
  STREAM_DIR,
};
