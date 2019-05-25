const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const Fund = require('../models/fund');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const Company = require('../models/company');
const app = express();

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

app.post('/uploadfile', upload.single('image'), (req, res, next) => {
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


module.exports = app;