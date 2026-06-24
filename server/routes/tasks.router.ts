import express from "express";
import UserAuthMiddleware from "../middlewares/auth.middleware.ts";
import { createTask, deleteTask, getTasksByBoard, updateTask, updateTaskStatus } from "../controllers/task.controller.ts";
// import { updateBoard } from "../controllers/boards.controller.ts";

const router = express.Router();

router.post("/api/task",UserAuthMiddleware,createTask);
router.get("/api/task?boardId=..",UserAuthMiddleware,getTasksByBoard);
router.put("/api/task/:id",UserAuthMiddleware,updateTask);
router.delete("/api/task/:id",UserAuthMiddleware,deleteTask);
router.patch("/api/task/:id/status",UserAuthMiddleware,updateTaskStatus);//change status (move column)

export default router;