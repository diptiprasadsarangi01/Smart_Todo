// FILE: src/pages/WeekView.jsx
// FILE: src/pages/WeekView.jsx
import { useEffect, useState, useMemo } from "react";
import { getWeekTasks, updateTask, deleteTask } from "../api/tasks";
import { CheckCircle, RotateCcw, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import WeeklyAnalytics from "../components/WeeklyAnalytics";
import { downloadWeek } from "../utils/downloadWeek";
import api from "../api/axios";

export default function WeekView() {
  const [weekData, setWeekData] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(null);

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  /* ------------------------
     Calculate current week dates
  ------------------------ */
  const getWeekDates = () => {
    const now = new Date();
    const day = now.getDay();
    const mondayOffset = now.getDate() - day + (day === 0 ? -6 : 1);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(mondayOffset + i);
      return {
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dateISO: d.toISOString(),
      };
    });
  };

  /* ------------------------
     Fetch week tasks
  ------------------------ */
  useEffect(() => {
    setDates(getWeekDates());
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    api.attachAuth(token);

    const fetchWeek = async () => {
      try {
        const data = await getWeekTasks();
        setWeekData(data);
      } catch (err) {
        console.error("Week fetch error:", err);
        setError("Failed to load week tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchWeek();
  }, []);

  /* ------------------------
     Weekly chart data
  ------------------------ */
  const weeklyChartData = useMemo(() => {
    return daysOrder.map((day) => {
      const tasks = weekData[day] || [];
      return {
        day: day.slice(0, 3),
        completed: tasks.filter((t) => t.status === "completed").length,
        pending: tasks.filter((t) => t.status === "pending").length,
      };
    });
  }, [weekData]);

  /* ------------------------
     Priority data (memoized)
  ------------------------ */
  const priorityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };

    Object.values(weekData)
      .flat()
      .forEach((t) => {
        if (t.priority && counts[t.priority] !== undefined) {
          counts[t.priority] += 1;
        }
      });

    return [
      { name: "High", value: counts.high, color: "#ef4444" },
      { name: "Medium", value: counts.medium, color: "#eab308" },
      { name: "Low", value: counts.low, color: "#22c55e" },
    ];
  }, [weekData]);

  /* ------------------------
     Toggle task status
  ------------------------ */
  const handleStatusToggle = async (task) => {
    try {
      const updated = await updateTask(task._id, {
        status: task.status === "completed" ? "pending" : "completed",
      });

      const day = daysOrder[(new Date(task.dueDate).getDay() + 6) % 7];

      setWeekData((prev) => ({
        ...prev,
        [day]: prev[day].map((t) =>
          t._id === task._id ? updated : t
        ),
      }));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  /* ------------------------
     Delete task
  ------------------------ */
  const handleDelete = async (task) => {
    try {
      await deleteTask(task._id);
      toast.success("Task deleted");
      const day = daysOrder[(new Date(task.dueDate).getDay() + 6) % 7];

      setWeekData((prev) => ({
        ...prev,
        [day]: prev[day].filter((t) => t._id !== task._id),
      }));
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading week tasks...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Week View</h2>
          <p className="text-sm opacity-70">
            {dates.length > 0 && `${dates[0].label} — ${dates[6].label}`}
          </p>
        </div>

        <button
          onClick={() => downloadWeek(weekData)}
          className="hidden md:flex px-4 py-2 rounded-lg 
            bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          ⬇ Download Week
        </button>
      </div>

      {/* Mobile download */}
      <button
        onClick={() => downloadWeek(weekData)}
        className="md:hidden w-full py-3 rounded-lg 
          bg-white/10 border border-white/20"
      >
        ⬇ Download
      </button>

      {/* 📊 Weekly Analytics */}
      <WeeklyAnalytics
        weeklyData={weeklyChartData}
        priorityData={priorityData}
        loading={loading}
        showPriority
        onPrioritySelect={(p) =>
          setPriorityFilter((prev) => (prev === p ? null : p))
        }
      />

      {/* Active filter chip */}
      {priorityFilter && (
        <div className="flex items-center gap-2 text-sm text-white/80">
          <span className="px-3 py-1 rounded-full bg-white/10">
            Filtered by: {priorityFilter}
          </span>
          <button onClick={() => setPriorityFilter(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Week Cards */}
      <div className="grid grid-cols-1 gap-4">
        {daysOrder.map((day, idx) => {
          const tasks = priorityFilter
            ? (weekData[day] || []).filter(
                (t) => t.priority === priorityFilter
              )
            : weekData[day];

          return (
            <div
              key={day}
              className="card-glass p-5 rounded-xl border border-white/10"
            >
              <h3 className="font-semibold">{day}</h3>
              <p className="text-sm opacity-70 mb-4">{dates[idx]?.label}</p>

              {tasks?.length ? (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`p-4 rounded-xl bg-white/10 border border-white/10 mb-3
                      ${task.status === "completed" ? "opacity-50 line-through" : ""}
                    `}
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex flex-row gap-3">
                      <p className="font-medium flex-1">{task.title}</p>
                      <div>
                        <span
                           className={`px-3 py-1 rounded-full text-xs capitalize whitespace-nowrap
                             ${
                               task.priority === "high"
                                 ? "bg-red-500/20 text-red-300"
                                 : task.priority === "medium"
                                 ? "bg-yellow-500/20 text-yellow-300"
                                 : "bg-green-500/20 text-green-300"
                             }
                           `}
                         >
                           {task.priority}
                         </span>
                      </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* MARK DONE / PENDING */}
                        <button
                          onClick={() => handleStatusToggle(task)}
                          title={task.status === "completed" ? "Mark Pending" : "Mark Done"}
                          className="
                            group relative
                            p-2 rounded-lg
                            bg-blue-500/15 text-blue-300
                            hover:bg-blue-500/30
                            active:scale-90
                            transition-all duration-200
                            hover:shadow-[0_0_12px_rgba(59,130,246,0.6)]
                          "
                        >
                          {task.status === "completed" ? (
                            <RotateCcw size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}

                          {/* Tooltip */}
                          <span
                            className="
                              pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                              opacity-0 group-hover:opacity-100
                              scale-95 group-hover:scale-100
                              transition
                              text-[11px] px-2 py-1 rounded-md
                              bg-black/80 text-white whitespace-nowrap
                            "
                          >
                            {task.status === "completed" ? "Mark Pending" : "Mark Done"}
                          </span>
                        </button>
                        
                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(task)}
                          title="Delete task"
                          className="
                            group relative
                            p-2 rounded-lg
                            bg-red-500/15 text-red-300
                            hover:bg-red-500/30
                            active:scale-90
                            transition-all duration-200
                            hover:shadow-[0_0_12px_rgba(239,68,68,0.6)]
                          "
                        >
                          <Trash2 size={16} />
                        
                          {/* Tooltip */}
                          <span
                            className="
                              pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                              opacity-0 group-hover:opacity-100
                              scale-95 group-hover:scale-100
                              transition
                              text-[11px] px-2 py-1 rounded-md
                              bg-black/80 text-white whitespace-nowrap
                            "
                          >
                            Delete task
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm opacity-70">No tasks</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-16 md:hidden" />
    </div>
  );
}
