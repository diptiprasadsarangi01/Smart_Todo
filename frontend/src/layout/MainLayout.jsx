import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomBar from "../components/BottomBar";
import { Menu, X } from "lucide-react";

export default function MainLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const title =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.replace("/", "").toUpperCase();

  return (
    <div className="flex h-screen relative">

      {/* ===== DESKTOP / TABLET SIDEBAR ===== */}
      <aside
        className={`hidden md:block shadow-2xl h-full transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6 pb-20 overflow-auto">
        <div className="flex items-center justify-between mb-6">

          {/* Left Area: Collapse Button + Title */}
          <div className="flex items-center gap-3">
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>

            {/* (Removed mobile drawer button) */}

            <h2 className="text-lg font-semibold">{title}</h2>
          </div>

          {/* Right Area */}
          <div className="text-sm opacity-90">
            {new Date().toLocaleDateString()}
          </div>

        </div>

        {/* Page Content */}
        <Outlet />
      </main>

      {/* ===== MOBILE BOTTOM BAR ===== */}
      <BottomBar />
    </div>
  );
}
