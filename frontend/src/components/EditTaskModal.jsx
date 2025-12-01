// src/components/EditTaskModal.jsx
import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Home,
  Wallet,
  BookOpen,
  HeartPulse,
  Boxes,
} from "lucide-react";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [category, setCategory] = useState("misc");

  // ICON MAP
  const iconMap = {
    work: <Briefcase size={16} />,
    personal: <Home size={16} />,
    finance: <Wallet size={16} />,
    learning: <BookOpen size={16} />,
    health: <HeartPulse size={16} />,
    misc: <Boxes size={16} />,
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || task.desc || "");
      setPriority(task.priority || "medium");
      setDue(task.dueDate ? task.dueDate.slice(0, 10) : task.due || "");
      setCategory(task.category?.toLowerCase() || "misc");
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
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white/5 p-6 rounded-md w-full max-w-md z-10">
        <h3 className="font-semibold mb-3">Edit Task</h3>

        {/* Title */}
        <input
          className="w-full p-2 rounded mb-2 bg-white/5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        {/* Description */}
        <textarea
          className="w-full p-2 rounded mb-2 bg-white/5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        {/* Category Selector */}
        <div className="mb-3">
          <label className="text-sm opacity-80">Category</label>
          <div className="flex items-center gap-2 mt-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 rounded bg-white/5 w-full"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="finance">Finance</option>
              <option value="learning">Learning</option>
              <option value="health">Health</option>
              <option value="misc">Misc</option>
            </select>

            {/* Preview Icon */}
            <span className="p-2 bg-white/10 rounded">
              {iconMap[category]}
            </span>
          </div>
        </div>

        {/* Priority & Date */}
        <div className="flex gap-2 mb-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 rounded bg-white/5"
          >
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>

          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="p-2 rounded bg-white/5"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-2 rounded bg-white/10"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
