// routes/taskRoutes.js
import express from "express";
import {
  addTask,
  getTodayTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Add new task
router.post("/add", verifyToken, addTask);

// Get today's tasks
router.get("/today", verifyToken, getTodayTasks);

// Update task by ID
router.put("/:id", verifyToken, updateTask);

// Delete task by ID
router.delete("/:id", verifyToken, deleteTask);

export default router;
