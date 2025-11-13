// routes/assistantRoutes.js
import express from "express";
import { chatWithAssistant } from "../controllers/assistantControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// AI Assistant chat
router.post("/chat", verifyToken, chatWithAssistant);

export default router;
