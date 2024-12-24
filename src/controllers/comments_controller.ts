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
}

export default new CommentController();
