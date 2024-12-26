import express from "express";
import postsController from "../controllers/posts_controller"
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();


// Get all 
router.get("/", postsController.getAll.bind(postsController));

// Get by id
router.get("/:id", postsController.getById.bind(postsController));

// Create 
router.post("/", authMiddleware, postsController.create.bind(postsController));

// Update by id
router.put("/:id", authMiddleware, postsController.update.bind(postsController));

// Delete by id
router.delete("/:id", authMiddleware, postsController.delete.bind(postsController));


export default router;