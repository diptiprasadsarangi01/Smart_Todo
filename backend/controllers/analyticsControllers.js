// controllers/analyticsController.js
import Task from "../models/Task.js";

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const completed = await Task.countDocuments({ userId, completed: true });
    const pending = await Task.countDocuments({ userId, completed: false });

    res.status(200).json({
      completed,
      pending,
      total: completed + pending,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
};
