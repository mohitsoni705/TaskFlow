
import { TaskModel } from "../models/task.model.ts";
import type { Request, Response } from "express";
import {BoardModel} from "../models/board.model.ts";

export const createBoard = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const board = await BoardModel.create({
      title,
      description,
      //@ts-ignore
      owner: req.userId,
    });
    res.status(201).json({
      success: true,
      board,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create board",
    });
  }
};

export const getBoards = async (
  req: Request,
  res: Response
) => {
  try {
    const boards = await BoardModel.find({
        // @ts-ignore
      owner: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      boards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch boards",
    });
  }
};

export const getBoard = async (
  req: Request,
  res: Response
) => {
  try {
    const board = await BoardModel.findOne({
      _id: req.params.id,
    //   @ts-ignore
      owner: req.userId,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      board,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch board",
    });
  }
};

export const updateBoard = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    const board = await BoardModel.findOneAndUpdate(
      {
        _id: req.params.id,
        //   @ts-ignore
        owner: req.userId,
      },
      {
        title,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      board,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update board",
    });
  }
};


export const deleteBoard = async (
  req: Request,
  res: Response
) => {
  try {
    const board = await BoardModel.findOne({
      _id: req.params.id,
    //   @ts-ignore
      owner: req.userId,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    await TaskModel.deleteMany({
      board: board._id,
    });

    await board.deleteOne();

    res.status(200).json({
      success: true,
      message: "Board deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete board",
    });
  }
};