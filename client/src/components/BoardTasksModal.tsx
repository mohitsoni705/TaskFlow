import { useState, useEffect } from "react";
import { Plus, X, Trash2, Pencil, ChevronRight, ChevronLeft } from "lucide-react";
import api from "../services/api";
import AddTodoModel from "./AddTodoModel";

interface BoardTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardTitle: string;
}

export default function BoardTasksModal({
  isOpen,
  onClose,
  boardId,
  boardTitle,
}: BoardTasksModalProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<any | null>(null);
  const [todoStatusFilter, setTodoStatusFilter] = useState<"todo" | "in-progress" | "done">("todo");

  // Drag-and-drop state
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/task/${boardId}`);
      if (res.data?.success) setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && boardId) fetchTasks();
  }, [isOpen, boardId]);

  if (!isOpen) return null;

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/task/${taskId}`);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMoveStatus = async (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    try {
      await api.patch(`/task/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddTodo = (status: "todo" | "in-progress" | "done") => {
    setTodoStatusFilter(status);
    setEditTodo(null);
    setIsTodoOpen(true);
  };

  const handleOpenEditTodo = (task: any) => {
    setEditTodo({
      _id: task._id,
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedEffort: task.estimatedEffort || "",
    });
    setIsTodoOpen(true);
  };

  // Drag handlers
  const onDragStart = (e: React.DragEvent, taskId: string) => {
    setDragTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
  };

  const onDragLeave = () => setDragOverCol(null);

  const onDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverCol(null);
    if (dragTaskId) {
      const task = tasks.find((t) => t._id === dragTaskId);
      if (task && task.status !== colId) {
        handleMoveStatus(dragTaskId, colId as "todo" | "in-progress" | "done");
      }
    }
    setDragTaskId(null);
  };

  const onDragEnd = () => {
    setDragTaskId(null);
    setDragOverCol(null);
  };

  const columns = [
    { id: "todo" as const, title: "To Do", color: "bg-gray-100 text-gray-700" },
    { id: "in-progress" as const, title: "In Progress", color: "bg-amber-100 text-amber-700" },
    { id: "done" as const, title: "Done", color: "bg-emerald-100 text-emerald-700" },
  ];

  const priorityColors = {
    low: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    medium: "bg-amber-50 text-amber-600 border border-amber-100",
    high: "bg-rose-50 text-rose-600 border border-rose-100",
  };

  return (
    <div
      className="fixed inset-0 z-45 flex items-center justify-center p-4 backdrop-blur-xs bg-black/35"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-6 py-4 rounded-t-2xl border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{boardTitle}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage tasks and track project progress</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAddTodo("todo")}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Task
            </button>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Board Tasks Columns */}
        <div className="flex-1 overflow-x-auto p-6">
          {loading && tasks.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400 font-medium">
              Loading board tasks...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[768px]">
              {columns.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.id);
                const isOver = dragOverCol === col.id;
                return (
                  <div
                    key={col.id}
                    className={`flex flex-col h-full border rounded-2xl p-4 transition-all duration-200 ${
                      isOver
                        ? "bg-purple-50/60 border-purple-300 ring-2 ring-purple-200"
                        : "bg-white/70 border-gray-100"
                    }`}
                    onDragOver={(e) => onDragOver(e, col.id)}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, col.id)}
                  >
                    {/* Column Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800">{col.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.color}`}>
                          {columnTasks.length}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenAddTodo(col.id)}
                        className="text-gray-400 hover:text-purple-600 cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Column Content */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                      {columnTasks.map((task) => (
                        <div
                          key={task._id}
                          draggable
                          onDragStart={(e) => onDragStart(e, task._id)}
                          onDragEnd={onDragEnd}
                          className={`bg-white border border-gray-100 hover:border-gray-200/80 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-3 group relative cursor-grab active:cursor-grabbing transition-opacity duration-150 ${
                            dragTaskId === task._id ? "opacity-40 scale-[0.97]" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
                              {task.priority}
                            </span>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEditTodo(task)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                title="Edit"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="text-gray-400 hover:text-red-500 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="text-left">
                            <h4 className="font-bold text-sm text-gray-900 leading-snug">{task.title}</h4>
                            {task.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-gray-50">
                            <span>📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "No due date"}</span>
                            {task.estimatedEffort && (
                              <span className="font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                                ⏱️ {task.estimatedEffort}
                              </span>
                            )}
                          </div>

                          {/* Quick Move Buttons */}
                          <div className="flex justify-end gap-1.5 pt-1 border-t border-gray-50/50">
                            {col.id !== "todo" && (
                              <button
                                onClick={() => handleMoveStatus(task._id, col.id === "done" ? "in-progress" : "todo")}
                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
                                title="Move Left"
                              >
                                <ChevronLeft size={12} />
                              </button>
                            )}
                            {col.id !== "done" && (
                              <button
                                onClick={() => handleMoveStatus(task._id, col.id === "todo" ? "in-progress" : "done")}
                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
                                title="Move Right"
                              >
                                <ChevronRight size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Todo Modal */}
      <AddTodoModel
        isOpen={isTodoOpen}
        onClose={() => setIsTodoOpen(false)}
        boardId={boardId}
        onEdit={editTodo}
        onSubmit={fetchTasks}
        defaultStatus={todoStatusFilter}
      />
    </div>
  );
}
