import express from "express";
import { authMiddleware } from "../controllers/auth_controller";
import authController from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication (register, login, logout, refresh token, update user, google authntication)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *       properties:
 *         username:
 *           type: string
 *           description: The user unique username
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         avatar:
 *           type: string
 *           description: The user avatar url
 *       example:
 *         username: 'gabi17'
 *         email: 'gabi@gmail.com'
 *         password: 'password123'
 *         avatar: ''
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *            application/json:
 *             schema:
 *              $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/register", authController.register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       description: User login details (email and password)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "gabi@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 username:
 *                    type: string
 *                 avatr:
 *                    type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", authController.login);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Invalid Token
 *       500:
 *         description: Internal server error
 */
router.post("/logout", authController.logout);


/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token for the user
 *     tags: [Authentication]
 *     requestBody:
 *       description: Token refresh details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refreshToken:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 _id:
 *                   type: string
 *       400:
 *         description: Invalid refresh token
 *       403:
 *         description: Token expired or invalid
 *       500:
 *         description: Internal server error
 */
router.post("/refresh", authController.refresh);


/**
 * @swagger
 * /auth/user:
 *   put:
 *     summary: Update the user details
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User updated details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newUsername"
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: "/storage/newAvatar.jpg"

 *     responses:
 *       200:
 *         description: User updated successfully 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 avatar:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid inputs
 *       500:
 *         description: Internal server error
 */

router.put("/user", authMiddleware, authController.updateUser);


/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate or register a user using Google Sign-In
 *     tags: [Authentication]
 *     requestBody:
 *       description: Google OAuth credential token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: The Google OAuth ID token
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refreshToken:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatar:
 *                   type: string
 *       400:
 *         description: Google token verification failed or missing configuration
 *       500:
 *         description: Internal server error
 */
router.post("/google", authController.googleSignIn);

export default router;
