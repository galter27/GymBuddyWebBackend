import express from "express";
import multer from "multer";

const router = express.Router();

// Set a default value if DOMAIN_BASE is not defined
const base = process.env.DOMAIN_BASE || 'http://localhost:3000';

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

// Route to handle file uploads
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
