import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

// Get all comments
router.get("/", (req, res) => {
    commentsController.getAll(req, res);
});

// Get a comment by ID
router.get("/:id", (req, res) => {
    commentsController.getById(req, res);
});

// Create a new comment
router.post("/", (req, res) => {
    commentsController.create(req, res);
});

// Update a comment by ID
router.put("/:id", (req, res) => {
    commentsController.update(req, res);
});

// Delete a comment by ID
router.delete("/:id", (req, res) => {
    commentsController.delete(req, res);
});

export default router;
