const express = require('express');
const router = express.Router();

// Require
const postConctoller = require('../controllers/posts');

router.get('/', postConctoller.getAllPosts);

router.get('/:postId', postConctoller.getPostByid);

router.post('/', postConctoller.createNewPost);

router.delete('/:postId', postConctoller.deletePost);

router.put('/:postId', postConctoller.updatePost);

module.exports = router;