import express from "express";
const router = express.Router();

// Require the controller
import commentController from '../controllers/comments';

// Define the routes
router.get('/', (req, res) => {
    commentController.getAllComments(req, res)
});

router.get('/:id', (req, res) => {
    commentController.getCommentById(req, res)
});

router.get('/post/:postId', commentController.getCommentsByPostId);

router.post('/',  (req, res) => {
    commentController.createNewComment(req, res)
});

router.delete('/:commentId', (req, res) => {
    commentController.deleteComment(req, res)
});

router.put('/:commentId',  (req, res) => { 
    commentController.updateComment(req, res)
});

export default router;