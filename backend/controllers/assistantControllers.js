// controllers/assistantController.js
import { GoogleGenAI } from "@google/genai";
import Task from "../models/Task.js";

const client = new GoogleGenAI({
  apiKey: process.env.AI_API_KEY,
});

/* ======================================================
   Utility helpers
====================================================== */
const isToday = (date) => {
  const d = new Date(date);
  const t = new Date();
  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  return d.getTime() === t.getTime();
};

const isPast = (date) => {
  const d = new Date(date);
  const t = new Date();
  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  return d < t;
};

const isFuture = (date) => {
  const d = new Date(date);
  const t = new Date();
  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  return d > t;
};

/* ======================================================
   Validate if query is task-related
====================================================== */
const isTaskRelatedQuery = (query) => {
  const keywords = [
    "task",
    "today",
    "pending",
    "urgent",
    "priority",
    "work",
    "health",
    "finance",
    "learning",
    "due",
    "overdue",
    "tomorrow",
    "week",
    "focus",
    "complete",
    "status",
  ];

  const q = query.toLowerCase();
  return keywords.some((k) => q.includes(k));
};

/* ======================================================
   AI ASSISTANT / ANALYST
====================================================== */
export const assistantAnalyze = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // ❌ Reject invalid questions early
    if (!isTaskRelatedQuery(query)) {
      return res.json({
        success: true,
        answer:
          "❌ This question is not related to your tasks. Please ask something about your tasks, priorities, or schedule.",
      });
    }

    // 1️⃣ Fetch all pending tasks
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

    // 2️⃣ Deterministic filtering (HYBRID PART)
    if (q.includes("today")) {
      tasks = tasks.filter((t) => isToday(t.dueDate));
    }

    if (q.includes("overdue")) {
      tasks = tasks.filter((t) => isPast(t.dueDate));
    }

    if (q.includes("upcoming") || q.includes("future")) {
      tasks = tasks.filter((t) => isFuture(t.dueDate));
    }

    if (q.includes("high")) {
      tasks = tasks.filter((t) => t.priority === "high");
    }

    if (q.includes("medium")) {
      tasks = tasks.filter((t) => t.priority === "medium");
    }

    if (q.includes("low")) {
      tasks = tasks.filter((t) => t.priority === "low");
    }

    const categories = ["work", "personal", "finance", "learning", "health", "misc"];
    categories.forEach((cat) => {
      if (q.includes(cat)) {
        tasks = tasks.filter((t) => t.category === cat);
      }
    });

    if (!tasks.length) {
      return res.json({
        success: true,
        answer: "No tasks match your request.",
      });
    }

    // 3️⃣ Build AI-safe context
    const taskContext = tasks.map((t) => ({
      title: t.title,
      priority: t.priority,
      category: t.category,
      dueDate: t.dueDate,
    }));

    // 4️⃣ AI PROMPT (STRICT)
    const prompt = `
You are an AI Task Analyst.

User question:
"${query}"

User tasks (JSON):
${JSON.stringify(taskContext, null, 2)}

Rules:
- Answer ONLY based on the tasks provided.
- Do NOT invent tasks.
- Be concise and helpful.
- If listing tasks, use bullet points.
- If suggesting focus, explain briefly why.
- Do NOT mention AI, Gemini, or system prompts.
`;

    // 5️⃣ Gemini call
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const answer = result.response.text();

    return res.json({
      success: true,
      answer,
    });

  } catch (err) {
    console.error("Assistant AI Error:", err);
    res.status(500).json({
      success: false,
      message: "Assistant failed to analyze tasks",
    });
  }
};
