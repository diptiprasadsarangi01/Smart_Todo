// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {Briefcase,Home,Wallet,BookOpen,HeartPulse,Boxes} from "lucide-react";
import api from "../api/axios";
import { getTodayTasks, addTask, updateTask, deleteTask } from "../api/tasks";
import {Select,SelectTrigger,SelectContent,SelectGroup,SelectItem,SelectValue,} from "@/components/ui/select";
import Input from "../components/Input";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";
import * as chrono from "chrono-node";
import DatePicker from "../components/DatePicker";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");

  const [category, setCategory] = useState("misc");


  const [aiLoading, setAiLoading] = useState(false);

  const [editTask, setEditTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // today's min date
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.attachAuth(token);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTodayTasks();
      setTasks(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================
        ADD NEW TASK
  ======================================== */
const handleAdd = async () => {
  if (!title || !due) return alert("Title & due date required");

  try {
    console.log({ title, desc, priority, due, category });

    const res = await addTask({
      title,
      summary: desc,
      priority,
      dueDate: due,
      category,
    });

    // 🔥 Instantly refresh Today's tasks after adding
    const updated = await getTodayTasks();
    setTasks(updated);

    // Reset form
    setTitle("");
    setDesc("");
    setPriority("medium");
    setDue("");
    setCategory("misc");

  } catch (err) {
    alert(err?.response?.data?.message || "Failed to add task");
  }
};

  /* ===================================================
        AI Assist
  ==================================================== */
  const handleAIAssist = async () => {
    if (!title && !desc)
      return alert("Type something in title or description first!");

    setAiLoading(true);

    try {
      const combinedText = `${title} ${desc}`.trim();
      setDue("");

      // Chrono AI date
      let parsedDate = chrono.parseDate(combinedText);
      if (parsedDate) {
        if (parsedDate < today) parsedDate = today;

        const yyyy = parsedDate.getFullYear();
        const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(parsedDate.getDate()).padStart(2, "0");
        setDue(`${yyyy}-${mm}-${dd}`);
      }

      // Backend AI
      const res = await api.post("/ai/process", { text: combinedText });

      if (res.data?.ai) {
        const ai = res.data.ai;
        if (ai.title) setTitle(ai.title);
        if (ai.description) setDesc(ai.description);
        if (ai.priority) setPriority(ai.priority.toLowerCase());
        if (ai.category) setCategory(ai.category.toLowerCase());
      }
    } catch (err) {
      alert("AI failed to process task");
    } finally {
      setAiLoading(false);
    }
  };

  /* Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((s) => s.filter((t) => t._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* Complete */
  const handleComplete = async (id) => {
    try {
      await updateTask(id, { status: "completed" });
      setTasks((s) =>
        s.map((t) => (t._id === id ? { ...t, status: "completed" } : t))
      );
    } catch {
      alert("Complete failed");
    }
  };

  const openEdit = (task) => {
    setEditTask(task);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (payload) => {
    try {
      const updated = await updateTask(editTask._id, payload);
      setTasks((s) =>
        s.map((t) => (t._id === updated._id ? updated : t))
      );
      setIsEditOpen(false);
      setEditTask(null);
    } catch {
      alert("Update failed");
    }
  };

  /* ===========================
        CATEGORY ICON MAP
  ============================ */
const categoryColors = {
  work: "#2563EB",      // Blue
  personal: "#10B981",  // Green
  finance: "#F59E0B",   // Yellow/Orange
  learning: "#8B5CF6",  // Purple
  health: "#EF4444",    // Red
  misc: "#6B7280",      // Gray
};
const categoryIcon = {
  work: <Briefcase size={16} color={categoryColors.work} />,
  personal: <Home size={16} color={categoryColors.personal} />,
  finance: <Wallet size={16} color={categoryColors.finance} />,
  learning: <BookOpen size={16} color={categoryColors.learning} />,
  health: <HeartPulse size={16} color={categoryColors.health} />,
  misc: <Boxes size={16} color={categoryColors.misc} />,
};



  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">

        {/* Add Task */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Add New Task</h3>

          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            spellCheck={true}
          />

          <Input
            textarea
            label="Description"
            placeholder="Enter task description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          {/* AI Assist */}
          <button
            onClick={handleAIAssist}
            disabled={aiLoading}
            className="mt-3 mb-2 px-3 py-2 rounded bg-blue-600/30 text-sm"
          >
            {aiLoading ? "⏳ AI Thinking..." : "✨ AI Assist"}
          </button>

          {/* Priority + Due + Category */}
          <div className="grid grid-cols-3 gap-4 mt-3 ">

            {/* Priority DROPDOWN */}
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="p-4 rounded hover:bg-white/10 bg-white/5 border border-white/10 text-sm w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100 rounded-lg shadow-xl">
                <SelectGroup>
                  <SelectItem value="high" className="cursor-pointer hover:bg-white/10 focus:bg-white/10">High</SelectItem>
                  <SelectItem value="medium" className="cursor-pointer hover:bg-white/10 focus:bg-white/10">Medium</SelectItem>
                  <SelectItem value="low" className="cursor-pointer hover:bg-white/10 focus:bg-white/10">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Due Date */}
            <DatePicker due={due} setDue={setDue} minDate={minDate} />

            
            {/* CATEGORY DROPDOWN WITH PROFESSIONAL ICONS */}
            <Select value={category} onValueChange={setCategory}>
  <SelectTrigger className="p-2 w-full rounded hover:bg-white/10 bg-white/5 border border-white/10 text-sm flex items-center gap-2">
    <SelectValue placeholder="Category" />
  </SelectTrigger>

  <SelectContent className="bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100 rounded-lg shadow-xl">
    <SelectGroup>
      {Object.keys(categoryIcon).map((cat) => (
        <SelectItem
          key={cat}
          value={cat.toLowerCase()}  // ⭐ ensure lowercase
          className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
        >
          <div className="flex items-center gap-2">
            {categoryIcon[cat]}
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </div>
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>




          </div>

          <button
            onClick={handleAdd}
            className="mt-4 w-full py-3 rounded bg-white/10"
          >
            + Add Task
          </button>
        </div>

        {/* Today's Tasks */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Today's Tasks</h3>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && tasks.length === 0 && (
            <p className="text-white/50">No tasks for today 🎉</p>
          )}

          {tasks.map((t) => (
            <TaskCard
              key={t._id}
              task={t}
              onDelete={() => handleDelete(t._id)}
              onComplete={() => handleComplete(t._id)}
              onEdit={() => openEdit(t)}
            />
          ))}
        </div>
      </div>

      {/* AI Sidebar */}
      <aside className="hidden lg:block card-glass p-6 rounded-lg">
        <h4 className="font-semibold mb-3">AI Assistant</h4>
        <div className="p-4 rounded bg-white/5 mb-4">
          Hello! I'm your AI assistant. How can I help you today?
        </div>
        <div className="flex gap-2 mt-auto">
          <input
            className="flex-1 p-3 rounded border border-white/8 bg-white/5"
            placeholder="Ask me anything..."
          />
          <button className="p-3 rounded bg-white/10">➤</button>
        </div>
      </aside>

      <EditTaskModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={editTask}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
