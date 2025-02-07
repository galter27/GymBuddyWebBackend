import { Request, Response } from "express";
import likeModel from "../models/likes_model";
import postModel from "../models/posts_model";
import userModel from "../models/user_model";


// Create Like
const createLike = async (req: Request, res: Response) => {
    const postId = req.body.postId;
    const userId = req.params.userId;
    console.log("Post ID", postId);
    console.log("User ID", userId)
    
    // Validate Post and User
    const isValid = await validateLike(postId, userId);
    if (!isValid) {
        res.status(400).send({ message: "Unauthorized or Invalid Data" });
        return;
    }

    try {
        const likeObject = await likeModel.create({
            owner: userId,
            postId: postId
        });
        res.status(201).send(likeObject);
    } catch (err) {
        res.status(400).send({ message: "Error creating like", error: err });
    }
}

// Delete Like
const deleteLike = async (req: Request, res: Response) => {
    const { postId, userId } = req.body;

    // Validate Post and User
    const isValid = await validateLike(postId, userId);
    if (!isValid) {
        res.status(400).send({ message: "Unauthorized or Invalid Data" });
        console.log("Entered")
        return;
    }

    try {
        const deletedLikeObject = await likeModel.findOneAndDelete({ postId: postId, owner: userId });
        if (!deletedLikeObject) {
            res.status(404).send({ message: "Like not found or unauthorized" });
            return;
        }
        res.status(200).send({ message: "Like deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting like", error: err });
    }
}

// Get Like by Owner (Check if User Liked a Post)
const getLikeByOwner = async (req: Request, res: Response) => {
    const { userId, postId } = req.params;

    try {
        const like = await likeModel.findOne({ owner: userId, postId: postId });

        if (like) {
            res.status(200).send({ liked: true });
        } else {
            res.status(200).send({ liked: false });
        }
    } catch (err) {
        res.status(500).send({ message: "Error checking like status", error: err });
    }
};


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

export default { createLike, deleteLike, getLikeByOwner };
