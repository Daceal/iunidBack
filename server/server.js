require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// public folder
app.use(express.static(path.resolve(__dirname, '../public')));

// global configurations of routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Database ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Port: ${process.env.PORT}`);
});