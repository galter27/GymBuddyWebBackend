import express from "express";
const router = express.Router();
import postConctoller from "../controllers/posts";

router.get('/', postConctoller.getAllPosts);

router.get('/:postId', (req, res) => {
  postConctoller.getPostByid(req, res)
});

router.post('/', postConctoller.createNewPost);

router.delete('/:postId', (req, res) => {
  postConctoller.deletePost(req, res)
});

router.put('/:postId', (req, res) => {
    postConctoller.updatePost(req, res)
});

export default router;