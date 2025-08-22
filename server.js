import express from "express";
import { config } from "dotenv";
import cors from "cors";
import dbConnection from "./config/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Name,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 4000;

dbConnection();

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
