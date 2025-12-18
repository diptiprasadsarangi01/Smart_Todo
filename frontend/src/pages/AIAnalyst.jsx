// src/pages/AIAnalyst.jsx
import React, { useState } from "react";
import AnalystChat from "../components/AnalystChat";
import AnalystQuickActions from "../components/AnalystQuickActions";
import { askAnalyst } from "../api/analyst";
import { parseAssistantAnswer } from "../utils/parseAssistantAnswer";

export default function AIAnalyst() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (text) => {
    if (!text.trim()) return;

    // ✅ User message (standardized)
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        payload: { type: "text", text },
      },
    ]);

    setLoading(true);

    try {
      const res = await askAnalyst(text);
      const parsed = parseAssistantAnswer(res.answer);

      // ✅ Assistant message (standardized)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          payload: parsed,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          payload: {
            type: "text",
            text: "Something went wrong. Please try again.",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-full">
      {/* Chat */}
      <div className="lg:col-span-2 card-glass flex flex-col h-74 lg:h-full overflow-hidden">
        <AnalystChat
          messages={messages}
          onSend={handleAsk}
          loading={loading}
        />
      </div>

      {/* Sidebar */}
      <aside className="card-glass p-4  lg:p-6 overflow-y-auto">
        <AnalystQuickActions onSelect={handleAsk} />
      </aside>
    </div>
  );
}
