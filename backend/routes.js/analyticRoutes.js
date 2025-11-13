// routes/analyticsRoutes.js
import express from "express";
import { getTaskStats } from "../controllers/analyticsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Get completed/pending/total task stats
router.get("/stats", verifyToken, getTaskStats);

export default router;
