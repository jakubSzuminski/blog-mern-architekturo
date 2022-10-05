const Post = require('../models/post');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

const getPosts = async (req, res) => {
    console.log('GET - get posts request received');
    
    const postsPerPage = 3;

    const query = new RegExp(req.query.search, 'i');
    const tags = req.query.tags.split(',');
    const page = req.query?.page;

    if(tags[0] == '') tags.splice(0, 1);

    let limit = postsPerPage;
    if(page) limit = postsPerPage * page;

    let posts = [];
    
    if(req.query.search != 'none' && tags.length > 0) posts = await Post.find({ $and: [ { $or: [{ title: query }, { description: query }] }, { tags: {$in: tags} } ] }).sort('-datePosted').limit(limit).select('-content');
    else if (req.query.search != 'none' && tags.length == 0) posts = await Post.find({$or: [{ title: query }, { description: query }]}).sort('-datePosted').limit(limit).select('-content');
    else if (req.query.search == 'none' && tags.length > 0) posts = await Post.find({ tags: {$in: tags} }).sort('-datePosted').limit(limit).select('-content');
    else if (req.query.search == 'none' && tags.length == 0) posts = await Post.find().sort('-datePosted').limit(limit).select('-content');

    return res.status(200).json(posts);
}   

const getPost = async (req, res) => {
    console.log('GET - get a post request received');

    const post = await Post.findOne({ slug: (req.params?.slug || 'none') });
    if(!post) return res.status(404).send('Nie znaleziono takiego posta');
    
    const comments = await Promise.all(post.comments.map(async (comment) => {
        let authorNickname = 'deleted';
        try {
            const author = await User.findById(comment.authorID);
            authorNickname = author.nickname;
        } catch(e) { authorNickname = 'deleted'};

        return ({
            id: comment._id,
            authorID: comment.authorID,
            author: authorNickname,
            content: comment.content,
            date: comment.datePosted,
        });
    }));

    const formattedPost = {
        _id: post._id,
        title: post.title,
        description: post.description,
        content: post.content,
        author: post.author,
        date: post.datePosted,
        tags: post.tags,
        image: post.image,
        slug: post.slug,
        comments
    }

    return res.status(200).json(formattedPost);
}

const getNumberOfPosts = async (req, res) => {
    console.log('GET - get number of posts request received');
    const num = await Post.countDocuments();
    res.status(200).json(num);
}

const addComment = async (req, res) => {
    console.log('POST - add comment request received');

    const token = req?.headers?.authorization?.split(' ')[1];
    if(!token) return res.status(401).send('Musisz się zalogować aby skomentować');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { slug, comment } = req.body;
        if(!comment) return res.status(400).send('Nie można dodać pustego komentarza');
        if(comment.length > 600) return res.status(400).send('Komentarz może mieć maksymalnie 600 znaków.');
    
        const post = await Post.findOne({ slug });
        if(!post) return res.status(404).send('Nie znaleziono posta');

        const newComment = { authorID: decoded._id, content: comment, datePosted: new Date() };

        if(post?.comments) await Post.findByIdAndUpdate(post._id, { comments: [...post.comments, newComment] });
        else await Post.findByIdAndUpdate(post._id, { comments: [newComment] });

        return res.status(200).send('Dodano komentarz');
    }
    catch(e) {
        console.log(e);
        return res.status(401).send('Błąd. Zaloguj się ponownie');
    }
}

const deleteComment = async (req, res) => {
    console.log('DELETE - deleting a comment request received');
    
    const postID = req.headers.postid;
    const commentID = req.headers.commentid;
    const token = req.headers.authorization.split(' ')[1];

    console.log(req.headers);
    console.log(token);

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const post = await Post.findByIdAndUpdate(postID, 
            { $pull: { comments: { _id: commentID, authorID: _id } } }
        );
        return res.status(200).send('Usunięto komentarz');
    }   
    catch(e) {
        console.log(e);
        console.log(e.message);
        return res.status(403).send('Zaloguj się ponownie.');
    }
}

module.exports = {
    getPosts,
    getPost,
    getNumberOfPosts,
    addComment,
    deleteComment,
}