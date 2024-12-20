import Post from "../models/posts"
import { Request, Response,  } from "express";

// Get all posts
const getAllPosts = async (req: Request, res: Response) => {
    const sender = req.query.sender;
    try {
        if (sender) {
            const postsBySender = await Post.find({ sender: sender });
            res.status(200).send(postsBySender);
        } else {
            const posts = await Post.find();
            res.status(200).send(posts);
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

// Create a new post
const createNewPost = async (req: Request, res: Response) => {
    const post = req.body;
    try {
        const latestPost = await Post.findOne().sort({ postId: -1 });
        const nextPostId = latestPost ? latestPost.postId + 1 : 1;
        post.postId = nextPostId;

        // Create and save the new post
        const newPost = await Post.create(post);
        res.status(201).send(newPost);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a post
const deletePost = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
        const result = await Post.deleteOne({ postId: postId });
        if (result.deletedCount === 0) {
            return res.status(404).send('Post not found');
        }
        res.status(200).send({ message: `Post ${postId} deleted successfully` });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get post by id
const getPostByid = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
        const postById = await Post.find({ postId: postId });
        if (postById.length == 0) {
            return res.status(404).send("Post not found");
        } else {
            res.status(200).send(postById);
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update a post
const updatePost = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const newContent = req.body.content;

    try {
        // Find the post by postId and update its content
        const updatedPost = await Post.findOneAndUpdate(
            { postId },
            { content: newContent },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).send(`Post with postId ${postId} not found.`);
        }

        res.status(200).send(updatedPost);
    } catch (error) {
        res.status(400).send(error);
    }
};

export default {
    getAllPosts,
    createNewPost,
    deletePost,
    getPostByid,
    updatePost
};