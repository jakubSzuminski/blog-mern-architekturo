const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nickname: {
        type: String,
        default: '-'
    },
    email: {
        type: String,
        default: '-'
    },
    password: {
        type: String,
        default: '-'
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    saved: [String]
});

const User = mongoose.model('User', schema);
module.exports = User;