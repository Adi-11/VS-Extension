import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  id: number;
  name: string;
  gitHubId: string;
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
});

export default mongoose.model<User>("User", UserSchema);
