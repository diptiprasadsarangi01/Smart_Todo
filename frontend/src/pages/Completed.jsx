import React, { useEffect, useState } from "react";
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
import { getTaskStats } from "../api/analytics";
import { getTodayTasks, getWeekTasks } from "../api/tasks";

export default function Completed() {
  const [tab, setTab] = useState("completed");

  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  const [weeklyData, setWeeklyData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  const [loading, setLoading] = useState(true);

  // Always Monday → Sunday in chart
  const weekOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Map backend long + short weekday names
  const weekMap = {
    Mon: ["Mon", "Monday"],
    Tue: ["Tue", "Tuesday"],
    Wed: ["Wed", "Wednesday"],
    Thu: ["Thu", "Thursday"],
    Fri: ["Fri", "Friday"],
    Sat: ["Sat", "Saturday"],
    Sun: ["Sun", "Sunday"],
  };

  // 🔥 AUTO Y-AXIS SCALES
  const generateTicks = (maxValue) => {
    if (maxValue <= 8) return [2, 4, 6, 8];
    if (maxValue <= 20) return [5, 10, 15, 20];
    if (maxValue <= 50) return [10, 20, 30, 40, 50];

    const step = Math.ceil(maxValue / 5);
    const ticks = [];
    for (let i = step; i <= maxValue; i += step) ticks.push(i);
    return ticks;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      await getTaskStats();

      // Today tasks
      const today = await getTodayTasks();
      setCompletedTasks(today.filter((t) => t.status === "completed"));
      setPendingTasks(today.filter((t) => t.status === "pending"));

      // Weekly tasks
      const week = await getWeekTasks();

      // FIX: Auto-detect correct weekday key
      const formattedWeekly = weekOrder.map((shortDay) => {
        const possibleKeys = weekMap[shortDay];

        const realKey = possibleKeys.find((k) => week[k]);
        const tasks = realKey ? week[realKey] : [];

        return {
          day: shortDay,
          completed: tasks.filter((t) => t.status === "completed").length,
          pending: tasks.filter((t) => t.status === "pending").length,
        };
      });

      setWeeklyData(formattedWeekly);

      // Priority Pie
      const priorityCounts = { high: 0, medium: 0, low: 0 };
      today.forEach((t) => (priorityCounts[t.priority] += 1));

      setPriorityData([
        { name: "High", value: priorityCounts.high, color: "#ef4444" },
        { name: "Medium", value: priorityCounts.medium, color: "#eab308" },
        { name: "Low", value: priorityCounts.low, color: "#22c55e" },
      ]);
    } catch (err) {
      console.error("Analytics Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeList = tab === "completed" ? completedTasks : pendingTasks;

  // Find auto Y axis scale
  const maxValue = Math.max(
    ...weeklyData.map((d) => Math.max(d.completed, d.pending)),
    1
  );
  const ticks = generateTicks(maxValue);

  return (
    <div className="space-y-6">
      {/* Toggle */}
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
        {loading ? (
          <p className="text-white/70">Loading tasks...</p>
        ) : activeList.length === 0 ? (
          <p className="text-white/70">No tasks found.</p>
        ) : (
          activeList.map((t) => (
            <div
              key={t._id}
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

              <p className="text-sm mt-1 opacity-70">
                Due: {new Date(t.dueDate).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="card-glass p-6 rounded-xl h-[330px]">
          <h3 className="font-semibold mb-4">Weekly Progress</h3>

          {loading ? (
            <p className="text-white/70">Loading chart...</p>
          ) : (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#fff" />

                <YAxis
                  stroke="#fff"
                  ticks={ticks}
                  domain={[0, ticks[ticks.length - 1]]}
                />

                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#fff" }}
                />

                <Bar dataKey="completed" fill="#22c55e" barSize={18} />
                <Bar dataKey="pending" fill="#eab308" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="flex justify-center mt-2 text-sm gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#22c55e]"></span>
              completed
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#eab308]"></span>
              pending
            </div>
          </div>
        </div>

        {/* Priority Pie */}
        <div className="card-glass p-6 rounded-xl h-[330px]">
          <h3 className="font-semibold mb-4">Tasks by Priority</h3>

          {loading ? (
            <p className="text-white/70">Loading priority...</p>
          ) : (
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
                contentStyle={{
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}     

              />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
