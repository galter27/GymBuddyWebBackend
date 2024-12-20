import express, {Express} from "express";
const app = express()
import dotenv from "dotenv";
dotenv.config();
const bodyParser = require("body-parser");
import mongoose from "mongoose";

// Database Connection
const mongodbConnection = mongoose.connection;
mongodbConnection.on("error", (error) => console.error(error));
mongodbConnection.once("open", () => console.log("Successfully Connected to Database"));

// Require Routes
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');


// App configuration
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Authors: Gabi Matatov 322404088 & Gal Ternovsky 323005512')
})

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

const initApp = () => {
  return new Promise<Express>(async (resolve, reject) => {
    await mongoose.connect(process.env.DB_CONNECTION || "mongodb://localhost:27017/Posts");
    resolve(app);
  });
}


export default initApp;