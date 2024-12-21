import express, {Express} from "express";
const app = express()
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import mongoose from "mongoose";

// Require Routes
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';

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
      console.error("MONGO_URI is not set");
      reject();
    } else {
      mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("initApp finish");

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use("/posts", postsRoutes);
        app.use("/comments", commentsRoutes);

        app.get("/about", (req, res) => {
          res.send("About page");
        });
        resolve(app);
      });
    }
  });
};



export default initApp;