import { LayoutDashboard, KanbanSquare, LogOut, CalendarCheckIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

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
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-gray-300 rounded-2xl bg-white p-5">
      <div>
        <h1 className="mb-8 text-2xl flex flex-row items-center gap-2 font-semibold">
            <span className="text-purple-600">
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
                    ? "bg-purple-100 text-purple-600"
                    : " hover:bg-purple-50 hover:text-purple-600"
                }`
              }
            >
              <Icon size={20} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50" onClick={handleLogoutButton}>
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;