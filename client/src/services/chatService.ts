import api from "./api.ts";

export interface ChatTab {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  query: string;
  response: string;
  createdAt: string;
}

// GET /chats -> { success, chats: ChatTab[] }
export const getChats = () => api.get("/chats");

// GET /chats/:chatId -> { success, messages: ChatMessage[] }
export const getChatMessages = (chatId: string) => api.get(`/chats/${chatId}`);

// DELETE /chats/:chatId -> { success }
export const deleteChat = (chatId: string) => api.delete(`/chats/${chatId}`);

// POST /ask-ai { chatId?, query } -> { success, chat: ChatTab, message: ChatMessage }
// When chatId is omitted the server creates a new chat tab.
export const askTasky = ({ chatId, query }: { chatId?: string; query: string }) =>
  api.post("/ask-ai", { chatId, query });
