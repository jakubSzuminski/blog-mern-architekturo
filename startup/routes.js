const setupRoutes = app => {
    const authRoutes = require('../routes/auth');
    const userRoutes = require('../routes/user');
    const postsRoutes = require('../routes/posts');
    const adminRoutes = require('../routes/admin');

    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/posts', postsRoutes);
    app.use('/api/admin', adminRoutes);
}

module.exports = setupRoutes;