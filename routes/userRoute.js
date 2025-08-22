import {
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/userCtrl.js";
import { Router } from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.get("/", protect, adminOnly, getAllUsers);
userRouter.get("/:id", protect, getUserById);

userRouter.delete("/:id", protect, adminOnly, deleteUser);

export default userRouter;
