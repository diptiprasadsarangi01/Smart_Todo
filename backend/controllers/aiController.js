import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini client
const client = new GoogleGenAI({
  apiKey: process.env.AI_API_KEY,
});

/* =======================================================
   AI — Process Task (Generate title, desc, priority, category)
======================================================= */
export const processTaskAI = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const request = {
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze this user task and respond ONLY with a JSON object.

Return JSON in this exact format:

{
  "title": "3-6 word clean title",
  "description": "1-2 sentence helpful description",
  "priority": "low | medium | high",
  "category": "work | personal | finance | learning | health | misc"
}

Rules:
- Pick ONLY ONE category.
- Follow these category meanings:
  • work → job, office, professional tasks
  • personal → lifestyle, home, shopping, family
  • finance → bills, payments, money, banking
  • learning → study, courses, exams, skills
  • health → doctor, medicine, exercise, self-care
  • misc → anything that doesn't fit above

Task: "${text}"
              `,
            },
          ],
        },
      ],
    };

    const result = await client.models.generateContent(request);

    const responseText =
      result.response?.text() || result.text || "";

    // Extract JSON from AI output safely
    const cleanJSON = responseText.slice(
      responseText.indexOf("{"),
      responseText.lastIndexOf("}") + 1
    );

    const data = JSON.parse(cleanJSON);

    return res.status(200).json({
      success: true,
      ai: data,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      success: false,
      message: "AI failed to process task",
      error: error.message,
    });
  }
};

// controllers/aiController.js (add this new function)
export const rankTasksAI = async (req, res) => {
  try {
    const { tasks } = req.body; // array of task objects
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ success: false, message: "No tasks provided" });
    }

    // Build concise prompt: id + title + short desc + due info + priority + category
    const lines = tasks.map((t, idx) => {
      const due = t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "no-date";
      const shortDesc = (t.description || t.summary || "").replace(/\n/g, " ").slice(0, 300);
      return `${idx + 1}) id:${t._id || t.id} | Title:${t.title} | Desc:${shortDesc} | Due:${due} | Priority:${t.priority || 'medium'} | Category:${t.category || 'misc'}`;
    });

    const prompt = `
You are a productivity assistant. Given the list of tasks below, score each task on a scale 0-100 by importance/urgency (100 = highest priority). Return ONLY valid JSON array of objects in the same order as input:

[
  {"id":"<id>", "aiScore": <integer 0-100>, "reason": "<1-2 sentence reason>"}
]

Tasks:
${lines.join("\n")}
`;

    // call your client (example using GoogleGenAI from your other file)
    const request = {
      model: process.env.AI_MODEL || "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const result = await client.models.generateContent(request);
    const responseText = result.response?.text() || result.text || "";

    // Extract JSON block and parse safely
    const start = responseText.indexOf("[");
    const end = responseText.lastIndexOf("]") + 1;
    const jsonText = start >= 0 && end >= 0 ? responseText.slice(start, end) : null;

    if (!jsonText) {
      console.error("AI rank returned non-JSON:", responseText);
      return res.status(500).json({ success: false, message: "AI returned invalid response" });
    }

    const parsed = JSON.parse(jsonText);

    // Validate parsed format
    if (!Array.isArray(parsed)) {
      return res.status(500).json({ success: false, message: "AI returned invalid structure" });
    }

    return res.status(200).json({ success: true, rankings: parsed });
  } catch (err) {
    console.error("AI ranking error:", err);
    return res.status(500).json({ success: false, message: "AI ranking failed", error: err.message });
  }
};


