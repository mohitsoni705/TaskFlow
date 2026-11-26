import mongoose, { model, Schema } from "mongoose";

export interface IChatMessage {
  owner: mongoose.Types.ObjectId;
  chatTab: mongoose.Types.ObjectId;
  query: string;
  response: string;
  createdAt: Date;
}

const chatbotSchema = new Schema<IChatMessage>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    chatTab: { type: Schema.Types.ObjectId, ref: "ChatTab", required: true, index: true },
    query: { type: String, required: true, trim: true },
    response: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ChatbotModel = model<IChatMessage>("Chatbot", chatbotSchema);
