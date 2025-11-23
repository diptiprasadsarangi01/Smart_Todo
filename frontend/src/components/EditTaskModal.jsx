// src/components/EditTaskModal.jsx
import React, { useState, useEffect } from "react";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || task.desc || "");
      setPriority(task.priority || "medium");
      setDue(task.dueDate ? task.dueDate.slice(0, 10) : task.due || "");
    }
  }, [task]);

  if (!open) return null;

  const handleSave = () => {
    if (!title || !due) return alert("Title and due date are required");
    onSave({
      title,
      description, 
      priority,
      dueDate: due,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white/5 p-6 rounded-md w-full max-w-md z-10">
        <h3 className="font-semibold mb-3">Edit Task</h3>

        <input
          className="w-full p-2 rounded mb-2 bg-white/5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="w-full p-2 rounded mb-2 bg-white/5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <div className="flex gap-2 mb-3">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-2 rounded bg-white/5">
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>

          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="p-2 rounded bg-white/5" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded">Cancel</button>
          <button onClick={handleSave} className="px-3 py-2 rounded bg-white/10">Save</button>
        </div>
      </div>
    </div>
  );
}
