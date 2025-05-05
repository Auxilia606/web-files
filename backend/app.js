const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const directoryRoutes = require("./routes/directoryRoutes");
const videoRoutes = require("./routes/videoRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/video", videoRoutes);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 모든 요청을 index.html로 리다이렉트 (SPA 대응)
app.get("*all", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버 실행중: http://localhost:${port}`);
  console.log(`Swagger 문서: http://localhost:${port}/api-docs`);
});
