require('./config/config');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const siofu = require("socketio-file-upload");
const app = express().use(siofu.router);
let server = http.createServer(app);
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
// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/chat');

// global configurations of routes
app.use(require('./routes/index'));

// Database connection
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Database ONLINE');
});

// Api listener port
server.listen(process.env.PORT, () => {
    console.log(`Port: ${process.env.PORT}`);
});