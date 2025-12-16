// routes/assistantRoutes.js
import express from "express";
import { assistantAnalyze } from "../controllers/assistantControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/analyze", verifyToken, assistantAnalyze);

export default router;
