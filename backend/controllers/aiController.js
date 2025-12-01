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
