import mongoose from "mongoose";

export interface iComment {
  comment: string;
  postId: string;
  owner: string;
  username: string;
  createdAt?: Date;  // Optional, as Mongoose will generate it
}

const commentsSchema = new mongoose.Schema<iComment>(
  {
    comment: {
      type: String,
      required: true,
    },
    postId: {
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
  { timestamps: true }
);

const commentsModel = mongoose.model<iComment>("comments", commentsSchema);

export default commentsModel;
