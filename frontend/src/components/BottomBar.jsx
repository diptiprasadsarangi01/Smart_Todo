import { NavLink } from "react-router-dom";
import { LayoutGrid, CalendarDays, CheckSquare, FileText } from "lucide-react";

const menuItems = [
  { to: "/dashboard", label: "Home", icon: <LayoutGrid size={20} /> },
  { to: "/week", label: "Week", icon: <CalendarDays size={20} /> },
  { to: "/completed", label: "Done", icon: <CheckSquare size={20} /> },
  { to: "/summarizer", label: "AI", icon: <FileText size={20} /> },
];

export default function BottomBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-purple-600 py-2 shadow-lg flex justify-around z-50">
      {menuItems.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-white ${
              isActive ? "opacity-100" : "opacity-70"
            }`
          }
        >
          {i.icon}
          <span className="text-xs mt-1">{i.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
