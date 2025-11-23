// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { getTodayTasks, addTask, updateTask, deleteTask } from "../api/tasks";
import Input from "../components/Input";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // attach token
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
      console.error(err);
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
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((s) => s.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateTask(id, { status: "completed" });
      setTasks((s) => s.map((t) => (t._id === id ? { ...t, status: "completed" } : t)));
    } catch (err) {
      console.error(err);
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
      setTasks((s) => s.map((t) => (t._id === updated._id ? updated : t)));
      setIsEditOpen(false);
      setEditTask(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Add Task */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Add New Task</h3>

          <Input label="Task Title" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <Input textarea label="Description" placeholder="Enter task description" value={desc} onChange={(e) => setDesc(e.target.value)} />

          <div className="grid grid-cols-2 gap-4 mt-3">
            <select className="p-3 rounded border border-white/8 bg-white/5" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>

            <input className="p-3 rounded border border-white/8 bg-white/5" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>

          <button onClick={handleAdd} className="mt-4 w-full py-3 rounded bg-white/10">+ Add Task</button>
        </div>

        {/* Today's Tasks */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Today's Tasks</h3>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && tasks.length === 0 && <p className="text-white/50">No tasks for today 🎉</p>}

          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} onDelete={() => handleDelete(t._id)} onComplete={() => handleComplete(t._id)} onEdit={() => openEdit(t)} />
          ))}
        </div>
      </div>

      <aside className="hidden lg:block card-glass p-6 rounded-lg">
        <h4 className="font-semibold mb-3">AI Assistant</h4>
        <div className="p-4 rounded bg-white/5 mb-4">Hello! I'm your AI assistant. How can I help you manage your tasks today?</div>
        <div className="flex gap-2 mt-auto">
          <input className="flex-1 p-3 rounded border border-white/8 bg-white/5" placeholder="Ask me anything..." />
          <button className="p-3 rounded bg-white/10">➤</button>
        </div>
      </aside>

      {/* Edit modal */}
      <EditTaskModal open={isEditOpen} onClose={() => setIsEditOpen(false)} task={editTask} onSave={handleSaveEdit} />
    </div>
  );
}
