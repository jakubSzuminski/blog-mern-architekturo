const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    content: String,
    author: {
        type: String,
        default: ''
    }, 
    datePosted: Date,
    tags: {
        type: [String],
        default: []
    },
    comments: {
        type: [{
            authorID: String,
            content: String,
            datePosted: Date
        }],
        default: []
    },
    slug: {
        type: String,
        default: 'none',
        unique: true
    }
});

const Post = mongoose.model('Post', schema);
module.exports = Post;

