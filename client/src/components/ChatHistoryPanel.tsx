import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import type { ChatTab } from "../services/chatService";

interface ChatHistoryPanelProps {
  chats: ChatTab[];
  activeChatId?: string;
  loading?: boolean;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onClose?: () => void;
}

const groupLabel = (date: string) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((startOfToday.getTime() - new Date(date).getTime()) / 86400000) + 1;
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Previous 7 days";
  return "Older";
};

const ChatHistoryPanel = ({
  chats,
  activeChatId,
  loading,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClose,
}: ChatHistoryPanelProps) => {
  const groups = chats.reduce<Record<string, ChatTab[]>>((acc, chat) => {
    const label = groupLabel(chat.updatedAt);
    (acc[label] ||= []).push(chat);
    return acc;
  }, {});

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onNewChat}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-sm font-semibold text-white shadow-md transition cursor-pointer"
        >
          <Plus size={16} />
          New Chat
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Close recent chats"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Recent Chats
        </p>

        {loading && chats.length === 0 ? (
          <div className="space-y-2 px-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-9 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center text-center px-4 py-10 text-gray-400 dark:text-gray-500">
            <MessageSquare size={24} className="mb-2" />
            <p className="text-sm">No chats yet</p>
            <p className="text-xs mt-1">Start a new chat to ask Tasky anything.</p>
          </div>
        ) : (
          Object.entries(groups).map(([label, items]) => (
            <div key={label} className="mb-4">
              <p className="px-2 mb-1 text-[11px] font-medium text-gray-400 dark:text-gray-500">{label}</p>
              <div className="space-y-1">
                {items.map((chat) => {
                  const isActive = chat._id === activeChatId;
                  return (
                    <div
                      key={chat._id}
                      onClick={() => onSelectChat(chat._id)}
                      className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition
                      ${
                        isActive
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      <MessageSquare size={14} className="shrink-0" />
                      <span className="flex-1 truncate">{chat.title}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }}
                        className="shrink-0 p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition cursor-pointer"
                        aria-label="Delete chat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPanel;
