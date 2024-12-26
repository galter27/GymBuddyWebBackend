import express from "express";
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

// Get all comments
router.get("/", commentsController.getAll.bind(commentsController));

// Get a comment by ID
router.get("/:id", commentsController.getById.bind(commentsController));

// Get comments by post ID
router.get("/post/:postId", commentsController.getByPostId.bind(commentsController));

// Create a new comment
router.post("/", authMiddleware, commentsController.create.bind(commentsController));

// Update a comment by ID
router.put("/:id", authMiddleware, commentsController.update.bind(commentsController));

// Delete a comment by ID
router.delete("/:id", authMiddleware, commentsController.delete.bind(commentsController));

export default router;
