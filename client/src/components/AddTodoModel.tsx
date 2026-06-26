import { useState, useEffect } from "react";
import api from "../services/api";

export interface EditTodoData {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  estimatedEffort?: string;
}

interface AddTodoModelProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  onEdit?: EditTodoData | null;
  onSubmit?: () => void;
  defaultStatus?: "todo" | "in-progress" | "done";
}

export default function AddTodoModel({
  isOpen,
  onClose,
  boardId,
  onEdit,
  onSubmit,
  defaultStatus,
}: AddTodoModelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in-progress" | "done">("todo");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [estimatedEffort, setEstimatedEffort] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setTitle(onEdit?.title || "");
      setDescription(onEdit?.description || "");
      setStatus(onEdit?.status || defaultStatus || "todo");
      setPriority(onEdit?.priority || "medium");
      
      if (onEdit?.dueDate) {
        setDueDate(new Date(onEdit.dueDate).toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
      setEstimatedEffort(onEdit?.estimatedEffort || "");
    }
  }, [onEdit, isOpen]);

  if (!isOpen) return null;

  const fieldClass =
    "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";

  const handleAiSuggest = async () => {
    if (!title.trim()) return setError("Please enter a title first for AI suggestion");
    try {
      setAiLoading(true);
      setError("");

      const { data } = await api.post<{ effort: string; dueDate: string; reasoning: string }>(
        "/suggest",
        {
          title: title.trim(),
          description: description.trim(),
        }
      );

      if (data.effort) setEstimatedEffort(data.effort);
      if (data.dueDate) setDueDate(data.dueDate.split("T")[0]);
    } catch (err: any) {
      setError(err.response?.data?.message || "AI suggestion failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return setError("Title is required");

    try {
      setLoading(true);
      setError("");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        estimatedEffort,
        board: boardId,
      };

      if (onEdit) {
        await api.put(`/task/${onEdit._id}`, payload);
      } else {
        await api.post("/task", payload);
      }

      onSubmit?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs bg-black/35"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {onEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">✕</button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build user management module"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add task description..."
                rows={4}
                className={`${fieldClass} resize-none`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className={fieldClass}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className={fieldClass}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={fieldClass}
              />
            </div>

            {/* AI Suggestion Box */}
            <div className="bg-purple-50/60 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 flex flex-col gap-2 mt-1">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300">AI Suggestion (Optional)</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Get AI suggestion for effort and due date</p>
                </div>
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={aiLoading}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {aiLoading ? "Thinking..." : "+ Suggest"}
                </button>
              </div>
              {estimatedEffort && (
                <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-900/40 px-2 py-1 rounded-md self-start">
                  ✨ Suggested Effort: {estimatedEffort}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-750 text-white text-sm font-bold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : onEdit ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
