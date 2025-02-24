import express from "express";
import multer from "multer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();

// Set a default value if DOMAIN_BASE is not defined
const base = process.env.DOMAIN_BASE;
console.log(base);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean)
            .slice(1)
            .join('.');
        cb(null, `${Date.now()}.${ext}`);
    },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   - name: File Upload
 *     description: Operations related to file uploads
 */

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file to the server
 *     description: This endpoint allows users to upload a single file to the server.
 *     tags: [File Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       description: File to be uploaded
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The URL of the uploaded file
 *       400:
 *         description: No file uploaded or invalid file format
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.single("file"), function (req, res) {
    if (!req.file) {
        res.status(400).send({ error: "No file uploaded" });
        return;
    }

    const fileUrl = `${base}/storage/${req.file.filename}`;
    console.log(`File uploaded: ${fileUrl}`);

    res.status(200).send({ url: fileUrl });
});

export default router;
