import mongoose ,{model , Schema} from "mongoose";


export interface IBoard {
  title: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
}
const boardSchema = new Schema<IBoard>(
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

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const BoardModel = model("Board",boardSchema);

//functions/methods

