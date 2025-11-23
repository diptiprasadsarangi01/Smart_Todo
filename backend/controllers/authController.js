// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js"; 

// Create JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* =====================================================
   🔵 SEND OTP (Step 1)
===================================================== */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // If user doesn’t exist → create temp user
    if (!user) {
      user = new User({
        email,
        name: "unverified",
        password: "unverified",
        isVerified: false,
      });
    }

    // Add OTP & expiry
    user.verificationCode = otp;
    user.verificationCodeExpires = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // Send OTP via Email
    await sendEmail(
      email,
      "Your Verification Code",
      `<h2>Your OTP is: <b>${otp}</b></h2>`
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

/* =====================================================
   🔵 VERIFY OTP (Step 2)
===================================================== */
export const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const expired = user.verificationCodeExpires < Date.now();
    const mismatch = user.verificationCode !== code;

    if (expired || mismatch) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* =====================================================
   🟢 FINAL SIGNUP (Step 3 — after OTP verification)
===================================================== */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not found. Verify OTP first." });

    if (!user.isVerified)
      return res.status(400).json({ message: "Email not verified" });

    const hashed = await bcrypt.hash(password, 10);

    // Complete profile
    user.name = name;
    user.password = hashed;
    await user.save();

    const token = generateToken(user);

    res.json({ message: "Signup completed successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

/* =====================================================
   🟢 NORMAL LOGIN
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Email not verified" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
