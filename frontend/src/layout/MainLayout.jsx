import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomBar from "../components/BottomBar";
import Header from "../components/Header";

export default function MainLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const title =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.replace("/", "").toUpperCase();

  return (
    <div className="flex h-screen relative">
      <aside
        className={`hidden md:block shadow-2xl h-full transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      <main className="flex-1 p-6 pb-20 overflow-auto">
        <Header
          title={title}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <Outlet />
      </main>

      <BottomBar />
    </div>
  );
}

