import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini client (NO billing required)
const client = new GoogleGenAI({
  apiKey: process.env.AI_API_KEY,
});

/* =======================================================
   AI — Process Task (Generate title, desc, priority)
======================================================= */
export const processTaskAI = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Using the same free model your old app uses
    const request = {
      model: "gemini-2.5-flash", 
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze this task and return JSON:
{
  "title": "3-6 word title",
  "description": "1-2 sentence description",
  "priority": "low | medium | high"
}

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
