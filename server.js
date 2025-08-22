import express from "express";
// import swaggerJsdoc from "swagger-jsdoc";
import { config } from "dotenv";
import cors from "cors";
import dbConnection from "./config/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import swaggerUi from "swagger-ui-express";
const swaggerFile = require("./swagger-output.json");
config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Name,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 3000;
dbConnection();

// Swagger configuration
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Task Management API",
//       version: "1.0.0",
//       description: "API documentation for Task Management system",
//     },
//     servers: [
//       {
//         url: "http://localhost:3000/api",
//         description: "Local server",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT", // indicates you are using JWT
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [], // applies globally to all routes unless overridden
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

export default app;
