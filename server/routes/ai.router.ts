import express from "express";
import UserAuthMiddleware from "../middlewares/auth.middleware.ts";
import { suggestEstimate } from "../controllers/ai.controller.ts";

const router = express.Router();


router.post("/suggest",UserAuthMiddleware,suggestEstimate);//get ai suggestion effort + due date

export default router;