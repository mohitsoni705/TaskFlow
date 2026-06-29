import { CalendarCheckIcon, KanbanSquare, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Boards",
    path: "/boards",
    icon: KanbanSquare,
  },
];
const Sidebar = () => {
    const navigate = useNavigate();
    const handleLogoutButton=()=>{
           localStorage.removeItem("token");
           navigate("/signin");
      }
  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col justify-between border-r border-gray-300 dark:border-gray-800 rounded-tr-2xl rounded-br-2xl bg-white dark:bg-gray-900 p-5 md:flex">
      <div>
        <h1 className="mb-8 text-2xl flex flex-row items-center gap-2 font-semibold dark:text-gray-100">
            <span className="text-purple-600 dark:text-purple-400">
            <CalendarCheckIcon/>
            </span>
          TaskFlow
        </h1>
        <nav className="space-y-2">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                }`
              }
            >
              <Icon size={20} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2">
          <ThemeToggle />
          <span className="text-xs text-gray-500 dark:text-gray-400">Toggle theme</span>
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/50" onClick={handleLogoutButton}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
