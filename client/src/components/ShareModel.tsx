import { useRef, useState } from 'react'
import Input from './UI/Input';
import api from '../services/api';

interface ShareModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const ShareModel = ({ isOpen, onClose, onSubmit }: ShareModelProps) => {
  const codeRef = useRef<HTMLInputElement>(null);
  const [permission, setPermission] = useState("allowed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateCode = (code: string): string => {
    if (!code) return "Code is required";
    if (code.length < 6 || code.length > 12) return "Code must be 6-12 characters";
    if (!/\d/.test(code)) return "Code must contain at least one number";
    return "";
  };

  const handleSubmit = async () => {
    const code = (codeRef.current?.value || "").toUpperCase().trim();
    const validationError = validateCode(code);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      // TODO: await api.post("/share", { code, permission });
      await api.post<{code:String,editType:String}>("/code",{
        code,
        editType:permission
      })
      if (codeRef.current) codeRef.current.value = "";
      setPermission("read-write");
      onSubmit?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs bg-black/35" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Share Board</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl cursor-pointer">✕</button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Share Code (6-12 chars, uppercase, must have number) *</label>
          <Input placeholder="e.g. ABC1234" variant="secondary" reference={codeRef} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Permission</label>
          <select value={permission} onChange={(e) => setPermission(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="allowed">Read & Write</option>
            <option value="notAllowed">Read Only</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

        <div className="flex gap-3 mt-2">
          <button onClick={onClose} disabled={loading} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold disabled:opacity-50">
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModel
