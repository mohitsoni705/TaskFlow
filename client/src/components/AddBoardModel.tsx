import { useRef, useEffect, useState } from "react";
import Input from "./UI/Input";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export interface EditData {
  boardId: string;
  title: string;
  description: string;
}

interface AddBoardModelProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: EditData | null;
  onSubmit?: () => void;
}

export default function AddBoardModel({ isOpen, onClose, onEdit, onSubmit }: AddBoardModelProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (titleRef.current) titleRef.current.value = onEdit?.title || "";
      if (descriptionRef.current) descriptionRef.current.value = onEdit?.description || "";
    }
  }, [onEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const title = titleRef.current?.value.trim() || "";
    const description = descriptionRef.current?.value.trim() || "";
    if (!title) return setError("Title is required");

    try {
      setLoading(true);
      setError("");
      
      let userId = "";
      try {
        userId = JSON.parse(atob(localStorage.getItem("token")?.split(".")[1] || "")).user_id || "";
      } catch (e) {}

      const payload = { title, description, userId };
      if (onEdit) {
        await api.put(`/boards/${onEdit.boardId}`, payload);
      } else {
        await api.post("/boards", payload);
      }

      onSubmit?.();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{onEdit ? "Edit Board" : "Create Board"}</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">✕</button>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Board Title *</label>
          <Input placeholder="e.g. Work Tasks" variant="secondary" reference={titleRef} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description (optional)</label>
          <Input placeholder="What is this board for?" variant="secondary" reference={descriptionRef} />
        </div>
        {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : onEdit ? "Update Board" : "Create Board"}
          </button>
        </div>
      </div>
    </div>
  );
}
