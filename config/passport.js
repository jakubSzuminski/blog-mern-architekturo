const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, cb) => {
        const user = await User.findOne({ email });
        if(!user) return cb(null, false, { message: 'Brak konta z tym emailem.' });

        const result = await bcrypt.compare(password, user.password);
        if(!result) return cb(null, false, { message: 'Niepoprawne hasło.' });
        return cb(null, user, { message: 'Zalogowano.' });
    }
));
