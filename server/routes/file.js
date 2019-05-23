const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const Fund = require('../models/fund');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const multer = require('multer');
const path = require('path');
const app = express();

// SET STORAGE
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    let email = req.body.email;
    let image = req.file.filename;
    console.log(image);
    User.findOneAndUpdate({ email: email }, { img: image }, (err, userDB) => {
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

    res.json({
        ok: true,
        message: 'Subido correctamente'
    });
});


module.exports = app;