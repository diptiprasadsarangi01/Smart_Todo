// controllers/assistantController.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Task from "../models/Task.js";

dotenv.config();

/* ======================================================
   Gemini Client
====================================================== */
const client = new GoogleGenAI({
  apiKey: process.env.AI_API_KEY,
});

const MODEL = process.env.AI_MODEL || "gemini-2.5-flash-lite";

/* ======================================================
   Utility helpers
====================================================== */
const normalizeDate = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const isToday = (date) =>
  normalizeDate(date).getTime() === normalizeDate(new Date()).getTime();

const isPast = (date) =>
  normalizeDate(date) < normalizeDate(new Date());

const isFuture = (date) =>
  normalizeDate(date) > normalizeDate(new Date());

/* ======================================================
   Basic intent validation
====================================================== */
const isTaskRelatedQuery = (query) => {
  const keywords = [
    "task", "today", "pending", "urgent", "priority",
    "work", "health", "finance", "learning",
    "due", "overdue", "tomorrow", "week",
    "focus", "complete", "status",
  ];
  return keywords.some((k) => query.toLowerCase().includes(k));
};

/* ======================================================
   AI ASSISTANT / ANALYST
====================================================== */
export const assistantAnalyze = async (req, res) => {
  try {
    const todayStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    const userId = req.user.id;
    const { query } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    if (!isTaskRelatedQuery(query)) {
      return res.json({
        success: true,
        answer: "❌ Please ask something related to your tasks, priorities, or schedule.",
      });
    }

    /* 1️⃣ Fetch pending tasks */
    let tasks = await Task.find({
      createdBy: userId,
      status: "pending",
    }).lean();

    if (!tasks.length) {
      return res.json({
        success: true,
        answer: "🎉 You have no pending tasks.",
      });
    }

    const q = query.toLowerCase();

    /* 2️⃣ Deterministic filtering */
    if (q.includes("today")) tasks = tasks.filter(t => t.dueDate && isToday(t.dueDate));
    if (q.includes("overdue")) tasks = tasks.filter(t => t.dueDate && isPast(t.dueDate));
    if (q.includes("upcoming") || q.includes("future"))
      tasks = tasks.filter(t => t.dueDate && isFuture(t.dueDate));

    if (q.includes("high")) tasks = tasks.filter(t => t.priority === "high");
    if (q.includes("medium")) tasks = tasks.filter(t => t.priority === "medium");
    if (q.includes("low")) tasks = tasks.filter(t => t.priority === "low");

    ["work", "personal", "finance", "learning", "health", "misc"].forEach(cat => {
      if (q.includes(cat)) tasks = tasks.filter(t => t.category === cat);
    });

    if (!tasks.length) {
      return res.json({ success: true, answer: "No tasks match your request." });
    }

    /* 3️⃣ Build AI-safe context */
    const taskContext = tasks.map((t) => ({
      title: t.title,
      priority: t.priority,
      category: t.category,
      dueDate: t.dueDate
        ? new Date(t.dueDate).toISOString().split("T")[0]
        : null,
    }));

    /* 4️⃣ AI Prompt */
    const prompt = `
You are an AI Task Analyst.

Today's date is: ${todayStr}

User question:
"${query}"

User tasks (JSON):
${JSON.stringify(taskContext, null, 2)}

Return ONLY valid JSON in this format:

{
  "heading": "<short heading>",
  "date": "YYYY-MM-DD",
  "tasks": [
    {
      "title": "<task title>",
      "priority": "low | medium | high",
      "due": "YYYY-MM-DD"
    }
  ]
}

Rules:
- Do NOT include numbering or sentences
- Do NOT repeat explanations
- If no tasks, return empty array
- Never include markdown or emojis
`;

    /* 5️⃣ Gemini call */
    const result = await client.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    /* 6️⃣ Safe extraction */
    const answer =
      result?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ||
      "I couldn't analyze your tasks right now.";

    return res.json({ success: true, answer });

  } catch (err) {
    console.error("Assistant AI Error:", err);
    return res.status(500).json({
      success: false,
      message: "Assistant failed to analyze tasks",
    });
  }
};
