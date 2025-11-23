import React from "react";

export default function TaskCard({ task, onDelete, onComplete, onEdit }) {
  return (
    <div className="card-glass border rounded-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{task.title}</h4>

          <p className="text-sm opacity-80 mt-1">
            {task.description || task.desc}
          </p>

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
              {task.priority}
            </span>

            <span>
              {task.dueDate
                ? task.dueDate.slice(0, 10)
                : task.due || "No date"}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 opacity-80">
          <button
            title="Complete"
            onClick={onComplete}
            className="p-2 rounded hover:bg-white/5"
          >
            ✓
          </button>

          <button title="Edit" onClick={onEdit} className="p-2 rounded hover:bg-white/5">✎</button>

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
