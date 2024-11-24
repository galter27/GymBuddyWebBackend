const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    sender: {
        type: String, 
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    content: String,
    postId: {
        type: Number,
        required: true,
        unique: true,
    },
});


const Post = mongoose.model("posts", postSchema);

module.exports = Post;