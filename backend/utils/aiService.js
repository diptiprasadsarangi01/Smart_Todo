// src/services/aiService.js
import axios from "axios";

const PROVIDER = process.env.AI_PROVIDER || "GENERIC"; // "GENERIC", "OPENAI", "GEMINI"

const genHeaders = () => {
  // Example for OpenAI
  if (PROVIDER === "OPENAI") {
    return { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` };
  }
  // Example for Gemini (Google) — adapt to your call style:
  if (PROVIDER === "GEMINI") {
    return { Authorization: `Bearer ${process.env.GOOGLE_API_KEY}` };
  }
  return {};
};

/**
 * generate - send prompt to LLM, return text output
 * @param {string} prompt
 * @param {object} options (optional) e.g. { max_tokens }
 */
export async function generate(prompt, options = {}) {
  // PROVIDER-AGNOSTIC: return plain text
  if (PROVIDER === "OPENAI") {
    const payload = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      prompt,
      max_tokens: options.max_tokens || 400,
      temperature: options.temperature ?? 0.1,
    };
    const res = await axios.post("https://api.openai.com/v1/completions", payload, {
      headers: { ...genHeaders(), "Content-Type": "application/json" },
    });
    return res.data.choices?.[0]?.text ?? "";
  }

  if (PROVIDER === "GEMINI") {
    // Example placeholder — adapt to Google Generative API call you use
    const res = await axios.post(
      process.env.GEMINI_ENDPOINT || "https://generative.googleapis.com/v1beta2/models/...",
      { prompt, ...options },
      { headers: { ...genHeaders(), "Content-Type": "application/json" } }
    );
    // adapt to response shape
    return res.data.outputText ?? JSON.stringify(res.data);
  }

  // Generic fallback — echo back (useful for local dev)
  return `AI (simulated) response for prompt: ${prompt.slice(0, 200)}`;
}
