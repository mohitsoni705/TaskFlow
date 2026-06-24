import express from "express";
import UserAuthMiddleware from "../middlewares/auth.middleware.ts";
import { createBoard, deleteBoard, getBoard, getBoards, updateBoard } from "../controllers/boards.controller.ts";

const router = express.Router();

router.post("/boards",UserAuthMiddleware,createBoard);
router.get("/boards",UserAuthMiddleware,getBoards);
router.get("/boards/:id",UserAuthMiddleware , getBoard);
router.put("/boards/:id",UserAuthMiddleware , updateBoard);
router.delete("/boards/:id",UserAuthMiddleware , deleteBoard);

export default router;