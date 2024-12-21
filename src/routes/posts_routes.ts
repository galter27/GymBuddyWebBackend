import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller"

// Get all 
router.get("/", postsController.getAll.bind(postsController));

// Get by id
router.get("/:id", (req, res) => {
    postsController.getById(req, res);
});

// Create 
router.post("/", postsController.create.bind(postsController));

// Update by id
router.put("/:id", (req, res) => { 
  postsController.update.bind(postsController)(req, res)
});

// Delete by id
router.delete("/:id", (req, res) => { 
  postsController.delete.bind(postsController)(req, res)
});


export default router;