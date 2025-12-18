// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Briefcase,
  Home,
  Wallet,
  BookOpen,
  HeartPulse,
  Boxes,
} from "lucide-react";
import api from "../api/axios";
import {
  getTodayPendingTasks,
  getTodayTasks,
  addTask,
  updateTask,
  deleteTask,
  getUpcomingTasks,
  rankTasks,
} from "../api/tasks";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Input from "../components/Input";
import TaskCard from "../components/TaskCard";
import UrgentTaskCard from "../components/UrgentTaskCard";
import EditTaskModal from "../components/EditTaskModal";
import TodayAnalytics from "../components/TodayAnalytics";
import * as chrono from "chrono-node";
import DatePicker from "../components/DatePicker";

export default function Dashboard() {
  // --- States ---
  const [tasks, setTasks] = useState([]); // pending tasks (what you list)
  const [todayAllTasks, setTodayAllTasks] = useState([]); // all tasks for analytics (completed + pending)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [category, setCategory] = useState("misc");

  const [aiLoading, setAiLoading] = useState(false);

  const [urgentList, setUrgentList] = useState([]); // final top 5–6
  const [urgentLoading, setUrgentLoading] = useState(false);

  const [editTask, setEditTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // manual edit tracking -> prevents overwriting user's manual changes
  const [manualTitleEdit, setManualTitleEdit] = useState(false);
  const [manualDescEdit, setManualDescEdit] = useState(false);

  // remember last AI suggestion so we can decide whether user changed the field
  const lastAiSuggestionRef = useRef({ title: "", description: "" });

  // debounce ref for AI assist (simple)
  const aiAssistTimer = useRef(null);

  // today's min date for DatePicker
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  // category icons/colors (kept same)
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

  // Attach token + initial fetch
  useEffect(() => {
    fetchTasks();
    fetchUrgentHybrid(); // initial urgent fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FETCH TASKS (both pending and all) ---
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      // fetch both pending (for list) and all (for analytics / progress)
      const pending = await getTodayPendingTasks();
      const all = await getTodayTasks();

      setTasks(Array.isArray(pending) ? pending : []);
      setTodayAllTasks(Array.isArray(all) ? all : []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError(err?.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // --- ADD TASK ---
  const handleAdd = async () => {
    if (!title || !due) return alert("Title & due date required");

    try {
      await addTask({
        title,
        summary: desc,
        priority,
        dueDate: due,
        category,
      });

      // refresh lists after add
      const pending = await getTodayPendingTasks();
      const all = await getTodayTasks();
      setTasks(pending);
      setTodayAllTasks(all);

      // reset form + manual flags
      setTitle("");
      setDesc("");
      setPriority("medium");
      setDue("");
      setCategory("misc");
      setManualTitleEdit(false);
      setManualDescEdit(false);
      lastAiSuggestionRef.current = { title: "", description: "" };

      // refresh urgent as well
      fetchUrgentHybrid();
    } catch (err) {
      console.error("Add task error:", err);
      alert(err?.response?.data?.message || "Failed to add task");
    }
  };

  // --- AI Assist (debounced + safe overwrite) ---
  const callAIAssist = async (combinedText) => {
    setAiLoading(true);
    try {
      // Step 1: Chrono on frontend for date
      const parsedDate = chrono.parseDate(combinedText);
      if (parsedDate) {
        let normalized = parsedDate;
        if (normalized < today) normalized = today;
        const yyyy = normalized.getFullYear();
        const mm = String(normalized.getMonth() + 1).padStart(2, "0");
        const dd = String(normalized.getDate()).padStart(2, "0");
        setDue(`${yyyy}-${mm}-${dd}`);
      }

      // Step 2: backend AI for title/desc/priority/category
      const res = await api.post("/ai/process", { text: combinedText });

      if (res.data?.ai) {
        const ai = res.data.ai;

        // If user hasn't manually edited the title OR the current title matches the last AI suggestion,
        // then it's safe to overwrite. This prevents clobbering user's manual edits.
        const last = lastAiSuggestionRef.current;

        if (!manualTitleEdit || title === last.title) {
          if (ai.title) {
            setTitle(ai.title);
            last.title = ai.title;
            setManualTitleEdit(false);
          }
        }

        if (!manualDescEdit || desc === last.description) {
          if (ai.description) {
            setDesc(ai.description);
            last.description = ai.description;
            setManualDescEdit(false);
          }
        }

        if (ai.priority) setPriority(ai.priority.toLowerCase());
        if (ai.category) setCategory(ai.category.toLowerCase());

        // update last suggestion ref
        lastAiSuggestionRef.current = {
          title: last.title || ai.title || "",
          description: last.description || ai.description || "",
        };
      }
    } catch (err) {
      console.error("AI failed to process task:", err);
      alert("AI failed to process task");
    } finally {
      setAiLoading(false);
    }
  };

  // Debounced wrapper (simple)
  const handleAIAssist = () => {
    if (!title && !desc) return alert("Type something in title or description first!");

    // clear existing debounce timer
    if (aiAssistTimer.current) {
      clearTimeout(aiAssistTimer.current);
    }

    // short debounce to prevent double clicks
    aiAssistTimer.current = setTimeout(() => {
      const combinedText = `${title} ${desc}`.trim();
      // call async function (no await here)
      callAIAssist(combinedText);
    }, 350);
  };

  // --- Delete / Complete / Edit handlers ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((s) => s.filter((t) => t._id !== id));
      // also refresh analytics/all tasks
      const all = await getTodayTasks();
      setTodayAllTasks(all);
      // refresh urgent
      fetchUrgentHybrid();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateTask(id, { status: "completed" });

      // fade / remove visually
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, isFading: true } : t)));
      setTimeout(async () => {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        const all = await getTodayTasks();
        setTodayAllTasks(all);
        fetchUrgentHybrid();
      }, 300);
    } catch (err) {
      console.error("Complete failed:", err);
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
      // refresh all tasks for analytics
      const all = await getTodayTasks();
      setTodayAllTasks(all);
      setIsEditOpen(false);
      setEditTask(null);
      fetchUrgentHybrid();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // --- Hybrid urgent engine ---
  // keywords and local scoring — slightly tuned
  const keywords = [
    "urgent",
    "asap",
    "deadline",
    "client",
    "exam",
    "pay",
    "bill",
    "meeting",
    "important",
    "submit",
  ];

  const computeLocalScore = (task) => {
    let score = 0;

    // priority
    if (task.priority === "high") score += 40;
    else if (task.priority === "medium") score += 25;
    else score += 10;

    // days until due
    if (task.dueDate) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);

      const diffMs = due - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) score += 50; // due today or overdue
      else if (diffDays === 1) score += 35;
      else if (diffDays <= 7) score += 15;
      else score += 0;
    }

    // keyword boosts (cap)
    const text = `${task.title || ""} ${task.description || task.summary || ""}`.toLowerCase();
    let keywordBoost = 0;
    for (const k of keywords) {
      if (text.includes(k)) keywordBoost += 8; // small incremental
      if (keywordBoost >= 20) break;
    }
    score += Math.min(keywordBoost, 20);

    // category boost
    if (task.category === "finance") score += 8;

    return Math.min(score, 200);
  };

  const fetchUrgentHybrid = useCallback(async () => {
    try {
      setUrgentLoading(true);

      // 1) Get upcoming tasks
      const all = await getUpcomingTasks();
      if (!Array.isArray(all) || all.length === 0) {
        setUrgentList([]);
        return;
      }

      // 2) Compute local scores
      const scored = all.map((t) => ({ ...t, localRaw: computeLocalScore(t) }));

      // 3) Pick top candidates by local score
      scored.sort((a, b) => b.localRaw - a.localRaw);
      const candidates = scored.slice(0, 12);

      // 4) Call backend AI rank endpoint (if exists)
      let aiResp = null;
      try {
        aiResp = await rankTasks(
          candidates.map((c) => ({
            id: c._id,
            title: c.title,
            description: c.description || c.summary || "",
            dueDate: c.dueDate,
            priority: c.priority,
            category: c.category,
          }))
        );
      } catch (e) {
        console.warn("AI rank call failed, using fallback", e);
      }

      let rankings = [];
      if (aiResp?.success && Array.isArray(aiResp.rankings)) {
        rankings = aiResp.rankings; // expect [{ id, aiScore, reason }, ...]
      } else {
        rankings = candidates.map((c) => ({ id: c._id, aiScore: 50, reason: "Fallback" }));
      }

      // 5) Normalize localRaw and merge
      const maxLocal = Math.max(...candidates.map((c) => c.localRaw), 1);
      const alpha = 0.6,
        beta = 0.4; // weights: local vs ai

      const merged = candidates.map((c) => {
        const aiObj = rankings.find((r) => r.id === c._id) || {};
        const aiScore = typeof aiObj.aiScore === "number" ? aiObj.aiScore : 50;
        const localNorm = Math.round((c.localRaw / maxLocal) * 100);
        const finalScore = Math.round(alpha * localNorm + beta * aiScore);
        return {
          ...c,
          localNorm,
          aiScore,
          finalScore,
          reason: aiObj.reason || "",
        };
      });

      merged.sort((a, b) => b.finalScore - a.finalScore);

      // 6) top 6
      setUrgentList(merged.slice(0, 6));
    } catch (err) {
      console.error("Hybrid urgent fetch error", err);
      setUrgentList([]);
    } finally {
      setUrgentLoading(false);
    }
  }, []);

  // refresh urgent when relevant things change (callable safely)
  useEffect(() => {
    // run once on mount already, but also when tasks change (to reflect new adds/completes)
    fetchUrgentHybrid();
  }, [fetchUrgentHybrid, tasks]);

  // --- Manual edit handlers for inputs ---
  const onTitleChange = (e) => {
    setTitle(e.target.value);
    setManualTitleEdit(true);
  };

  const onDescChange = (e) => {
    setDesc(e.target.value);
    setManualDescEdit(true);
  };

  // RENDER
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
            onChange={onTitleChange}
            spellCheck={true}
          />

          <Input
            textarea
            label="Description"
            placeholder="Enter task description"
            value={desc}
            onChange={onDescChange}
          />

          {/* AI Assist */}
          <button
            onClick={handleAIAssist}
            disabled={aiLoading}
            className="mt-3 mb-2 px-3 py-2 rounded bg-blue-600/30 text-sm disabled:opacity-60"
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
                  <SelectItem value="high" className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    High
                  </SelectItem>
                  <SelectItem value="medium" className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    Medium
                  </SelectItem>
                  <SelectItem value="low" className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Due Date */}
            <DatePicker due={due} setDue={setDue} minDate={minDate} />

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="p-2 w-full rounded hover:bg-white/10 bg-white/5 border border-white/10 text-sm flex items-center gap-2">
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent className="bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100 rounded-lg shadow-xl">
                <SelectGroup>
                  {Object.keys(categoryIcon).map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
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

          <button onClick={handleAdd} className="mt-4 w-full py-3 rounded bg-white/10">
            + Add Task
          </button>
        </div>

        {/* Today's Tasks */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Today's Tasks</h3>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && tasks.length === 0 && <p className="text-white/50">No tasks for today 🎉</p>}

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
        {/* Today's Analytics now uses ALL today's tasks (completed + pending) */}
        <TodayAnalytics tasks={todayAllTasks} />

        <hr className="my-4 border-white/6" />
        <h4 className="font-semibold mb-3">Urgent Tasks</h4>

        <div className="space-y-2">
          {urgentLoading && <p className="text-gray-400 text-sm">Analyzing tasks...</p>}

          {!urgentLoading && urgentList.length === 0 && <p className="text-gray-500 text-xs">No urgent tasks found.</p>}

          {!urgentLoading &&
            urgentList.map((task) => (
              <UrgentTaskCard key={task._id} task={task} />
            ))}
        </div>

        <hr className="my-4 border-white/6" />
        {/* <h4 className="font-semibold mb-3">AI Assistant</h4>
        <div className="p-4 rounded bg-white/5 mb-4">Hello! I'm your AI assistant. How can I help you today?</div>
        <div className="flex gap-2 mt-auto">
          <input className="flex-1 p-3 rounded border border-white/8 bg-white/5" placeholder="Ask me anything..." />
          <button className="p-3 rounded bg-white/10">➤</button>
        </div> */}
      </aside>

      <EditTaskModal open={isEditOpen} onClose={() => setIsEditOpen(false)} task={editTask} onSave={handleSaveEdit} />
    </div>
  );
}
