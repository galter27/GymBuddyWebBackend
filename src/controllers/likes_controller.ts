import { Request, Response } from "express";
import likeModel from "../models/likes_model";
import postModel from "../models/posts_model";
import commentModel from "../models/comments_model";
import userModel from "../models/user_model";


// Create Like
const createLike = async (req: Request, res: Response) => {
    const postId = req.body.postId;
    const userId = req.body.params;
    console.log(req.body);

    // Validate Post and User
    const isValid = await validateLike(postId, userId);
    if (!isValid) {
        res.status(400).json({ message: "Unauthorized or Invalid Data" });
        return;
    }

    try {
        const likeObject = await likeModel.create({
            owner: userId,
            postId: postId
        });
        res.status(201).json(likeObject);
    } catch (err) {
        res.status(400).json({ message: "Error creating like", error: err });
    }
}

// Delete Like
const deleteLike = async (req: Request, res: Response) => {
    const { postId, userId } = req.body;

    // Validate Post and User
    const isValid = await validateLike(postId, userId);
    if (!isValid) {
        res.status(400).json({ message: "Unauthorized or Invalid Data" });
        return;
    }

    try {
        const deletedLikeObject = await likeModel.findOneAndDelete({ postId, owner: userId });
        if (!deletedLikeObject) {
            res.status(404).json({ message: "Like not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Like deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting like", error: err });
    }
}

// Validate if Post and User Exist
const validateLike = async (postId: string, userId: string): Promise<boolean> => {
    try {
        const post = await postModel.findById(postId);
        const user = await userModel.findById(userId);

        return !!post && !!user;
    } catch {
        return false;
    }
};

export default { createLike, deleteLike };
