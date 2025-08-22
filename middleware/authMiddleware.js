import jwt from "jsonwebtoken";
import User from "../models/userModel.js";



const protect = async (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "fail", message: "Not authorized, no token" });
  }
  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res
      .status(401)
      .json({ status: "fail", message: "Not authorized, invalid token" });
  }
  
  const user = await User.findById(decoded.id);
  
  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }
  req.user = decoded;
  next();
};

const adminOnly = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ status: "fail", message: "Access denied, only admin" });
  }
  next();
};

export { protect, adminOnly };
