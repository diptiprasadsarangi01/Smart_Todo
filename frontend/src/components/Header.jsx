import React, { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Header({ title, collapsed, setCollapsed }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const username = user?.name || "User";
  const email = user?.email || "user@example.com";
  const profileImage =
    user?.profilePic && user.profilePic.trim() !== ""
      ? user.profilePic
      : `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="flex items-center justify-between mb-6 relative">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="text-sm opacity-90">{new Date().toLocaleDateString()}</div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-2">
          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profileImage}
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer border border-white/20 transition-all hover:scale-105"
              onClick={() => setOpen(!open)}
            />

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 shadow-lg rounded-xl p-4 z-50 border border-white/10 transform transition-all duration-300 origin-top ${
                open
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex flex-col items-center">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mb-3 border border-white/20"
                />
                <p className="font-semibold">{username}</p>
                <p className="text-xs opacity-70 mb-3">{email}</p>

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="w-full py-1 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-md text-center transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="p-2   hover:text-white/60 transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
