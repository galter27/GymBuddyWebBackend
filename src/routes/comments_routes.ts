import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

// Get all comments
router.get("/", commentsController.getAll.bind(commentsController));

// Get a comment by ID
router.get("/:id", commentsController.getById.bind(commentsController));

// Create a new comment
router.post("/", commentsController.create.bind(commentsController));

// Update a comment by ID
router.put("/:id", commentsController.update.bind(commentsController));

// Delete a comment by ID
router.delete("/:id", commentsController.delete.bind(commentsController));

export default router;
