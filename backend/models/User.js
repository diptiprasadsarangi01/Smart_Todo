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
      minlength: 6,
      required: function () {
        // password is required only when user signs up normally
        return !this.googleId && !this.linkedinId;
      },
    },

    googleId: {
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

// Prevent duplicate email errors formatting issue
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Email already exists"));
  } else {
    next(error);
  }
});

export default mongoose.model("User", userSchema);