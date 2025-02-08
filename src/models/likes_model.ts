import mongoose from "mongoose";

export interface ILike {
  owner: string;
  postId: string;
}

const likesSchema = new mongoose.Schema<ILike>(
  {
    owner: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const commentsModel = mongoose.model<ILike>("likes", likesSchema);

export default commentsModel;
