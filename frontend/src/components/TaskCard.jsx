import React, { useRef, useState } from "react";
import {
  Briefcase,
  Home,
  Wallet,
  BookOpen,
  HeartPulse,
  Boxes,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";

/* ----------------------------------
   Category → Icon & Color
---------------------------------- */
const categoryColors = {
  work: "#2563EB",
  personal: "#10B981",
  finance: "#F59E0B",
  learning: "#8B5CF6",
  health: "#EF4444",
  misc: "#6B7280",
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
  const cat = task.category?.toLowerCase() || "misc";

  /* ----------------------------------
     Mobile swipe handling
  ---------------------------------- */
  const startX = useRef(0);
  const [showDelete, setShowDelete] = useState(false);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - startX.current;

    // 👉 Swipe right → COMPLETE (instant)
    if (diff > 80) {
      setShowDelete(false);
      onComplete();
      return;
    }

    // 👈 Swipe left → REVEAL delete (NOT delete)
    if (diff < -80) {
      setShowDelete(true);
      return;
    }

    setShowDelete(false);
  };

  return (
    <div className="relative mb-4">
      {/* ---------------- DELETE REVEAL (MOBILE ONLY) ---------------- */}
      {showDelete && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 lg:hidden">
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-3 py-2 rounded-lg
              bg-red-600/80 text-white text-xs font-medium
              active:scale-95 transition"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      {/* ---------------- MAIN CARD ---------------- */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`
          group card-glass border rounded-xl p-4
          transition-all duration-300 ease-out
          ${task.isFading ? "opacity-0 translate-x-4" : "opacity-100"}

          /* Desktop hover glow */
          lg:hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]
          lg:hover:border-purple-500/40
          lg:hover:-translate-y-1
        `}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">

          {/* ---------------- LEFT CONTENT ---------------- */}
          <div className="flex-1">
            {/* Title + Category */}
            <div className="flex items-center gap-2">
              {categoryIcons[cat]}
              <h4 className="font-semibold text-white">
                {task.title}
              </h4>
            </div>

            {/* Description */}
            <p className="text-sm text-white/70 mt-1">
              {task.description || task.desc || "No description"}
            </p>

            {/* Priority + Due */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span
                className={`px-2 py-1 rounded-full font-medium ${
                  task.priority === "high"
                    ? "bg-red-600/70 text-white"
                    : task.priority === "low"
                    ? "bg-green-600/60 text-white"
                    : "bg-yellow-500/60 text-black"
                }`}
              >
                {task.priority || "medium"}
              </span>

              <span className="text-white/70">
                {task.dueDate?.slice(0, 10) || task.due || "No date"}
              </span>
            </div>

            {/* Mobile hint */}
            <p className="mt-2 text-[10px] text-white/30 lg:hidden">
              Swipe → complete • ← delete
            </p>
          </div>

          {/* ---------------- DESKTOP ACTIONS ---------------- */}
          <div
            className={`
              flex items-center gap-3
              opacity-100
              lg:opacity-0 lg:group-hover:opacity-100
              transition
            `}
          >
            <button
              title="Complete"
              onClick={onComplete}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition"
            >
              <Check size={16} />
            </button>

            <button
              title="Edit"
              onClick={onEdit}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition"
            >
              <Pencil size={16} />
            </button>

            <button
              title="Delete"
              onClick={onDelete}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition hidden lg:block"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
