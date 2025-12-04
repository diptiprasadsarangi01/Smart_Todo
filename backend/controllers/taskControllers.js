// controllers/taskController.js
import Task from "../models/Task.js";
import { setCache } from "../middleware/cacheMiddleware.js";

// ------------------------
// Add New Task
// ------------------------
export const addTask = async (req, res, next) => {
  try {
    const { title, summary, dueDate, priority, category } = req.body;

    // -------------------------------
    // ⭐ Validate Due Date
    // -------------------------------
    if (!dueDate) {
      return res.status(400).json({ message: "Due date is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dueDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Due date cannot be in the past",
      });
    }

    // -------------------------------
    // ⭐ Category comes from frontend (AI button)
    // -------------------------------
    const finalCategory = category ? category.toLowerCase() : "misc";

    // -------------------------------
    // Create Task
    // -------------------------------
    const newTask = new Task({
      createdBy: req.user.id,
      title,
      description: summary,
      dueDate,
      priority,
      category: finalCategory,
    });

    await newTask.save();

    res.status(201).json({ message: "Task added", task: newTask });
  } catch (err) {
    next(err);
  }
};

// ------------------------
// Update Task
// ------------------------
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status, category } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (status !== undefined) updateData.status = status;

    // ⭐ If frontend AI gives category → use it
    if (category) {
      updateData.category = category.toLowerCase();
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
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
      createdBy: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted" });
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

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      createdBy: req.user.id,
      dueDate: {
        $gte: today,      // start of today
        $lt: tomorrow,    // before tomorrow starts
      }
    }).sort({ dueDate: 1 });

    if (res.locals.cacheKey) {
      await setCache(res.locals.cacheKey, tasks);
    }

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTodayPendingTasks = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      createdBy: req.user.id,
      dueDate: { $gte: today, $lt: tomorrow },
      status: "pending"
    }).sort({ dueDate: 1 });

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// ------------------------
// Get Week Tasks
// ------------------------
export const getWeekTasks = async (req, res, next) => {
  try {
    const now = new Date();

    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      createdBy: req.user.id,
      dueDate: { $gte: startOfWeek, $lte: endOfWeek },
    }).sort({ dueDate: 1 });

    const weekData = {};
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    days.forEach((d) => (weekData[d] = []));

    tasks.forEach((task) => {
      const taskDay = new Date(task.dueDate);
      const weekday = days[(taskDay.getDay() + 6) % 7];
      weekData[weekday].push(task);
    });

    res.status(200).json(weekData);
  } catch (err) {
    next(err);
  }
};
//-------------------
// Get Upcoming Tasks
//-------------------
// controllers/taskController.js (add below other exports)
export const getUpcomingTasks = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      createdBy: req.user.id,
      dueDate: { $gte: today },   // upcoming including today
      status: "pending",
    }).sort({ dueDate: 1 });

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};