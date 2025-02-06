import mongoose from "mongoose";

export interface iChatMessage {
  content: string;
  owner: string;
  username: string;
  createdAt?: Date;
}

const chatMessageSchema = new mongoose.Schema<iChatMessage>(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }  // Automatically generates createdAt and updatedAt fields
);

const chatMessageModel = mongoose.model<iChatMessage>("chatmessages", chatMessageSchema);

export default chatMessageModel;
