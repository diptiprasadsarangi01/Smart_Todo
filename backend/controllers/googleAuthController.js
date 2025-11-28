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
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Credential missing" });
    }

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
      // New signup via Google
      user = new User({
        name,
        email,
        googleId: sub,
        profilePic: picture || "", // may be empty
      });
      await user.save();
    } else {
      // Existing user → link Google
      if (!user.googleId) {
        user.googleId = sub;
      }

      // update profile pic if empty
      if (!user.profilePic && picture) {
        user.profilePic = picture;
      }

      await user.save();
    }

    // FINAL PROFILE PIC (Google → or fallback)
    const finalAvatar =
      user.profilePic?.trim() !== ""
        ? user.profilePic
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            (user.name || email.charAt(0)).charAt(0).toUpperCase()
          )}&background=4F46E5&color=fff&size=128`;

    const token = generateToken(user);

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        profilePic: finalAvatar,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};