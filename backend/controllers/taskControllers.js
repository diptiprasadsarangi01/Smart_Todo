// controllers/taskController.js
import Task from "../models/Task.js";

export const addTask = async (req, res) => {
  try {
    const { title, summary, dueDate, priority } = req.body;
    const newTask = new Task({
      userId: req.user.id,
      title,
      summary,
      dueDate,
      priority,
    });
    await newTask.save();
    res.status(201).json({ message: "Task added", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Error adding task", error: err.message });
  }
};

export const getTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      userId: req.user.id,
      dueDate: { $gte: today },
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching today's tasks", error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};
