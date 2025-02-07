import express from "express";
import chatController from "../controllers/chat_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

router.post("/", authMiddleware, chatController.create.bind(chatController));

export default router;