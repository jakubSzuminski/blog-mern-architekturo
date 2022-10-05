const express = require('express');
const router = express.Router();

const { authorize, addPost, editPost, deletePost } = require('../controllers/admin');

router.get('/authorize', authorize, (req, res) => { return res.status(200).send('Jesteś adminem') });
router.post('/create-post', authorize, addPost);
router.patch('/edit-post', authorize, editPost);
router.delete('/delete-post', authorize, deletePost);

module.exports = router;