const jwt = require('jsonwebtoken');
const validator = require('email-validator');
const User = require('../models/user');

const generateUserToken = user => {
    try {
        const token = jwt.sign({
            _id: user._id,
            nickname: user.nickname,
            email: user.email,
            newsletter: user.newsletter
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        return token;
    }
    catch(e) {
        console.log('Token generation failed - ', e);
        return null;
    }
}

const addToNewsletter = async (req, res) => {
    console.log('POST - newsletter addition request received');

    const user = await User.findOne({ email: req.body?.email });
    if(user) await User.findByIdAndUpdate(user._id, { newsletter: true });
    else {
        if(!validator.validate(req.body.email)) return res.status(400).send('Niepoprawny email');

        const newUser = new User();
        newUser.email = req.body.email;
        newUser.newsletter = true;
        newUser.save();

        //todo: add to mailchimp list
    }

    return res.status(200).send('Dodano do newslettera');
}

module.exports = {
    generateUserToken,
    addToNewsletter
}