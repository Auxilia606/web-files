const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

app.use(express.json()); // JSON 파싱
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버 실행중: http://localhost:${port}`);
});
