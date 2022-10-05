const express = require('express');
const router = express.Router();

const { addToNewsletter } = require('../controllers/user');

router.post('/add-to-newsletter', addToNewsletter);

module.exports = router;