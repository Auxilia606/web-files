// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express + MySQL + JWT API",
      version: "1.0.0",
      description: "빠른 인증 API 서버",
    },
    servers: [
      {
        url: "http://localhost:8000", // 개발 서버 주소
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // API 문서화할 파일 경로
};

const specs = swaggerJSDoc(options);
module.exports = specs;
