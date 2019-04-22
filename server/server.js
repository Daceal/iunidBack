require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
var fs = require('fs');

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
server = app.listen(process.env.PORT, () => {
    console.log(`Port: ${process.env.PORT}`);
});

const io = require("socket.io")(server);
var siofu = require("socketio-file-upload");

io.on('connection', function(socket) {
    var obj = [{}];
    fs.readFile('input.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            socket.emit('messages', obj);
        }
    });

    var uploader = new siofu();
    uploader.dir = "uploads";
    uploader.listen(socket);

    uploader.on("saved", function(event) {
        console.log(event.file);
    });

    socket.on('chat message', function(msg) {
        obj.push({ author: "Anon", text: msg })
        var json = JSON.stringify(obj);

        fs.writeFile("input.json", json, function(err) {
            if (err) throw err;
            console.log('complete');
        });
        io.emit('chat message', msg);
    });


    socket.on('disconnect', function() {});
});