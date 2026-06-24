// src/models/task.model.ts

import mongoose, { Schema, Document , model } from "mongoose";

export type TaskStatus =
  | "todo"
  | "in-progress"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface ITask extends Document {
  title: string;
  description?: string;

  status: TaskStatus;

  priority: TaskPriority;

  dueDate?: Date;

  estimatedEffort?: string;

  owner: mongoose.Types.ObjectId;

  board: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "todo",
        "in-progress",
        "done",
      ],
      default: "todo",
    },

    priority: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
      ],
      default: "medium",
    },

    dueDate: Date,

    estimatedEffort: String,

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = model("todo",taskSchema);