import mongoose from "mongoose";

export interface iPost {
  title: string;
  content: string;
  owner: string;
  username: string;
  image?: string;
  createdAt: Date;
  likesCount: number;
}

const postSchema = new mongoose.Schema<iPost>({
  title: {
    type: String,
    required: true,
  },
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
  image: {
    type: String,
    required: false,
  },
  likesCount: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const postModel = mongoose.model<iPost>("posts", postSchema);

export default postModel;
