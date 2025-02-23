import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";

// Require Routes
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';
import authRoutes from './routes/auth_routes';
import fileRoutes from './routes/files_routes';
import chatRoutes from "./routes/chat_routes";
import likeRoutes from "./routes/likes_routes";

// CORS Configuration to allow specific origin
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Enable CORS
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
})

import path from 'path';

// Path to the 'front' directory where the built frontend files are stored 
const frontDir = path.join(__dirname, '../../front'); 
// Log the front directory path for debugging purposes 
console.log('Frontend directory:', frontDir); 
// Serve static files from the 'front' directory (where your React build is located) 
app.use('/', express.static(frontDir)); 
// Catch-all route to serve index.html for all frontend routes starting with '/ui' 
app.get('/ui/*', (req, res) => { res.sendFile(path.join(frontDir, 'index.html')); });


app.use('/public', express.static('public'));
app.use('/storage', express.static('storage'));
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);
app.use("/file", fileRoutes)
app.use("/chat", chatRoutes);
app.use("/likes", likeRoutes);

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:" + process.env.PORT, }, 
    { url: process.env.DOMAIN_BASE}],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// app.get('/', (req, res) => {
//   res.send('Authors: Gabi Matatov 322404088 & Gal Ternovsky 323005512')
// })

const initApp = async () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", (err) => {
      console.error(err);
    });
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });

    if (process.env.MONGO_URI === undefined) {
      //console.error("MONGO_URI is not set");
      reject();
    } else {
      mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("initApp finish");
        resolve(app);
      });
    }
  });
};

export default initApp;