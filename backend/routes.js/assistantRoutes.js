// routes/assistantRoutes.js
import express from "express";
import { chatWithAssistant } from "../controllers/assistantController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// AI Assistant chat
router.post("/chat", verifyToken, chatWithAssistant);

export default router;
