import Comment from '../models/comments';
// import Post from '../models/posts';
import { Request, Response,  } from "express";

// Get all comments
const getAllComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find();
        
        // // If no comments are found, return a 404 error
        // if (comments.length === 0) {
        //     return res.status(404).send('No comments found.');
        // }

        res.status(200).send(comments);
    } catch (error) {
        res.status(400).send(error);
    }
};


// Get all comments for a specific post
const getCommentsByPostId = async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ postId });
        res.status(200).send(comments);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Create new comment
const createNewComment = async (req: Request, res: Response) => {
    const { postId, sender, content } = req.body;

    try {
        // Check if the post with the given postId exists
        // const post = await Post.findOne({ postId });

        // if (!post) {
        //     return res.status(404).send(`Post with postId ${postId} not found.`);
        // }

        const latestComment = await Comment.findOne().sort({ commentId: -1 });
        const nextCommentId = latestComment ? latestComment.commentId + 1 : 1;

        // Create the new comment
        const newComment = new Comment({ postId, sender, content, commentId: nextCommentId });
        await newComment.save();

        res.status(201).send(newComment);
    } catch (error) {
        res.status(400).send(error);
    }
};


// Update a comment
const updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { commentId },
            { content },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).send(`Comment with commentId ${commentId} not found.`);
        }

        res.status(200).send(updatedComment);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a comment
const deleteComment = async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    try {
        const result = await Comment.deleteOne({ commentId });
        if (result.deletedCount === 0) {
            return res.status(404).send('Comment not found');
        }
        res.status(200).send({ message: `Comment ${commentId} deleted successfully` });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get comment by ID
const getCommentById = async (req: Request, res: Response) => {
    const commentId = req.params.id;

    try {
        // Find the comment by its commentId
        const comment = await Comment.findOne({ commentId });

        if (!comment) {
            // If comment not found, return a 404 status
            return res.status(404).send(`Comment with commentId ${commentId} not found.`);
        }

        // Send the found comment in the response
        res.status(200).send(comment);
    } catch (error) {
        // Handle any errors that occur
        res.status(400).send(error);
    }
};


export default {
    getAllComments,
    createNewComment,
    deleteComment,
    getCommentsByPostId,
    updateComment,
    getCommentById
};