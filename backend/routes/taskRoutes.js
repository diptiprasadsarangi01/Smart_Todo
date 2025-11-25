// routes/taskRoutes.js
import express from "express";
import {
  addTask,
  getTodayTasks,
  updateTask,
  deleteTask,
  getWeekTasks,
} from "../controllers/taskControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Add new task
router.post("/add", verifyToken, addTask);

// Get today's tasks
router.get("/today", verifyToken, getTodayTasks);

// Update task by ID
router.put("/:id", verifyToken, updateTask);

// Delete task by ID
router.delete("/:id", verifyToken, deleteTask);


router.get("/week", verifyToken, getWeekTasks);

export default router;
