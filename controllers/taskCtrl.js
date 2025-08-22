import Task from "../models/taskModel.js";

/***
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    console.log(todoChecklist);

    const newTask = new Task({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user.id,
      attachments,
      todoChecklist: todoChecklist || [],
    });

    const savedTask = await newTask.save();
    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      data: { task: savedTask },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

/***
 * @route   GET /api/tasks
 * @desc    Get all tasks (all tasks for admin, user's tasks for others)
 * @access  Private
 */
const getTasks = async (req, res) => {
  const { page = 1, limit = 5, status } = req.query;
  const skip = (page - 1) * limit;
  const filter = {};
  let tasks = [];

  if (status) {
    filter.status = status;
  }
  try {
    if (req.user.role === "admin") {
      tasks = await Task.find({ ...filter })
        .skip(skip)
        .limit(Number(limit))
        .populate("assignedTo", "name email imageUrl")
        .populate("createdBy", "name email imageUrl")
        .lean();
    } else {
      filter.assignedTo = req.user.id;
      tasks = await Task.find({ ...filter })
        .skip(skip)
        .limit(Number(limit))
        .populate("assignedTo", "name email imageUrl")
        .populate("createdBy", "name email imageUrl")
        .lean();
    }
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Tasks not found", data: [] });
    }

    tasks = await Promise.all(
      tasks.map(async (task) => {
        const todoCount = task.todoChecklist ? task.todoChecklist.length : 0;
        const completedTodos = task.todoChecklist
          ? task.todoChecklist.filter((todo) => todo.completed).length
          : 0;
        return {
          ...task,
          todoCount,
          completedTodos,
        };
      })
    );

    // status summery count

    let tasksCount = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user.id }
    );

    const statusSummary = {
      Pending: await Task.countDocuments({
        ...filter,
        status: "Pending",
      }),
      "In Progress": await Task.countDocuments({
        ...filter,
        status: "In Progress",
      }),
      Completed: await Task.countDocuments({
        ...filter,
        status: "Completed",
      }),
    };

    res.status(200).json({
      status: "success",
      message: "Tasks fetched successfully",
      data: {
        tasks,
        page: Number(page),
        limit: Number(limit),
        totalTasks: await Task.countDocuments(filter),
        tasksCount,
        statusSummary,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

/***
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @param   {string} id - Task ID
 * @access  Private
 */

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id)
      .populate("assignedTo", "name email imageUrl")
      .populate("createdBy", "name email imageUrl")
      .lean();
    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found", data: null });
    }
    const todoCount = task.todoChecklist ? task.todoChecklist.length : 0;
    const completedTodos = task.todoChecklist
      ? task.todoChecklist.filter((todo) => todo.completed).length
      : 0;
    res.status(200).json({
      status: "success",
      message: "Task fetched successfully",
      data: {
        task: {
          ...task,
          todoCount,
          completedTodos,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

/***
 * @route   PATCH /api/tasks/:id
 * @desc    Update task by ID
 * @param   {string} id - Task ID
 * @access  Private
 */
const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
      .populate("assignedTo", "name email imageUrl")
      .populate("createdBy", "name email imageUrl")
      .lean();
    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found", data: null });
    }
    const todoCount = task.todoChecklist ? task.todoChecklist.length : 0;
    const completedTodos = task.todoChecklist
      ? task.todoChecklist.filter((todo) => todo.completed).length
      : 0;
    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      data: {
        task: {
          ...task,
          todoCount,
          completedTodos,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

/***
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task by ID
 * @param   {string} id - Task ID
 * @access  Private
 */
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found", data: null });
    }
    res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

/***
 * @route   PATCH /api/tasks/status/:id
 * @desc    Update task Status
 * @param   {string} id - Task ID
 * @access  Private
 */
const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(id)
      .populate("assignedTo", "name email imageUrl")
      .populate("createdBy", "name email imageUrl");
    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found", data: null });
    }

    const isAssignedToUser = task.assignedTo.some(
      (user) => user._id.toString() === req.user.id
    );

    if (!isAssignedToUser && req.user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to update this task",
        data: null,
      });
    }

    task.status = status || task.status;
    if (task.status === "Completed") {
      task.todoChecklist.forEach((todo) => {
        todo.completed = true;
      });
      task.progress = 100;
    }

    await task.save();

    const todoCount = task.todoChecklist ? task.todoChecklist.length : 0;
    const completedTodos = task.todoChecklist
      ? task.todoChecklist.filter((todo) => todo.completed).length
      : 0;

    res.status(200).json({
      status: "success",
      message: "Task status updated successfully",
      data: {
        task: {
          ...task.toObject(),
          todoCount,
          completedTodos,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

/***
 * @route   PATCH /api/tasks/checklist/:id
 * @desc    Update task checklist
 * @param   {string} id - Task ID
 * @access  Private
 */
const updateTaskChicklist = async (req, res) => {
  const { id } = req.params;
  const { todoChecklist } = req.body;

  try {
    const task = await Task.findById(id)
      .populate("assignedTo", "name email imageUrl")
      .populate("createdBy", "name email imageUrl");
    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found", data: null });
    }

    if (!task.assignedTo.includes(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to update this task",
        data: null,
      });
    }
    task.todoChecklist = todoChecklist || task.todoChecklist;
    const completedTodos = task.todoChecklist.filter(
      (todo) => todo.completed
    ).length;
    const totalTodos = task.todoChecklist.length;
    task.progress =
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0 && task.progress < 100) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }
    await task.save();
    res.status(200).json({
      status: "success",
      message: "Todo checklist updated successfully",
      data: {
        task: {
          ...task.toObject(),
          todoCount: task.todoChecklist.length,
          completedTodos: completedTodos,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

/***
 * @route   GET /api/tasks/dashboard-data
 * @desc    Get Dashboard Data
 * @access  Private
 */

const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const inProgressTasks = await Task.countDocuments({
      status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    const recentTasks = await Task.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("createdAt title status dueDate priority")
      .lean();

    res.status(200).json({
      status: "success",
      message: "Dashboard data fetched successfully",
      data: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        recentTasks: recentTasks.map((task) => ({
          ...task,
          dueDate: task.dueDate
            ? task.dueDate.toISOString().split("T")[0]
            : null,
        })),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

const getUserDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ assignedTo: req.user.id });
    const pendingTasks = await Task.countDocuments({
      status: "Pending",
      assignedTo: req.user.id,
    });
    const inProgressTasks = await Task.countDocuments({
      status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({
      status: "Completed",
      assignedTo: req.user.id,
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: req.user.id,
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    const recentTasks = await Task.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("createdAt title status dueDate priority")
      .lean();

    res.status(200).json({
      status: "success",
      message: "Dashboard data fetched successfully",
      data: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        recentTasks: recentTasks.map((task) => ({
          ...task,
          dueDate: task.dueDate
            ? task.dueDate.toISOString().split("T")[0]
            : null,
        })),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChicklist,
  getDashboardData,
  getUserDashboardData,
};
