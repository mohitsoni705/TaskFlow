import type { Request, Response } from "express";
import mongoose from "mongoose";
import { getAiResponse, suggestTaskEstimate } from "../ai.service.ts";
import { ChatbotModel } from "../models/chatbot.model.ts";
import { ChatTabModel } from "../models/chattab.model.ts";

const ownerId = (req: Request) => new mongoose.Types.ObjectId((req as any).userId);

export const suggestEstimate = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Task title required" });
    return res.json(await suggestTaskEstimate({ title, description: description || "" }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ effort: "Unknown", dueDate: "", reasoning: "AI service unavailable." });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await ChatTabModel.find({ owner: ownerId(req) }).sort({ updatedAt: -1 });
    return res.json({ success: true, chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch chats" });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const owner = ownerId(req);
    const chat = await ChatTabModel.findOne({ _id: req.params.chatId, owner });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
    const messages = await ChatbotModel.find({ chatTab: chat._id, owner }).sort({ createdAt: 1 });
    return res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: "Failed to fetch chat messages" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const owner = ownerId(req);
    const chat = await ChatTabModel.findOneAndDelete({ _id: req.params.chatId, owner });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
    await ChatbotModel.deleteMany({ chatTab: chat._id, owner });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: "Failed to delete chat" });
  }
};

export const askAI = async (req: Request, res: Response) => {
  try {
    const owner = ownerId(req);
    const query = typeof req.body.query === "string" ? req.body.query.trim() : "";
    const requestedChatId = req.body.chatId;
    if (!query) return res.status(400).json({ success: false, message: "Message is required" });

    let chat = requestedChatId
      ? await ChatTabModel.findOne({ _id: requestedChatId, owner })
      : null;
    if (requestedChatId && !chat) return res.status(404).json({ success: false, message: "Chat not found" });
    if (!chat) chat = await ChatTabModel.create({ owner, title: query.slice(0, 60) || "New Chat" });
    else if (chat.title === "New Chat") {
      chat.title = query.slice(0, 60);
    }

    const history = await ChatbotModel.find({ chatTab: chat._id, owner })
      .sort({ createdAt: -1 }).limit(12).lean();
    const response = await getAiResponse(query, history.reverse().flatMap((item) => [
      { role: "user" as const, content: item.query },
      { role: "assistant" as const, content: item.response },
    ]));
    const message = await ChatbotModel.create({ owner, chatTab: chat._id, query, response });
    chat.updatedAt = new Date();
    await chat.save();
    return res.json({ success: true, chat, message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "AI service unavailable." });
  }
};
