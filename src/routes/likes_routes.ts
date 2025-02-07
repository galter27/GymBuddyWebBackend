import express from "express";
import likesController from "../controllers/likes_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

router.post("/", authMiddleware, likesController.createLike);

router.delete("/:postId", authMiddleware, likesController.deleteLike);

router.get("/:postId/:userId", likesController.getLikeByOwner);

export default router;
