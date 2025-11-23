// controllers/googleAuthController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });


// -----------------------------------------
// 🔵 GOOGLE LOGIN
// -----------------------------------------
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // Google token from frontend

    if (!credential) {
      return res.status(400).json({ message: "Credential missing" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google email not found" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // New Google user
      user = new User({
        name,
        email,
        googleId: sub,
        profilePic: picture,
      });
      await user.save();
    } else {
      // Link Google account to existing user
      if (!user.googleId) {
        user.googleId = sub;
        if (!user.profilePic) user.profilePic = picture;
        await user.save();
      }
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};
