import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: Number, 
        required: true,
        ref: 'Posts'
    },
    sender: {
        type: String, 
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    commentId: {
        type: Number, 
        required: true, 
        unique: true
    }
});

const Comment = mongoose.model('comments', commentSchema);

export default Comment;