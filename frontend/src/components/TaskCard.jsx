import React from "react";
import { Briefcase, Home, Wallet, BookOpen, HeartPulse, Boxes } from "lucide-react";

// Category → Icon map
const categoryColors = {
  work: "#2563EB",      // Blue
  personal: "#10B981",  // Green
  finance: "#F59E0B",   // Yellow/Orange
  learning: "#8B5CF6",  // Purple
  health: "#EF4444",    // Red
  misc: "#6B7280",      // Gray
};
const categoryIcons = {
  work: <Briefcase size={16} color={categoryColors.work} />,
  personal: <Home size={16} color={categoryColors.personal} />,
  finance: <Wallet size={16} color={categoryColors.finance} />,
  learning: <BookOpen size={16} color={categoryColors.learning} />,
  health: <HeartPulse size={16} color={categoryColors.health} />,
  misc: <Boxes size={16} color={categoryColors.misc} />,
};

export default function TaskCard({ task, onDelete, onComplete, onEdit }) {
  
  // Ensure category is lowercase and fallback to misc
  const cat = task.category?.toLowerCase() || "misc";

  return (
    <div className={`card-glass border rounded-md p-4 mb-4 transition-all duration-300 ${task.isFading ? "opacity-0 translate-x-5" : "opacity-100"}`}>
      <div className="flex justify-between items-start">
        <div>
          {/* Category Icon + Title */}
          <div className="flex items-center gap-2">
            <span className="text-white opacity-90">
              {categoryIcons[cat]}
            </span>
            <h4 className="font-semibold">{task.title}</h4>
          </div>

          {/* Description */}
          <p className="text-sm opacity-80 mt-1">
            {task.description || task.desc || "No description"}
          </p>

          {/* Priority + Due Date */}
          <div className="flex items-center gap-3 mt-3 text-xs opacity-90">
            <span
              className={`px-2 py-1 rounded text-[11px] ${
                task.priority === "high"
                  ? "bg-red-600/60"
                  : task.priority === "low"
                  ? "bg-green-600/50"
                  : "bg-yellow-500/40"
              }`}
            >
              {task.priority || "medium"}
            </span>

            <span>
              {task.dueDate
                ? task.dueDate.slice(0, 10)
                : task.due || "No date"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 opacity-80">
          <button
            title="Complete"
            onClick={onComplete}
            className="p-2 rounded hover:bg-white/5"
          >
            ✓
          </button>

          <button
            title="Edit"
            onClick={onEdit}
            className="p-2 rounded hover:bg-white/5"
          >
            ✎
          </button>

          <button
            title="Delete"
            onClick={onDelete}
            className="p-2 rounded hover:bg-white/5"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
