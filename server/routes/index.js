const express = require('express');
const app = express();
const { checkToken } = require('../middlewares/authentication');

app.use(require('./user'));
app.use(require('./project'));
app.use(require('./admin'));
app.use(require('./chat'));
app.use(require('./file'));
app.use(require('./fund'));
app.use(require('./paypal'));

module.exports = app;