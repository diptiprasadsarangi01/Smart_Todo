// src/pages/AIAnalyst.jsx
import React, { useState } from "react";
import AnalystChat from "../components/AnalystChat";
import AnalystQuickActions from "../components/AnalystQuickActions";
import { askAnalyst } from "../api/analyst";

export default function AIAnalyst() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await askAnalyst(text);

      const aiMsg = {
        role: "assistant",
        text: res.answer || "I couldn't analyze that.",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main Chat */}
      <div className="lg:col-span-2 card-glass p-6 flex flex-col">
        <AnalystChat
          messages={messages}
          onSend={handleAsk}
          loading={loading}
        />
      </div>

      {/* Sidebar */}
      <aside className="card-glass p-6">
        <AnalystQuickActions onSelect={handleAsk} />
      </aside>
    </div>
  );
}
