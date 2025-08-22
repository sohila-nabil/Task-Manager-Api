import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  uploadImageProfile,
} from "../controllers/authCtrl.js";
import { Router } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, validate, registerUser);
authRouter.post("/login", loginValidation, validate, loginUser);
authRouter.get("/profile", protect, getUserProfile);
authRouter.patch("/profile-update", protect, updateUserProfile);
authRouter.patch(
  "/upload",
  protect,
  upload.single("imageUrl"),
  uploadImageProfile
);

export default authRouter;
