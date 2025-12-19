import React, { useEffect, useState } from "react";
import { getTaskStats } from "../api/analytics";
import { getTodayTasks, getWeekTasks } from "../api/tasks";
import { CheckCircle, Clock } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Completed() {
  const [tab, setTab] = useState("completed"); // completed | pending
  const [scope, setScope] = useState("today"); // today | week

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab, scope]);

  const loadData = async () => {
    try {
      setLoading(true);

      await getTaskStats(); // keep backend cache warm

      let allTasks = [];

      if (scope === "today") {
        allTasks = await getTodayTasks();
      } else {
        const week = await getWeekTasks();
        allTasks = Object.values(week).flat();
      }

      setTasks(
        allTasks.filter((t) => t.status === tab)
      );
    } catch (err) {
      console.error("Completed Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="card-glass p-6 rounded-xl space-y-4">
        <h2 className="font-semibold text-lg">Task Overview</h2>

        {/* Tabs */}
        <div className="bg-white/20 h-10 rounded-full p-1 flex">
          <button
            onClick={() => setTab("completed")}
            className={`flex-1 rounded-full transition ${
              tab === "completed"
                ? "bg-white text-black"
                : "text-white/60"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setTab("pending")}
            className={`flex-1 rounded-full transition ${
              tab === "pending"
                ? "bg-white text-black"
                : "text-white/60"
            }`}
          >
            Pending
          </button>
        </div>

        {/* Scope Selector */}
        <div className="flex justify-end">
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger
              className="
                w-[140px]
                px-4 py-2
                rounded-lg
                bg-white/5
                border border-white/10
                text-sm text-white
                hover:bg-white/10
                backdrop-blur-xl
                transition
              "
            >
              <SelectValue placeholder="Scope" />
            </SelectTrigger>

            <SelectContent
              className="
                bg-black/90
                backdrop-blur-xl
                border border-white/10
                text-white
                rounded-xl
                shadow-2xl
              "
            >
              <SelectGroup>
                <SelectItem
                  value="today"
                  className="cursor-pointer hover:bg-white/10 hover:text-white/80 focus:bg-white/10 focus:text-white/80"
                >
                  Today
                </SelectItem>

                <SelectItem
                  value="week"
                  className="cursor-pointer hover:bg-white/10 hover:text-white/80 focus:bg-white/10 focus:text-white/80"
                >
                  This Week
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* ================= TASK LIST ================= */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-white/70">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-white/60 text-sm">
            No {tab} tasks for this {scope}.
          </p>
        ) : (
          tasks.map((t) => (
            <div
              key={t._id}
              className="
                card-glass p-5 rounded-xl border border-white/10
                transition hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tab === "completed" ? (
                    <CheckCircle className="text-green-400" size={18} />
                  ) : (
                    <Clock className="text-yellow-400" size={18} />
                  )}

                  <h3 className="font-medium">{t.title}</h3>
                </div>

                {/* Priority */}
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
    </div>
  );
}
