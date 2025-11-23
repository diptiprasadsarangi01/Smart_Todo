import express from "express";
import {sendOTP, verifyOTP, signup, login } from "../controllers/authController.js";
import { googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

export default router;