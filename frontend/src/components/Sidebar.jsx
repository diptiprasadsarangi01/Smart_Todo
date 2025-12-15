import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  CalendarDays,
  CheckSquare,
  FileText,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutGrid size={18} /> },
  { to: "/week", label: "Week View", icon: <CalendarDays size={18} /> },
  { to: "/completed", label: "Completed", icon: <CheckSquare size={18} /> },
  { to: "/summarizer", label: "Summarizer", icon: <FileText size={18} /> },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div
      className={`relative z-40 h-full flex flex-col transition-all duration-300
        bg-white/5 backdrop-blur-xl border-r border-white/10 
        ${collapsed ? "w-20 px-2" : "w-62 px-6"}
      `}
    >
      {/* 🔁 MODERN ARROW TOGGLER */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-4 top-15 z-50
          w-8 h-8 rounded-full
          bg-neutral-900/80 backdrop-blur
          border border-white/10
          flex items-center justify-center
          shadow-lg hover:bg-neutral-800 transition"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          size={16}
          className={`text-white transition-transform duration-300
            ${collapsed ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      {/* Branding */}
      <div className="flex items-center gap-3 h-20 mb-6 overflow-hidden">
        <div className="ml-3 w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          ✦
        </div>

        {!collapsed && (
          <h3 className="font-semibold text-white tracking-wide">
            AI Task Manager
          </h3>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all
              ${
                isActive
                  ? "bg-white/15 text-white shadow-md"
                  : "text-white/70 hover:bg-white/10"
              }`
            }
          >
            {/* Icon */}
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              {i.icon}
            </div>

            {/* Label */}
            {!collapsed && (
              <span className="text-sm font-medium overflow-hidden">
                {i.label}
              </span>
            )}

            {/* Tooltip */}
            {collapsed && (
              <span
                className="absolute left-16 top-1/2 -translate-y-1/2
                  bg-neutral-900 text-white text-xs px-2 py-1 rounded-md
                  opacity-0 group-hover:opacity-100 transition
                  pointer-events-none whitespace-nowrap z-50"
              >
                {i.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="mt-6 text-xs text-white/60 text-center">
          v0.1
        </div>
      )}
    </div>
  );
}
