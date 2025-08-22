import User from "../models/userModel.js";
import Task from "./../models/taskModel.js";

/**
 * Get all users (paginated, only role: "member")
 *
 * @route   GET /api/user
 * @access  Private (requires JWT authentication)
 *
 * @query {number} [page=1] - Current page number
 * @query {number} [limit=5] - Number of users per page
 *
 * @returns {Object} 200 - Success response
 * @returns {string} status - "success"
 * @returns {string} message - Success message
 * @returns {Object} data
 * @returns {Array<Object>} data.users - List of users (without password, __v, updatedAt, createdAt)
 * @returns {number} data.page - Current page
 * @returns {number} data.limit - Items per page
 * @returns {number} data.totalUsers - Total number of users
 *
 * @returns {Object} 404 - No users found
 * @returns {Object} 500 - Server error
 */
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find({ role: "member" })
      .lean() // plain objects
      .skip(skip)
      .limit(Number(limit))
      .select("-password -__v -updatedAt -createdAt");

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Users not Found", data: [] });
    }

    const userWithTasks = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user, // user is already a plain object
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: {
        users: userWithTasks,
        page: Number(page),
        limit: Number(limit),
        totalUsers: await User.countDocuments(),
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: [] });
  }
};

/**
 * Get a single user by ID (only role: "member")
 *
 * @route   GET /api/user/:id
 * @access  Private (requires JWT authentication)
 *
 * @param {string} req.params.id - User ID
 *
 * @returns {Object} 200 - Success response
 * @returns {string} status - "success"
 * @returns {string} message - Success message
 * @returns {Object} data.user - User object (without password, __v, updatedAt, createdAt)
 *
 * @returns {Object} 404 - User not found
 * @returns {Object} 500 - Server error
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      role: "member",
      _id: req.params.id,
    }).select("-password -__v -updatedAt -createdAt");

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not Found", data: {} });
    }

    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: {} });
  }
};

/**
 * Delete a user by ID
 *
 * @route   DELETE /api/user/:id
 * @access  Private (requires JWT authentication, admin recommended)
 *
 * @param {string} req.params.id - User ID
 *
 * @returns {Object} 200 - Success response
 * @returns {string} status - "success"
 * @returns {string} message - User deleted successfully
 * @returns {Object} data.user - Deleted user object
 *
 * @returns {Object} 404 - User not found
 * @returns {Object} 500 - Server error
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found", data: {} });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: {} });
  }
};

export { getAllUsers, getUserById, deleteUser };
