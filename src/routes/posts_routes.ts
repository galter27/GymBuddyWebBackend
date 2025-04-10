import express from "express";
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all posts, optionally filtered by owner
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: owner
 *         required: false
 *         description: The owner's id of the posts to filter by. If provided, it filters posts by owner.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts
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
 *                   title:
 *                     type: string
 *                     example: "Post Title"
 *                   content:
 *                     type: string
 *                     example: "Post Content"
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
router.get("/", postsController.getAll.bind(postsController));


/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The post was found and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "648a3d2f12c8c9e3f4b12345"
 *                 title:
 *                   type: string
 *                   example: "Post Title"
 *                 content:
 *                   type: string
 *                   example: "Post Content"
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
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Object not found"
 */
router.get("/:id", postsController.getById.bind(postsController));


/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Post data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Post Title"
 *               content:
 *                 type: string
 *                 example: "Post Content"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "648a3d2f12c8c9e3f4b12345"
 *                 title:
 *                   type: string
 *                   example: "Post Title"
 *                 content:
 *                   type: string
 *                   example: "Post Content"
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
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, postsController.create.bind(postsController));


/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update an existing post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated post data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 example: "Updated content of the post."
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "648a3d2f12c8c9e3f4b12345"
 *                 title:
 *                   type: string
 *                   example: "Updated Post Title"
 *                 content:
 *                   type: string
 *                   example: "Updated content of the post."
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
 *         description: Post not found
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
router.put("/:id", authMiddleware, postsController.update.bind(postsController));


/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
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
 *         description: Post not found
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
router.delete("/:id", authMiddleware, postsController.delete.bind(postsController));


/**
 * @swagger
 * /posts/update/{owner}:
 *   put:
 *     summary: Update all posts by a specific owner
 *     description: Updates the username in all posts when a user changes their username.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post owner whose username needs to be updated
 *     requestBody:
 *       description: New username to update in all posts
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username to be set in all posts
 *     responses:
 *       200:
 *         description: Posts updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Posts updated"
 *                 matchedCount:
 *                   type: integer
 *                   description: Number of posts that matched the owner ID
 *                 modifiedCount:
 *                   type: integer
 *                   description: Number of posts that were updated
 *       400:
 *         description: Bad request (missing username or update error)
 *       401:
 *         description: Unauthorized, invalid or missing Access Token
 *       500:
 *         description: Internal server error
 */
router.put("/update/:owner", authMiddleware, postsController.updateManyByOwner.bind(postsController));

export default router;
