import mongoose ,{model , Schema} from "mongoose";


export interface IBoard {
  title: string;
  description?: string;
  owner: string;
}
const boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });
export const BoardModel = model("Board",boardSchema);