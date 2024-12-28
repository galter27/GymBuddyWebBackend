import express from "express";
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Retrieve all comments, optionally filtered by owner
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: owner
 *         required: false
 *         description: The owner's id of the comments to filter by. If provided, it filters comments by owner.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "648a3d2f12c8c9e3f4b12345"
 *                   comment:
 *                     type: string
 *                     example: "Comment Contect"
 *                   postId:
 *                     type: string
 *                     example: "676ea6193d8018b93f34f79b"
 *                   owner:
 *                     type: string
 *                     example: "676e9654813376525e018747"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters."
 */
router.get("/", commentsController.getAll.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The comment was found and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "648a3d2f12c8c9e3f4b12345"
 *                 comment:
 *                   type: string
 *                   example: "Comment Contect"
 *                 postId:
 *                   type: string
 *                   example: "676ea6193d8018b93f34f79b"
 *                 owner:
 *                   type: string
 *                   example: "676e9654813376525e018747"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters."
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Object not found"
 */
router.get("/:id", commentsController.getById.bind(commentsController));

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get all comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to get comments for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "648a3d2f12c8c9e3f4b12345"
 *                   comment:
 *                     type: string
 *                     example: "Comment Contect"
 *                   postId:
 *                     type: string
 *                     example: "676ea6193d8018b93f34f79b"
 *                   owner:
 *                     type: string
 *                     example: "676e9654813376525e018747"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters."
 *       404:
 *         description: Post not found or no comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No comments found for this post"
 */
router.get("/post/:postId", commentsController.getByPostId.bind(commentsController));

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Comment data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - postId
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Comment Content."
 *               postId:
 *                 type: string
 *                 example: "676ea6193d8018b93f34f79b"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "648a3d2f12c8c9e3f4b12345"
 *                 comment:
 *                   type: string
 *                   example: "Comment Contect"
 *                 postId:
 *                   type: string
 *                   example: "676ea6193d8018b93f34f79b"
 *                 owner:
 *                   type: string
 *                   example: "676e9654813376525e018747"
 *       400:
 *         description: Invalid inputs
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       404:
 *         description: PostID not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, commentsController.create.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update an existing comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated comment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Updated comment text."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "648a3d2f12c8c9e3f4b12345"
 *                 comment:
 *                   type: string
 *                   example: "Comment Contect"
 *                 postId:
 *                   type: string
 *                   example: "676ea6193d8018b93f34f79b"
 *                 owner:
 *                   type: string
 *                   example: "676e9654813376525e018747"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Object not found"
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware, commentsController.update.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Object deleted successfully"
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Object not found"
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, commentsController.delete.bind(commentsController));

export default router;
