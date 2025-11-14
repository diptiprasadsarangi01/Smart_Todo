import Task from "../models/Task.js";

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken

    const total = await Task.countDocuments({ createdBy: userId });
    const completed = await Task.countDocuments({ createdBy: userId, status: "completed" });
    const pending = await Task.countDocuments({ createdBy: userId, status: "pending" });

    res.status(200).json({ total, completed, pending });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};