import mongoose, { model, Schema } from "mongoose";
import { ChatbotModel } from "./chatbot.model.ts";
export interface IChatTab {
  owner: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatTabSchema = new Schema<IChatTab>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  }
);

export const ChatTabModel = model<IChatTab>(
  "ChatTab",
  chatTabSchema
);


export const addChatTab = async (owner: mongoose.Types.ObjectId) => {
  const chatTab = await ChatTabModel.create({
    owner,
    title: "New Chat",
  });

  return chatTab;
};


export const deleteChatTab = async (
  chatTabId: mongoose.Types.ObjectId,
  owner: mongoose.Types.ObjectId
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedChatTab = await ChatTabModel.findOneAndDelete(
      {
        _id: chatTabId,
        owner,
      },
      { session }
    );

    if (!deletedChatTab) {
      throw new Error("Chat tab not found");
    }

    await ChatbotModel.deleteMany(
      { chatTab: chatTabId },
      { session }
    );

    await session.commitTransaction();

    return deletedChatTab;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};