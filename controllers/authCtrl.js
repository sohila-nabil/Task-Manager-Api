import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "./../utils/generatToken.js";


/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * 
 * @param   {string} name - Full name of the user
 * @param   {string} email - Email (must be unique)
 * @param   {string} password - Password (hashed with bcrypt)
 * @param   {string} adminToken - Optional token to create admin
 * @param   {string} prfileImageUrl - Optional profile image
 * 
 * @returns {object} User data (without password)
 */

const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminToken, prfileImageUrl } = req.body;
    let role = "member";
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(500).json({ status: "fail", message: "User Already exist" });
    }
    if (adminToken && adminToken === process.env.ADMIN_TOKEN) {
      role = "admin";
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      imageUrl: prfileImageUrl || null,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          imageUrl: savedUser.imageUrl,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid email or password" });
    }
    const token = generateToken({ id: user._id, role: user.role });
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          imageUrl: user.imageUrl,
          token,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// try {
// } catch (error) {
//   res.status(500).json({ status: "error", message: error.message });
// }

export { registerUser, loginUser };
