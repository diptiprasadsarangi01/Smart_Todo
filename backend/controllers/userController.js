// controllers/userController.js
import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   🟢 UPDATE USER DETAILS
===================================================== */
export const updateUser = async (req, res) => {
  try {
    const { name, bio, profilePic } = req.body;

    // Find current user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update fields if provided
    if (name) user.name = name;
    if (bio || bio === "") user.bio = bio; // allow empty string
    // Validate Base64 image if provided
    if (profilePic) {
      if (!profilePic.startsWith("data:image/")) {
        return res.status(400).json({ message: "Invalid image format" });
      }
      user.profilePic = profilePic;
    }

    await user.save();

    // Return updated user (excluding password)
    const updatedUser = await User.findById(req.user.id).select("-password");

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};