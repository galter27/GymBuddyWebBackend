import mongoose from "mongoose";

export interface iPost {
  title: string;
  content: string;
  owner: string;
  image?: string; // Optional field for the image URL
  createdAt: Date; // New createdAt field
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
  image: {
    type: String, // URL or path to the image
    required: false, // Optional field
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const postModel = mongoose.model<iPost>("posts", postSchema);

export default postModel;
