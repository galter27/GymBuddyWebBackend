import commentsModel, { iComment } from "../models/comments_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";

class CommentController extends BaseController<iComment> {
    constructor() {
        super(commentsModel);
    }

    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        const comment = {
            ...req.body,
            owner: userId
        }
        req.body = comment;
        super.create(req, res);
    }

    async getByPostId(req: Request, res: Response) {
        const postId = req.params.postId;

        try {
            const comments = await this.model.find({ postId });
            if (comments.length === 0) {
                res.status(404).send("No comments found for this post");
                return;
            }
            res.status(200).send(comments);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}

export default new CommentController();
