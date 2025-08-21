import express from "express";
import { config } from "dotenv";
import cors from "cors";
import dbConnection from "./config/dbConnection.js";
import authRouter from "./routes/authRoute.js";

config();
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
app.use('/api/auth',authRouter)

app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});


export default app;