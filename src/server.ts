import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// Require Routes
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';
import authRoutes from './routes/auth_routes';
import fileRoutes from './routes/files_routes';

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
})
app.use('/public', express.static('public'));
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);
app.use("/file", fileRoutes)

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:3000", },],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.get('/', (req, res) => {
  res.send('Authors: Gabi Matatov 322404088 & Gal Ternovsky 323005512')
})

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