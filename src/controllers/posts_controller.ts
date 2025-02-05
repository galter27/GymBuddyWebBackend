import postModel, { iPost } from "../models/posts_model";
import commentsModel from "../models/comments_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";

class PostController extends BaseController<iPost> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        const post = {
            ...req.body,
            owner: userId
        }
        req.body = post;
        super.create(req, res);
    }

    async delete(req: Request, res: Response) {
        const postId = req.params.id;
        await commentsModel.deleteMany({ postId });
        super.delete(req, res);
    }

    async updateManyByOwner(req: Request, res: Response) {
        const owner = req.params.owner;
        const newUsername = req.body.username;
    
        if (!newUsername) {
            res.status(400).send({ message: "New username is required" });
            return;
        }
    
        try {
            const result = await this.model.updateMany(
                { owner: owner },
                { $set: { username: newUsername } }
            );
    
            res.status(200).send({
                message: "Posts updated",
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount
            });
        } catch (err) {
            res.status(400).send({ message: "Error updating posts", error: err });
        }
    }
}

export default new PostController();