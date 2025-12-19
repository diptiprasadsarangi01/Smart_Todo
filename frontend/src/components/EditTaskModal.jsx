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

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [category, setCategory] = useState("misc");

  const categoryColors = {
    work: "#2563EB",
    personal: "#10B981",
    finance: "#F59E0B",
    learning: "#8B5CF6",
    health: "#EF4444",
    misc: "#6B7280",
  };

  const categoryIcon = {
    work: <Briefcase size={16} color={categoryColors.work} />,
    personal: <Home size={16} color={categoryColors.personal} />,
    finance: <Wallet size={16} color={categoryColors.finance} />,
    learning: <BookOpen size={16} color={categoryColors.learning} />,
    health: <HeartPulse size={16} color={categoryColors.health} />,
    misc: <Boxes size={16} color={categoryColors.misc} />,
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || task.desc || "");
      setPriority(task.priority || "medium");
      setDue(task.dueDate ? task.dueDate.slice(0, 10) : "");
      setCategory(task.category?.toLowerCase() || "misc");
    }
  }, [task]);

  if (!open) return null;

  const handleSave = () => {
    if (!title || !due) {
      toast("Title and due date are required", {
        icon: "⚠️",
        style: {
          background: "#f59e0b",
          color: "#000",
        },
      });
      return;
    }
  
    if (due < minDate) {
      toast("Please select today or a future date", {
        icon: "⚠️",
        style: {
          background: "#f59e0b",
          color: "#000",
        },
      });
      return;
    }
  
    onSave({
      title,
      description,
      priority,
      dueDate: due,
      category,
    });
  };

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const minDate = `${yyyy}-${mm}-${dd}`;
  return (
    <div className="fixed h-100 py-5 inset-0 z-50 flex items-center justify-center p-4 overflow-auto ">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md card-glass p-6 rounded-xl z-10">
        <h3 className="font-semibold mb-4 text-sm lg:text-md">Edit Task</h3>

        {/* Title */}
        <input
          className="w-full p-2 lg:p-3 rounded bg-white/5 border text-sm lg:text-md border-white/10 focus:outline-none mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        {/* Description */}
        <textarea
          className="w-full p-2 lg:p-3 text-sm lg:text-md rounded bg-white/5 border border-white/10 focus:outline-none mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        {/* Category */}
        <div className="mb-4">
          <label className="text-sm p-2 lg:p-3 lg:text-md opacity-70 mb-1 block">Category</label>

          <div className="flex p-2 lg:p-3 text-sm lg:text-md items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full p-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent className="bg-black/90 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-xl">
                <SelectGroup>
                  {Object.keys(categoryIcon).map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="cursor-pointer  focus:bg-white/10 focus:text-white/90"
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

            {/* Preview icon */}
            <span className="p-2 rounded bg-white/10">
              {categoryIcon[category]}
            </span>
          </div>
        </div>

        {/* Priority + Due */}
        <div className="flex gap-3 mb-5">
          {/* Priority */}
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-full p-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent className="bg-black/90 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-xl">
              <SelectGroup>
                <SelectItem value="high" className=" focus:bg-white/10 focus:text-white/90">
                  High
                </SelectItem>
                <SelectItem value="medium" className=" focus:bg-white/10 focus:text-white/90">
                  Medium
                </SelectItem>
                <SelectItem value="low" className=" focus:bg-white/10 focus:text-white/90">
                  Low
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Due Date */}
          <input
            type="date"
            value={due}
            min={minDate}
            onChange={(e) => setDue(e.target.value)}
            className="w-full p-2 text-sm rounded bg-white/5 border border-white/10 outline-none"
           />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm lg:p-3 lg:text-md px-4 py-2 rounded hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="text-sm lg:p-3 lg:text-md px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
