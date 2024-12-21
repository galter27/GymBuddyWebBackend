import commentsModel, { iComment } from "../models/comments_model";
import { Request, Response } from "express";
import createController from "./base_controller";

const commentsController = createController<iComment>(commentsModel);

export default commentsController