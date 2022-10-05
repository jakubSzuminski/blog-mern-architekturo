const mongoose = require('mongoose');

const setupDatabase = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(e => console.error(e));
}

module.exports = setupDatabase;

