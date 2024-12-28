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
}

export default new PostController();