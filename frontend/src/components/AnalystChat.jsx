import React, { useState } from "react";
import AnalystMessage from "./AnalystMessage";

export default function AnalystChat({ messages, onSend, loading }) {
  const [input, setInput] = useState("");

  const submit = () => {
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <p className="text-white/40 text-sm">
            Ask me about your tasks, priorities, or plans.
          </p>
        )}

        {messages.map((m, i) => (
          <AnalystMessage key={i} role={m.role} text={m.text} />
        ))}

        {loading && (
          <p className="text-xs text-white/50">Analyzing your tasks…</p>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your tasks..."
          className="flex-1 p-3 rounded bg-white/5 border border-white/10"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          onClick={submit}
          className="px-4 rounded bg-purple-600/70"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
