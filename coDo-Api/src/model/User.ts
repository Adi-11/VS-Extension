import mongoose, { Schema, Document } from "mongoose";
import Todo from "./Todo";

export interface User extends Document {
  id: number;
  name: string;
  gitHubId: string;
  todos: typeof Todo[];
}

const UserSchema: Schema = new Schema({
  id: {
    type: Number,
    required: false,
    unique: true,
  },

  name: {
    type: String,
    required: true,
    unique: true,
    null: true,
  },
  gitHubId: {
    type: String,
    required: true,
    unique: true,
  },
  todos: {
    type: mongoose.Schema.Types.Array,
    ref: "Todo",
  },
});

export default mongoose.model<User>("User", UserSchema);
