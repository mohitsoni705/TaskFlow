import express from "express";
import UserAuthMiddleware from "../middlewares/auth.middleware.ts";

const router = express.Router();


router.post("/api/ai/suggest",UserAuthMiddleware);//get ai suggestion effort + due date