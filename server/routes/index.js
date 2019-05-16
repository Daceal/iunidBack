const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./project'));
app.use(require('./admin'));
app.use(require('./workRoom'));
app.use(require('./file'));
app.use(require('./fund'));
app.use(require('./paypal'));

module.exports = app;