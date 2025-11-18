// FILE: src/pages/Completed.jsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Completed() {
  const [tab, setTab] = useState("completed");

  // Dummy Tasks (replace later with real backend data)
  const completedTasks = [
    { id: 1, title: "Complete project proposal", priority: "high", due: "2025-11-11" },
    { id: 2, title: "Review code changes", priority: "medium", due: "2025-11-12" },
    { id: 3, title: "Team meeting", priority: "low", due: "2025-11-11" },
  ];

  // Weekly Bar Chart Data
  const weeklyData = [
    { day: "Mon", completed: 4, pending: 2 },
    { day: "Tue", completed: 3, pending: 3 },
    { day: "Wed", completed: 5, pending: 1 },
    { day: "Thu", completed: 4, pending: 3 },
    { day: "Fri", completed: 6, pending: 2 },
    { day: "Sat", completed: 1, pending: 0 },
    { day: "Sun", completed: 0, pending: 1 },
  ];

  // Pie Chart Data
  const priorityData = [
    { name: "High", value: 31, color: "#ef4444" },
    { name: "Medium", value: 46, color: "#eab308" },
    { name: "Low", value: 23, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">

      {/* Top Toggle */}
      <div className="card-glass p-6 rounded-xl">
        <h2 className="font-semibold mb-4">Task Overview</h2>

        <div className="bg-white/20 h-10 rounded-full p-1 flex">
          <button
            onClick={() => setTab("completed")}
            className={`flex-1 rounded-full text-center transition ${
              tab === "completed" ? "bg-white text-black" : "text-white/60"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setTab("pending")}
            className={`flex-1 rounded-full text-center transition ${
              tab === "pending" ? "bg-white text-black" : "text-white/60"
            }`}
          >
            Pending
          </button>
        </div>
      </div>


      {/* Task List */}
      <div className="space-y-4">
        {completedTasks.map((t) => (
          <div
            key={t.id}
            className="card-glass p-5 rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t.title}</h3>

              <span
                className={`px-3 py-1 rounded-full text-xs capitalize ${
                  t.priority === "high"
                    ? "bg-red-500/20 text-red-300"
                    : t.priority === "medium"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-green-500/20 text-green-300"
                }`}
              >
                {t.priority}
              </span>
            </div>

            <p className="text-sm mt-1 opacity-70">Due: {t.due}</p>
          </div>
        ))}
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Progress */}
        <div className="card-glass p-6 rounded-xl h-[330px]">
          <h3 className="font-semibold mb-4">Weekly Progress</h3>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ background: "rgba(0,0,0,0.6)", borderRadius: 8 }}
                labelStyle={{ color: "#fff" }}
              />

              <Bar dataKey="completed" stackId="a" />
              <Bar dataKey="pending" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* Priority Pie */}
        <div className="card-glass p-6 rounded-xl h-[330px]">
          <h3 className="font-semibold mb-4">Tasks by Priority</h3>

          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{ background: "rgba(0,0,0,0.6)", borderRadius: 8 }}
                labelStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

