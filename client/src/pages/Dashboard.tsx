import { Plus } from "lucide-react";
import Button from "../components/UI/Button";
import { useState, useEffect } from "react";
import AddBoardModel, { type EditData } from "../components/AddBoardModel";
import BoardCard from "../components/BoardCard";
import ConfirmModal from "../components/UI/ConfirmModal";
import api from "../services/api";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await api.get("/boards");
      if (res.data?.success) setBoards(res.data.boards || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoards(); }, []);

  const handleEditBoard = (board: any) => {
    setEditData({ boardId: board._id, title: board.title, description: board.description || "" });
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteBoardId) return;
    try {
      setIsDeleting(true);
      await api.delete(`/boards/${deleteBoardId}`);
      await fetchBoards();
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full w-full p-6">
      <AddBoardModel isOpen={isOpen} onClose={() => { setIsOpen(false); setEditData(null); }} onEdit={editData} onSubmit={fetchBoards} />
      <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} loading={isDeleting} />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">My Boards</h1>
          <p className="text-gray-500 text-sm">Create and manage your boards</p>
        </div>
        <div>
        <Button innerText="Create Board" size="sm" variant="square" frontIcon={<Plus size={16} />} onClick={() => setIsOpen(true)} />
        </div>
      </div>

      {loading && boards.length === 0 ? (
        <div className="flex justify-center items-center h-48 text-gray-400">Loading...</div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-200 rounded-2xl bg-white p-8">
          <div className="text-2xl mb-2">📁</div>
          <h3 className="font-bold text-gray-900 mb-4">No Boards Found</h3>
          <Button innerText="Create Board" size="sm" variant="square" onClick={() => setIsOpen(true)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              title={board.title}
              description={board.description}
              tasksCount={board.tasksCount || 0}
              updatedAt={board.updatedAt ? new Date(board.updatedAt).toLocaleDateString() : "just now"}
              onEdit={() => handleEditBoard(board)}
              onDelete={() => { setDeleteBoardId(board._id); setIsDeleteOpen(true); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
