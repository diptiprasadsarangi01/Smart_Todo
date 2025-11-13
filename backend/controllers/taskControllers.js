// controllers/taskController.js
import Task from "../models/Task.js";
import { setCache } from "../middleware/cacheMiddleware.js";

// ------------------------
// Add New Task
// ------------------------
export const addTask = async (req, res, next) => {
  try {
    const { title, summary, dueDate, priority } = req.body;

    const newTask = new Task({
      createdBy: req.user.id, // FIXED
      title,
      description: summary, // Your schema uses "description"
      dueDate,
      priority,
    });

    await newTask.save();

    res.status(201).json({ message: "Task added", task: newTask });
  } catch (err) {
    next(err);
  }
};

// ------------------------
// Get Today Tasks
// ------------------------
export const getTodayTasks = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      createdBy: req.user.id, // FIXED
      dueDate: { $gte: today },
    }).sort({ dueDate: 1 });

    // Cache response (if cacheMiddleware used)
    if (res.locals.cacheKey) {
      await setCache(res.locals.cacheKey, tasks);
    }

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// ------------------------
// Update Task
// ------------------------
export const updateTask = async (req, res, next) => {
  try {
    // Ownership + update
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id }, // FIXED SECURITY
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
};

// ------------------------
// Delete Task
// ------------------------
export const deleteTask = async (req, res, next) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id, // FIXED SECURITY
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
