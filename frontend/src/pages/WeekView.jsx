// FILE: src/pages/WeekView.jsx
import React from "react";

export default function WeekView() {
  const week = [
    {
      day: "Monday",
      date: "Nov 11",
      tasks: [
        { title: "Complete project proposal", priority: "high" },
        { title: "Team meeting", priority: "medium" },
      ],
    },
    {
      day: "Tuesday",
      date: "Nov 12",
      tasks: [{ title: "Review code changes", priority: "high" }],
    },
    {
      day: "Wednesday",
      date: "Nov 13",
      tasks: [
        { title: "Client presentation", priority: "high" },
        { title: "Update documentation", priority: "low" },
      ],
    },
    {
      day: "Thursday",
      date: "Nov 14",
      tasks: [{ title: "Sprint planning", priority: "medium" }],
    },
    {
      day: "Friday",
      date: "Nov 15",
      tasks: [
        { title: "Deploy to production", priority: "high" },
        { title: "Team retrospective", priority: "medium" },
      ],
    },
    { day: "Saturday", date: "Nov 16", tasks: [] },
    { day: "Sunday", date: "Nov 17", tasks: [] },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Week View</h2>
          <p className="text-sm opacity-70">November 11 – November 17, 2025</p>
        </div>

        {/* Desktop Download Button */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">
          <span>⬇</span> Download Week
        </button>
      </div>

      {/* Mobile Download Button */}
      <button className="md:hidden w-full py-3 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center gap-2">
        <span>⬇</span> Download
      </button>

      {/* Week Cards Container */}
      <div className="
        grid grid-cols-1 
        gap-4 
      ">
        {week.map((d, idx) => (
          <div
            key={idx}
            className="card-glass p-5 rounded-xl border border-white/10"
          >
            {/* Day Heading */}
            <h3 className="font-semibold">{d.day}</h3>
            <p className="text-sm opacity-70 mb-4">{d.date}</p>

            {/* Tasks */}
            {d.tasks.length > 0 ? (
              d.tasks.map((t, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg sm:flex items-center justify-between bg-white/10 border border-white/10 mb-3"
                >
                  <p className="font-medium ">{t.title}</p>

                  <span
                    className={`
                      mt-2 inline-block px-3 py-1 rounded-full text-xs capitalize
                      ${
                        t.priority === "high"
                          ? "bg-red-500/20 text-red-300"
                          : t.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                      }
                    `}
                  >
                    {t.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No tasks</p>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Bottom Navbar Space (optional padding) */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}
