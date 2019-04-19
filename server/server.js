require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Necessary in order to allow the front to make calls to the back
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Accept, token');
    next();
});

// parse application/json
app.use(bodyParser.json());

// public folder
app.use(express.static(path.resolve(__dirname, '../public')));

// global configurations of routes
app.use(require('./routes/index'));

// Database connection
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Database ONLINE');
});

// Api listener port
app.listen(process.env.PORT, () => {
    console.log(`Port: ${process.env.PORT}`);
});