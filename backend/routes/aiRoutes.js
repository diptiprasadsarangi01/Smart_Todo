// src/routes/aiRoutes.js
import express from "express";
import { processTaskAI , rankTasksAI } from "../controllers/aiController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// AI route → Generate title, description, priority
router.post("/process", verifyToken, processTaskAI);
router.post("/rank", verifyToken, rankTasksAI);  
export default router;