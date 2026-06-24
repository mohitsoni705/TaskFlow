import express from "express";
import UserAuthMiddleware from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/api/task",UserAuthMiddleware);
router.get("/api/task?boardId=..",UserAuthMiddleware);
router.put("/api/task/:id",UserAuthMiddleware);
router.delete("/api/task/:id",UserAuthMiddleware);
router.put("/api/task/:id/move",UserAuthMiddleware);//change status (move column)