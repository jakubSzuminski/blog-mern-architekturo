const express = require('express');
const path = require('path');
const sslRedirect = require('heroku-ssl-redirect').default;

const createProductionSetup = (app) => {
    app.use(sslRedirect());

    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

module.exports = createProductionSetup;