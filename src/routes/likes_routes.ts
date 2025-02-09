import express from "express";
import likesController from "../controllers/likes_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API for managing likes
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Add a like to a post
 *     description: Creates a like for a post by the authenticated user and increments the likes count for the post.
 *     tags: [Likes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The ID of the post to be liked by the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to be liked
 *     responses:
 *       201:
 *         description: Like added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created like
 *                 postId:
 *                   type: string
 *                   description: The ID of the post that was liked
 *                 owner:
 *                   type: string
 *                   description: The ID of the user who liked the post
 *       400:
 *         description: Invalid data or unauthorized request
 *       401:
 *         description: Unauthorized, missing or invalid Access Token
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, likesController.createLike);


/**
 * @swagger
 * /likes/{postId}:
 *   delete:
 *     summary: Remove a like from a post
 *     description: Removes a like from a specific post and decrements the likes count for that post.
 *     tags: [Likes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to remove the like from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like deleted successfully
 *       400:
 *         description: Invalid data or unauthorized request
 *       404:
 *         description: Like not found or unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:postId", authMiddleware, likesController.deleteLike);


/**
 * @swagger
 * /likes/{postId}/{userId}:
 *   get:
 *     summary: Check if a user has liked a specific post
 *     description: Verifies if a user has liked a particular post by checking if a like record exists.
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to check the like status for
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to check if they have liked the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like status for the user on the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                   description: Whether the user has liked the post
 *       500:
 *         description: Internal server error
 */
router.get("/:postId/:userId", likesController.getLikeByOwner);

export default router;
