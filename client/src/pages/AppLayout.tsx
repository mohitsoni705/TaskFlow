import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, CalendarCheckIcon, LayoutDashboard, KanbanSquare } from "lucide-react";
import Sidebar from "../components/Sidebar";

const navigationItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Boards", path: "/boards", icon: KanbanSquare },
];

export const AppLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Top Navbar */}
      <header className="flex flex-col md:hidden bg-white border-b border-gray-200 px-5 pt-4 pb-2 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <span className="text-purple-600">
              <CalendarCheckIcon size={20} />
            </span>
            <span>TaskFlow</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex gap-2">
          {navigationItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition
                ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`
              }
            >
              <Icon size={16} />
              <span>{name}</span>
            </NavLink>
          ))}
        </div>
      </header>

      {/* Sidebar (Desktop only) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};