const express = require('express');
const router = express.Router();

const { getPosts, getPost, getNumberOfPosts, addComment, deleteComment } = require('../controllers/posts');

router.get('/get-posts', getPosts);
router.get('/get-post/:slug', getPost);
router.get('/get-number-of-posts', getNumberOfPosts);

router.post('/add-comment', addComment);
router.delete('/delete-comment', deleteComment);


module.exports = router;