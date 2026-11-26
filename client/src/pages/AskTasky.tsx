import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, History, SendHorizontal, Sparkles } from "lucide-react";
import ChatHistoryPanel from "../components/ChatHistoryPanel";
import ConfirmModal from "../components/UI/ConfirmModal";
import {
  askTasky,
  deleteChat,
  getChatMessages,
  getChats,
  type ChatMessage,
  type ChatTab,
} from "../services/chatService";

const SUGGESTIONS = [
  "What tasks are due this week?",
  "Summarize the progress on my boards",
  "Which high priority tasks are still pending?",
  "Help me plan my day",
];

const AskTasky = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState<ChatTab[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Set when a new chat is created by sending, so we don't refetch messages we already have
  const skipFetchFor = useRef<string | null>(null);

  const fetchChats = async () => {
    try {
      setChatsLoading(true);
      const res = await getChats();
      if (res.data?.success) setChats(res.data.chats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setChatsLoading(false);
    }
  };

  useEffect(() => { fetchChats(); }, []);

  useEffect(() => {
    setError("");
    if (!chatId) {
      setMessages([]);
      return;
    }
    if (skipFetchFor.current === chatId) {
      skipFetchFor.current = null;
      return;
    }
    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        const res = await getChatMessages(chatId);
        if (res.data?.success) setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
        setError("Couldn't load this chat.");
      } finally {
        setMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleNewChat = () => {
    setIsHistoryOpen(false);
    setQuery("");
    navigate("/ask-tasky");
    inputRef.current?.focus();
  };

  const handleSelectChat = (id: string) => {
    setIsHistoryOpen(false);
    navigate(`/ask-tasky/${id}`);
  };

  const handleSend = async (text = query) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { _id: tempId, query: trimmed, response: "", createdAt: new Date().toISOString() }]);
    setQuery("");
    setError("");

    try {
      setSending(true);
      const res = await askTasky({ chatId, query: trimmed });
      if (!res.data?.success) throw new Error("Request failed");

      const { chat, message } = res.data;
      setMessages((prev) => prev.map((m) => (m._id === tempId ? message : m)));
      setChats((prev) => [chat, ...prev.filter((c) => c._id !== chat._id)]);

      if (!chatId) {
        skipFetchFor.current = chat._id;
        navigate(`/ask-tasky/${chat._id}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      setQuery(trimmed);
      setError("Tasky couldn't respond right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteChatId) return;
    try {
      setIsDeleting(true);
      await deleteChat(deleteChatId);
      setChats((prev) => prev.filter((c) => c._id !== deleteChatId));
      if (deleteChatId === chatId) navigate("/ask-tasky");
      setDeleteChatId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedChats = [...chats].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const activeChat = chats.find((c) => c._id === chatId);

  const historyPanel = (onClose?: () => void) => (
    <ChatHistoryPanel
      chats={sortedChats}
      activeChatId={chatId}
      loading={chatsLoading}
      onNewChat={handleNewChat}
      onSelectChat={handleSelectChat}
      onDeleteChat={setDeleteChatId}
      onClose={onClose}
    />
  );

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] md:h-[calc(100vh-4rem)] w-full gap-4">
      <ConfirmModal
        isOpen={!!deleteChatId}
        onClose={() => setDeleteChatId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Chat"
        message="This conversation will be permanently deleted."
      />

      {/* Recent chats (Desktop) */}
      <div className="hidden lg:flex w-72 shrink-0 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        {historyPanel()}
      </div>

      {/* Recent chats (Mobile drawer) */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden backdrop-blur-xs bg-black/35" onClick={() => setIsHistoryOpen(false)}>
          <div className="h-full w-72 max-w-[85%] shadow-xl" onClick={(e) => e.stopPropagation()}>
            {historyPanel(() => setIsHistoryOpen(false))}
          </div>
        </div>
      )}

      {/* Chat area */}
      <section className="flex flex-1 min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Show recent chats"
          >
            <History size={18} />
          </button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 dark:text-gray-100 truncate">
              {activeChat?.title || "Ask Tasky"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your AI assistant for boards and tasks</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {messagesLoading ? (
            <div className="flex justify-center items-center h-full text-gray-400 dark:text-gray-500">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 mb-4">
                <Bot size={28} />
              </div>
              <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">How can I help you today?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
                Ask Tasky about your boards, tasks, deadlines and priorities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-left text-sm rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m) => (
                <div key={m._id} className="space-y-4">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-purple-600 px-4 py-2.5 text-sm text-white whitespace-pre-wrap break-words">
                      {m.query}
                    </div>
                  </div>
                  {m.response && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                        <Bot size={16} />
                      </div>
                      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                        {m.response}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {sending && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                    <Bot size={16} />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800 px-4 py-3.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-.15s]" />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-.3s]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="px-4 md:px-8 pb-4 pt-2">
          {error && <p className="max-w-3xl mx-auto mb-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
          <div className="max-w-3xl mx-auto flex items-end gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus-within:border-purple-400 dark:focus-within:border-purple-500 transition">
            <textarea
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask Tasky anything..."
              className="flex-1 max-h-40 resize-none bg-transparent py-1.5 text-sm outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 [field-sizing:content]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!query.trim() || sending}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <SendHorizontal size={16} />
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-2">
            Tasky can make mistakes. Double-check important details.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AskTasky;
