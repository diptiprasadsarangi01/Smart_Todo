// FILE: src/pages/WeekView.jsx
import { useEffect, useState } from "react";
import { getWeekTasks, updateTask, deleteTask } from "../api/tasks";
import { downloadWeek } from "../utils/downloadWeek";
import api from "../api/axios";

export default function WeekView() {
  const [weekData, setWeekData] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // ------------------------
  // Calculate current week's Mon–Sun dates
  // ------------------------
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

  // ------------------------
  // Fetch Week Tasks
  // ------------------------
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
        if (err.response) {
          console.error("Server responded with:", err.response.status, err.response.data);
          setError(err.response.data?.message || "Server error");
        } else if (err.request) {
          console.error("No response received:", err.request);
          setError("No response from server");
        } else {
          console.error("Axios error:", err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeek();
  }, []);

  

  // ------------------------
  // Toggle task status (completed/pending)
  // ------------------------
  const handleStatusToggle = async (task) => {
    try {
      const updated = await updateTask(task._id, {
        status: task.status === "completed" ? "pending" : "completed",
      });
      const day = daysOrder[(new Date(task.dueDate).getDay() + 6) % 7];
      setWeekData((prev) => ({
        ...prev,
        [day]: prev[day].map((t) => (t._id === task._id ? updated : t)),
      }));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // ------------------------
  // Delete task
  // ------------------------
  const handleDelete = async (task) => {
    try {
      await deleteTask(task._id);
      const day = daysOrder[(new Date(task.dueDate).getDay() + 6) % 7];
      setWeekData((prev) => ({
        ...prev,
        [day]: prev[day].filter((t) => t._id !== task._id),
      }));
    } catch (err) {
      console.error("Failed to delete task:", err);
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
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          ⬇ Download Week
        </button>
      </div>

      <button
        onClick={()=>downloadWeek(weekData)}
        className="md:hidden w-full py-3 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center gap-2"
      >
        ⬇ Download
      </button>

      {/* Week Cards */}
      <div className="grid grid-cols-1 gap-4">
        {daysOrder.map((day, idx) => (
          <div key={day} className="card-glass p-5 rounded-xl border border-white/10">
            <h3 className="font-semibold">{day}</h3>
            <p className="text-sm opacity-70 mb-4">{dates[idx]?.label}</p>

            {weekData[day] && weekData[day].length > 0 ? (
              weekData[day].map((task) => (
                <div
                  key={task._id}
                  className={`p-4 rounded-lg sm:flex items-center justify-between bg-white/10 border border-white/10 mb-3 ${
                    task.status === "completed" ? "opacity-50 line-through" : ""
                  }`}
                >
                  <p className="font-medium">{task.title}</p>

                  <div className="flex items-center gap-2">
                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs capitalize ${
                        task.priority === "high"
                          ? "bg-red-500/20 text-red-300"
                          : task.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {task.priority}
                    </span>

                    <button
                      onClick={() => handleStatusToggle(task)}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded"
                    >
                      {task.status === "completed" ? "Mark Pending" : "Mark Done"}
                    </button>

                    <button
                      onClick={() => handleDelete(task)}
                      className="px-2 py-1 bg-red-500/20 text-red-300 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No tasks</p>
            )}
          </div>
        ))}
      </div>

      <div className="h-16 md:hidden"></div>
    </div>
  );
}
