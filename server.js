const express = require('express');
const app = express();

require('dotenv').config();
require('./config/passport');
require('./startup/database')();
require('./startup/middleware')(app);
require('./startup/routes')(app);

if(process.env.NODE_ENV === 'production')
    require('./startup/production')(app);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
