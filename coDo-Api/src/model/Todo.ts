import mongoose, { Schema, Document } from "mongoose";

export interface Todo extends Document {
  text: string;
  completed: boolean;
  createrId: string;
  creater: mongoose.Schema.Types.ObjectId;
}

const TodoSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createrId: {
    type: String,
    required: true,
  },
  creater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model<Todo>("Todo", TodoSchema);
