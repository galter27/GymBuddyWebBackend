import express from "express";
import chatController from "../controllers/chat_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: GymBuddyChat
 *   description: API for Chating with GymBuddy AI about fitness and gym topics
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Create a new chat message
 *     description: API for chatting with GymBuddy AI about fitness and gym topics
 *     tags: [GymBuddyChat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Chat message details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - username
 *             properties:
 *               content:
 *                 type: string
 *                 description: The message content
 *               username:
 *                 type: string
 *                 description: The username of the sender
 *     responses:
 *       201:
 *         description: Chat message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: AI-generated response to the message
 *       400:
 *         description: Missing required fields (content or username)
 *       401:
 *         description: Unauthorized, invalid or missing Access Token
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, chatController.create.bind(chatController));

export default router;