const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./project'));
app.use(require('./viewsRoutes'));

module.exports = app;