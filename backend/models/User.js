import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // password only required for normal signup, not for Google/LinkedIn
        return !this.googleId && !this.linkedinId;
      },
      minlength: 6,
    },
    googleId: {
      type: String,
      default: null,
    },
    linkedinId: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
