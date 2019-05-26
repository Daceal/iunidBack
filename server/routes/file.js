const express = require('express');
const InternalProject = require('../models/internalProject');
const multer = require('multer');
const User = require('../models/user');
const Company = require('../models/company');
const ChatConversation = require('../models/chatConversation');
const app = express();
const { io } = require('../server');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/images')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + ' - ' + file.originalname)
    }
})

var upload = multer({ storage: storage })

app.post('/uploadImage', upload.single('image'), (req, res, next) => {
    const file = req.file
    let email = req.body.email;
    let image = req.file.filename;
    User.findOneAndUpdate({ email: email }, { img: image }, (err, userDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            Company.findOneAndUpdate({ email: email }, { img: image }, (err, companyDB) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }
            });
        }
    });

    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    return res.json({
        ok: true,
        message: 'Subido correctamente'
    });
});


var storageChat = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/filesChat')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + ' - ' + file.originalname)
    }
})

var uploadFile = multer({ storage: storageChat })

app.post('/uploadFileChat', uploadFile.single('myFile'), (req, res, next) => {
    const file = req.file
    let email = req.body.email;
    let fileChat = req.file.filename;
    ChatConversation.findOneAndUpdate({ owner: email }, { $push: { deliveries: fileChat } }, (err, chatConversationDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
    });

    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    io.emit('chatDelivery', fileChat);

    res.json({
        ok: true,
        message: 'Subido correctamente'
    });
});


var storageFiles = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/files')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + ' - ' + file.originalname)
    }
})

var uploadFile = multer({ storage: storageFiles })

app.post('/uploadFile', uploadFile.single('myFile'), (req, res, next) => {
    const file = req.file
    let id = req.body.id;
    let fileProject = req.file.filename;
    InternalProject.findOneAndUpdate({ _id: id }, { $push: { files: fileProject } }, (err, projectDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
    });

    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    return res.json({
        ok: true,
        message: 'Subido correctamente'
    });
});


module.exports = app;