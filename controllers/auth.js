const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const { generateUserToken } = require('./user');

const login = (req, res) => {
    console.log('POST - login request received.');

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if(err || !user) return res.status(400).json({ message: 'Email lub hasło niepoprawne' }).end();

        const token = generateUserToken(user);
        return res.status(200).json(token).end();
    })(req, res);
}

const register = async (req, res) => {
    console.log('POST - register request received.');

    const { nickname, email, password, passwordConfirm } = req.body;

    if(password != passwordConfirm) return res.status(405).json({ message: 'Hasła nie zgadzają się.' });

    const userByUsername = await User.findOne({ nickname });
    if(userByUsername) return res.status(409).json({ message: 'Istnieje już użytkownik z tym loginem.' });

    const user = await User.findOne({ email });
    if(user) {
        if(user.password != '-') return res.status(409).json({ message: 'Istnieje już użytkownik z tym adresem email.' });
        
        bcrypt.hash(password, 12, async (err, hash) => {
            if(err) console.error(err.message);
            await User.findByIdAndUpdate(user._id, { nickname, password: hash });
        });
    } else {
        bcrypt.hash(password, 12, async (err, hash) => {
            if(err) console.error(err.message);
            const newUser = new User({ nickname, email, password: hash });
            await newUser.save();
        });
    }

    return res.status(200).send('Zarejestrowano pomyślnie.').end();
}

module.exports = {
    login,
    register
}