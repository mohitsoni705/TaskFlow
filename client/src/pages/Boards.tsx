import { useState, useEffect } from "react";
import BoardCard from "../components/BoardCard";
import BoardTasksModal from "../components/BoardTasksModal";
import AddBoardModel, { type EditData } from "../components/AddBoardModel";
import ConfirmModal from "../components/UI/ConfirmModal";
import api from "../services/api";

const Boards = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit Board Modal State
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [editBoardData, setEditBoardData] = useState<EditData | null>(null);

  // Delete Board Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selected Board for Tasks Modal
  const [selectedBoard, setSelectedBoard] = useState<any | null>(null);

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

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleEditBoard = (board: any) => {
    setEditBoardData({ boardId: board._id, title: board.title, description: board.description || "" });
    setIsBoardOpen(true);
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
    <div className="min-h-screen w-full p-6">
      {/* Board Modals */}
      <AddBoardModel isOpen={isBoardOpen} onClose={() => { setIsBoardOpen(false); setEditBoardData(null); }} onEdit={editBoardData} onSubmit={fetchBoards} />
      <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} loading={isDeleting} />

      {/* Board Details Tasks Modal */}
      {selectedBoard && (
        <BoardTasksModal
          isOpen={!!selectedBoard}
          onClose={() => setSelectedBoard(null)}
          boardId={selectedBoard._id}
          boardTitle={selectedBoard.title}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">All Boards</h1>
          <p className="text-gray-500 text-sm">Select a board to manage its tasks</p>
        </div>
      </div>

      {loading && boards.length === 0 ? (
        <div className="flex justify-center items-center h-48 text-gray-400">Loading...</div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-200 rounded-2xl bg-white p-8">
          <div className="text-2xl mb-2">📁</div>
          <h3 className="font-bold text-gray-900 mb-2">No Boards Found</h3>
          <p className="text-sm text-gray-500">Go to your Dashboard to create a new board!</p>
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
              onClick={() => setSelectedBoard(board)}
              onEdit={() => handleEditBoard(board)}
              onDelete={() => { setDeleteBoardId(board._id); setIsDeleteOpen(true); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Boards;
