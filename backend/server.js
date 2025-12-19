import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import userRoutes from "./routes/userRoutes.js";   // ✅ IMPORTANT
import aiRoutes from "./routes/aiRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// Connect DB + Redis
connectDB();
connectRedis();

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/user", userRoutes);   // ✅ FIXED — now /me route works

// Root test
app.get("/", (req, res) => {
  res.send("✅ AI Todo Backend is running successfully!");
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

