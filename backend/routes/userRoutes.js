import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getCurrentUser,updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser);
router.patch("/update", verifyToken, updateUser);

export default router;