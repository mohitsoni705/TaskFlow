// ai.controller.ts

import type{ Request, Response } from "express";
import { suggestTaskEstimate } from "../ai.service.ts";

export const suggestEstimate = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title required",
      });
    }

    const result = await suggestTaskEstimate({
      title,
      description,
    });

    return res.json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      effort: "Unknown",
      dueDate: "",
      reasoning:
        "AI service unavailable.",
    });
  }
};