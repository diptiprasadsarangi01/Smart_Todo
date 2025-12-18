// src/components/AnalystMessage.jsx
export default function AnalystMessage({ role, payload }) {
  const isUser = role === "user";

  /* ---------------- SAFETY ---------------- */
  if (!payload) {
    return (
      <div className="mr-auto max-w-[80%] px-4 py-3 rounded-xl 
        bg-white/5 text-sm text-white/60">
        I couldn't analyze your tasks right now.
      </div>
    );
  }

  /* ---------------- USER ---------------- */
  if (isUser) {
    return (
      <div className="ml-auto max-w-[70%] px-4 py-3 rounded-2xl 
        bg-linear-to-r from-purple-600 to-indigo-600 
        text-sm text-white shadow-lg">
        {payload.text}
      </div>
    );
  }

  /* ---------------- TEXT ---------------- */
  if (payload.type === "text") {
    return (
      <div className="mr-auto max-w-[80%] px-4 py-3 rounded-xl 
        bg-white/5 text-sm text-white/70">
        {payload.text}
      </div>
    );
  }

  /* ---------------- TASKS ---------------- */
  if (payload.type === "tasks") {
    const {
      heading = "Task Summary",
      date = null,
      tasks = [],
    } = payload;

    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

    return (
      <div className="mr-auto max-w-[85%] space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-medium">{heading}</span>
          {formattedDate && (
            <span className="text-xs text-white/40">
              • {formattedDate}
            </span>
          )}
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {safeTasks.length === 0 && (
            <p className="text-sm text-white/40">No tasks found.</p>
          )}

          {safeTasks.map((task, i) => {
            const priority = task.priority || "low";

            return (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl 
                  bg-white/5 border border-white/10 backdrop-blur"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.due && (
                    <p className="text-xs text-white/40">
                      Due{" "}
                      {new Date(task.due).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    priority === "high"
                      ? "bg-red-500/20 text-red-400"
                      : priority === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {priority.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- FINAL FALLBACK ---------------- */
  return (
    <div className="mr-auto max-w-[80%] px-4 py-3 rounded-xl 
      bg-white/5 text-sm text-white/60">
      I couldn't analyze your tasks right now.
    </div>
  );
}
