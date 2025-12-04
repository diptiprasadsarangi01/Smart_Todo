import React from "react";
import { format } from "date-fns";

export default function UrgentTaskCard({ task }) {
  const due = task?.dueDate ? format(new Date(task.dueDate), "dd MMM") : "No date";

  const priorityColors = {
    high: "text-red-400 bg-red-400/10",
    medium: "text-yellow-400 bg-yellow-400/10",
    low: "text-green-400 bg-green-400/10",
  };

  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer">
      {/* Title */}
      <h2 className="text-white font-semibold text-sm truncate">
        {task.title}
      </h2>

      {/* Priority + Due */}
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
        <span className={`px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        <span className="text-gray-400">•</span>

        <span className="text-gray-300">
          Due: {due}
        </span>
      </div>

      {/* Optional AI reason summary */}
      {task.reason && (
        <p className="text-gray-400 text-[11px] mt-1 truncate">
          AI: {task.reason}
        </p>
      )}
    </div>
  );
}
