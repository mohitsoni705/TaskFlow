import type { Request, Response } from "express";
import { TaskModel } from "../models/task.model";

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedEffort,
      board,
    } = req.body;

    const task = await TaskModel.create({
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedEffort,
      board,
      //   @ts-ignore
      owner: req.userId,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

export const getTasksByBoard = async (
  req: Request,
  res: Response
) => {
  try {
    const { boardId } = req.params;

    const tasks = await TaskModel.find({
      board: boardId,
      //@ts-ignore
      owner: req.userId,
    });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
) => {
  try {
    const task = await TaskModel.findOneAndUpdate(
      {
        _id: req.params.id,
        //@ts-ignore
      owner: req.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;

    const task = await TaskModel.findOneAndUpdate(
      {
        _id: req.params.id,
        //   @ts-ignore
      owner: req.userId,
      },
      {
        status,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
) => {
  try {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      //   @ts-ignore
      owner: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};