import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChicklist,
  getDashboardData,
} from "../controllers/taskCtrl.js";
import { Router } from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const taskRouter = Router();

taskRouter.post("/", protect, adminOnly, createTask);
taskRouter.get("/dashboard-data", protect, adminOnly, getDashboardData);
taskRouter.get("/user-data", protect, getDashboardData);
taskRouter.get("/", protect, getTasks);
taskRouter.get("/:id", protect, getTaskById);

taskRouter.patch("/:id", protect, updateTask);
taskRouter.patch("/status/:id", protect, updateTaskStatus);
taskRouter.patch("/checklist/:id", protect, updateTaskChicklist);

taskRouter.delete("/:id", protect, adminOnly, deleteTask);

export default taskRouter;
