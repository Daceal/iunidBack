const express = require('express');
const app = express();
const { checkToken } = require('../middlewares/authentication');

app.use(require('./user'));
app.use(require('./project'));

module.exports = app;