import commentsModel, { iComment } from "../models/comments_model";
import postModel from "../models/posts_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";

class CommentController extends BaseController<iComment> {
    constructor() {
        super(commentsModel);
    }

    async create(req: Request, res: Response) {
        // Extract postId from route parameters
        const postId = req.body.postId; 

        if (!postId) {
            res.status(400).send({ message: "postId is required" });
            return;
        }

        if (await postModel.findOne({ _id: postId })) {
            const userId = req.params.userId;
            const comment = {
                ...req.body,
                owner: userId
            }
            req.body = comment;
            super.create(req, res);
        } else {
            res.status(404).send({ message: "Post not found" });
        }
    }

    async getByPostId(req: Request, res: Response) {
        const postId = req.params.postId;
    
        try {
            const comments = await this.model.find({ postId });
            
            if (comments.length === 0) {
                res.status(200).send([]);
                return;
            }
            
            res.status(200).send(comments);
        } catch (err) {
            res.status(400).send(err);
        }
    }
    
}

export default new CommentController();
