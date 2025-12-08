import React from "react";

export default function TodayAnalytics({ tasks = [] }) {
  // Total today
  const total = tasks.length;

  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = total - completed;

  const high = tasks.filter(t => t.priority === "high").length;
  const medium = tasks.filter(t => t.priority === "medium").length;
  const low = tasks.filter(t => t.priority === "low").length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-6 space-y-4">
      <h4 className="font-semibold mb-2 text-sm tracking-wide text-white/90">
        Today's Progress
      </h4>

      {/* Modern Gradient Progress Bar */}
      <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs text-white/90">
        <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
          <p className="opacity-60">Total</p>
          <p className="font-semibold text-base">{total}</p>
        </div>

        <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
          <p className="opacity-60">Completed</p>
          <p className="font-semibold text-green-400 text-base">{completed}</p>
        </div>

        <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
          <p className="opacity-60">Pending</p>
          <p className="font-semibold text-yellow-300 text-base">{pending}</p>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            High
          </span>
          <span>{high}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            Medium
          </span>
          <span>{medium}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Low
          </span>
          <span>{low}</span>
        </div>
      </div>
    </div>
  );
}
