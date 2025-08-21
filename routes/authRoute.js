import { loginUser, registerUser } from "../controllers/authCtrl.js";
import { Router } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, validate, registerUser);
authRouter.post("/login", loginValidation, validate, loginUser);

export default authRouter;
