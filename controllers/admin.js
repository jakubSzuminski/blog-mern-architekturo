const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authorize = async (req, res, next) => {
    console.log('-authorizing admin');
    const token = req.headers.authorization?.split(' ')[1] || '';

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(_id);
        
        if(user.email == process.env.ADMIN_EMAIL) next();
        else return res.status(401).send('Nie jesteś adminem');
    }
    catch(e) {
        console.log(e);
        return res.status(401).send('Nie masz uprawnień');
    }
}

const addPost = async (req, res) => {
    console.log('POST - adding a post request received');

    const slugPost = await Post.findOne({ slug: req.body.slug });
    if(slugPost) return res.status(400).send('Istnieje post z tym slugiem');

    try {
        const post = new Post({
            title: req.body?.title || 'Bez tytułu',
            description: req.body?.description || 'Bez opisu.',
            photo: req.body?.photo || '',
            datePosted: new Date(req.body?.date) || new Date(),
            author: req.body?.author || 'Martyna Białek',
            content: req.body?.content || 'Nie dodano treści.',
            slug: req.body?.slug || '',
            tags: req.body?.tags?.map(tag => tag.text) || []
        });

        await post.save();
        return res.status(200).send('Dodano post.');
    } 
    catch(e) {
        console.log(e);
        return res.status(500).send('Błąd serwera. Spróbuj ponownie później.');
    }
}

const editPost = async (req, res) => {
    console.log('POST - edit post request received');

    const post = await Post.findById(req.body.id);
    if(!post) return res.status(404).send('Nie znaleziono takiego posta');

    try {
        await Post.findByIdAndUpdate(req.body.id, {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags.map(tag => tag.text),
            slug: req.body.slug,
            image: req.body.image,
            datePosted: new Date(req.body.date),
            author: req.body.author || '',
            content: req.body.content
        });
    }
    catch(e) {
        console.log(e);
        return res.status(500).send('Nie udało sie zaktualizować postu. Spróbuj ponownie później.');
    }

    return res.status(200).send('Zaktualizowano post');
}

const deletePost = async (req, res) => {
    console.log('DELETE - delete a post request received');

    try {
        await Post.findByIdAndDelete(req.headers.postid);
    }
    catch(e) {
        console.log(e);
        return res.status(500).send('Nie można usunąć postu. Spróbuj ponownie później.');
    }

    return res.status(200).send('Usunięto post.');
}

module.exports = {
    authorize,
    addPost,
    editPost,
    deletePost
}