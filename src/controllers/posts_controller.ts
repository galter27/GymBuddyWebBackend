import postModel, { iPost } from "../models/posts_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";

class PostController extends BaseController<iPost> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response){
        const userId = req.params.userId;
        const post = {
            ...req.body,
            owner: userId
        }
        req.body = post;
        super.create(req, res);
    }
}

export default new PostController();