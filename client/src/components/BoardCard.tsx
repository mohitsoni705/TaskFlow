import { useState, useRef, useEffect } from "react";
import { MoreVertical, ClipboardList, Pencil, Trash2 } from "lucide-react";

export interface BoardCardProps {
  title: string;
  description?: string;
  tasksCount?: number;
  updatedAt?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const EMOJIS = ["💼", "💻", "🎯", "🚀", "📚", "✍️", "💡", "📅"];
const THEMES = [
  { bg: "bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400", badge: "bg-violet-50/70 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  { bg: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400", badge: "bg-blue-50/70 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400", badge: "bg-emerald-50/70 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { bg: "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400", badge: "bg-amber-50/70 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { bg: "bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400", badge: "bg-rose-50/70 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

const BoardCard = ({
  title,
  description = "",
  tasksCount = 0,
  updatedAt = "just now",
  onEdit,
  onDelete,
  onClick,
}: BoardCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [showMenu]);

  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const emoji = EMOJIS[hash % EMOJIS.length];
  const theme = THEMES[hash % THEMES.length];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all flex flex-col min-h-[180px] cursor-pointer relative"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${theme.bg}`}>
          {emoji}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(); }}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(); }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">{title}</h3>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs font-medium">
          <ClipboardList size={14} className="mr-1 text-gray-400 dark:text-gray-500" />
          <span>{tasksCount} Tasks</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
          Updated {updatedAt}
        </span>
      </div>
    </div>
  );
};

export default BoardCard;
