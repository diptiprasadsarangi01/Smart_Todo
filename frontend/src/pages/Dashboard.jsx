// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { getTodayTasks, addTask, updateTask, deleteTask } from "../api/tasks";
import Input from "../components/Input";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";
import * as chrono from "chrono-node";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");

  const [aiLoading, setAiLoading] = useState(false);

  const [editTask, setEditTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Get today's date for min restriction
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

  const handleAdd = async () => {
    if (!title || !due) return alert("Title & due date required");
    try {
      await addTask({ title, summary: desc, priority, dueDate: due });
      setTitle("");
      setDesc("");
      setPriority("medium");
      setDue("");
      fetchTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add task");
    }
  };

  // ===================================================
  // ⭐ AI Assist: Title, Desc, Priority + Smart Due Date
  // ===================================================
  const handleAIAssist = async () => {
    if (!title && !desc)
      return alert("Type something in title or description first!");

    setAiLoading(true);

    try {
      const combinedText = `${title} ${desc}`.trim();

      // Reset due first
      setDue("");

      // ------------------------------
      // ⭐ Step 1: Smart Due Date (Chrono)
      // ------------------------------
      let parsedDate = chrono.parseDate(combinedText);

      if (parsedDate) {
        // Restrict to today or future only
        if (parsedDate < today) parsedDate = today;

        const yyyy = parsedDate.getFullYear();
        const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(parsedDate.getDate()).padStart(2, "0");
        setDue(`${yyyy}-${mm}-${dd}`);
      }

      // ------------------------------
      // ⭐ Step 2: Backend AI for title, desc, priority only
      // ------------------------------
      const res = await api.post("/ai/process", { text: combinedText });

      if (res.data?.ai) {
        const ai = res.data.ai;

        if (ai.title) setTitle(ai.title);
        if (ai.description) setDesc(ai.description);
        if (ai.priority) setPriority(ai.priority.toLowerCase());
      }

    } catch (err) {
      console.error(err);
      alert("AI failed to process task");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((s) => s.filter((t) => t._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateTask(id, { status: "completed" });
      setTasks((s) =>
        s.map((t) => (t._id === id ? { ...t, status: "completed" } : t))
      );
    } catch (err) {
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
    } catch (err) {
      alert("Update failed");
    }
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

          {/* AI Assist Button */}
          <button
            onClick={handleAIAssist}
            disabled={aiLoading}
            className="mt-3 mb-2 px-3 py-2 rounded bg-blue-600/30 text-sm"
          >
            {aiLoading ? "⏳ AI Thinking..." : "✨ AI Assist"}
          </button>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <select
              className="p-3 rounded border border-white/8 bg-white/5"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>

            <input
              className="p-3 rounded border border-white/8 bg-white/5"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              min={minDate} // ⬅ restrict to today or future
            />
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

      <aside className="hidden lg:block card-glass p-6 rounded-lg">
        <h4 className="font-semibold mb-3">AI Assistant</h4>
        <div className="p-4 rounded bg-white/5 mb-4">
          Hello! I'm your AI assistant. How can I help you manage your tasks today?
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
