import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";  // ✅ FIXED IMPORT
import assistantRoutes from "./routes/assistantRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware setup
console.log(" Middleware1...");
app.use(cors());

console.log(" Middleware2...");
app.use(express.json());

// console.log(" Morgan Logger...");
// app.use(morgan("dev"));   // optional but very useful for debugging

// Connect to MongoDB
console.log(" MongoDB connecting...");
connectDB();

// Connect to Redis
console.log(" Redis connecting...");
connectRedis();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes); // ✅ Now correct
app.use("/api/assistant", assistantRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("✅ AI Todo Backend is running successfully!");
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
