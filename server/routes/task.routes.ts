import express from "express";
import UserAuthMiddleware from "../middlewares/auth.middleware.ts";
import { createTask, deleteTask, getTasksByBoard, updateTask, updateTaskStatus } from "../controllers/task.controller.ts";
// import { updateBoard } from "../controllers/boards.controller.ts";

const router = express.Router();

router.post("/task",UserAuthMiddleware,createTask);
router.get("/task",UserAuthMiddleware,getTasksByBoard);
router.put("/task/:id",UserAuthMiddleware,updateTask);
router.delete("/task/:id",UserAuthMiddleware,deleteTask);
router.patch("/task/:id/status",UserAuthMiddleware,updateTaskStatus);//change status (move column)

export default router;