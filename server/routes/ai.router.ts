import express from "express";
import UserAuthMiddleware from "../middlewares/auth.middleware.ts";
import { askAI, deleteChat, getChatMessages, getChats, suggestEstimate } from "../controllers/ai.controller.ts";

const router = express.Router();


router.post("/suggest",UserAuthMiddleware,suggestEstimate);//get ai suggestion effort + due date
router.post("/ask-ai",UserAuthMiddleware,askAI)
router.get("/chats", UserAuthMiddleware, getChats);
router.get("/chats/:chatId", UserAuthMiddleware, getChatMessages);
router.delete("/chats/:chatId", UserAuthMiddleware, deleteChat);

export default router;
