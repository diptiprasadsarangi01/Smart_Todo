// src/utils/parseAssistantAnswer.js

export function parseAssistantAnswer(answer) {
  /* ---------------------------------------
     1️⃣ Empty / fallback
  --------------------------------------- */
  if (!answer) {
    return {
      type: "text",
      text: "I couldn't analyze your tasks right now.",
    };
  }

  /* ---------------------------------------
     2️⃣ If answer is STRING
  --------------------------------------- */
  if (typeof answer === "string") {
    // Try parsing JSON string
    try {
      const parsed = JSON.parse(answer);

      // ✅ Structured task response
      if (Array.isArray(parsed.tasks)) {
        return {
          type: "tasks",
          heading: parsed.heading || "Task Summary",
          date: parsed.date || null,
          tasks: parsed.tasks,
        };
      }
    } catch (e) {
      // Not JSON → continue as plain text
    }

    // Plain text response
    return {
      type: "text",
      text: answer,
    };
  }

  /* ---------------------------------------
     3️⃣ If answer is already an object
  --------------------------------------- */
  if (typeof answer === "object") {
    if (Array.isArray(answer.tasks)) {
      return {
        type: "tasks",
        heading: answer.heading || "Task Summary",
        date: answer.date || null,
        tasks: answer.tasks,
      };
    }

    if (answer.text) {
      return {
        type: "text",
        text: answer.text,
      };
    }
  }

  /* ---------------------------------------
     4️⃣ Final fallback
  --------------------------------------- */
  return {
    type: "text",
    text: "I couldn't analyze your tasks right now.",
  };
}
