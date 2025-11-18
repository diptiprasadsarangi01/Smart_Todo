import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, CalendarDays, CheckSquare, FileText } from "lucide-react";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutGrid size={20} /> },
  { to: "/week", label: "Week View", icon: <CalendarDays size={20} /> },
  { to: "/completed", label: "Completed", icon: <CheckSquare size={20} /> },
  { to: "/summarizer", label: "Summarizer", icon: <FileText size={20} /> },
];

export default function Sidebar({ collapsed }) {
  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 ${
        collapsed ? "w-20 px-2" : "w-64 p-6"
      }`}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
          ✦
        </div>

        {!collapsed && (
          <h3 className="font-semibold text-white whitespace-nowrap">
            AI Task Manager
          </h3>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 p-3 rounded-md transition-all ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            {/* icon */}
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              {i.icon}
            </div>

            {/* label (hidden when collapsed) */}
            {!collapsed && <span className="whitespace-nowrap ">{i.label}</span>}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <span className="absolute left-20 bg-black text-white text-xs p-1 z-5 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                {i.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-6 text-xs opacity-80">v0.1</div>
      )}
    </div>
  );
}
