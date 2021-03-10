import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  id: number;
  name: string;
}

const UserSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model<User>("User", UserSchema);
