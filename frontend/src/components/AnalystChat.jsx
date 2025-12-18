// src/components/AnalystChat.jsx
import React, { useState, useRef, useEffect } from "react";
import AnalystMessage from "./AnalystMessage";
import { Bot } from "lucide-react";

export default function AnalystChat({ messages, onSend, loading }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 lg:p-6 chat-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/40">
            <div className="text-3xl mb-2">
              <Bot size={36} className="mb-2 text-purple-400 animate-pulse" />
            </div>
            <p className="text-sm">Ask me about your tasks priority and due dates</p>
            <p className="text-xs">Try “What should I focus on today?”</p>
          </div>
        )}

        {messages.map((m, i) => (
          <AnalystMessage key={i} role={m.role} payload={m.payload} />
        ))}

        {loading && (
          <p className="text-xs text-white/50 animate-pulse">
            Analyzing your tasks…
          </p>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4 mb-2 mx-2 lg:mx-4 text-sm lg:text-lg">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your tasks..."
          className="flex-1 p-2 lg:p-3 rounded-lg outline-none bg-white/5 border border-white/10"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          onClick={submit}
          className="px-4 rounded-lg bg-purple-600/70"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
