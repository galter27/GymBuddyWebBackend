import mongoose from "mongoose";

export interface iPost {
  title: string,
  content: string,
  owner: string,
}

const postSchema = new mongoose.Schema<iPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model<iPost>("posts", postSchema);

export default postModel;