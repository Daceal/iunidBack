const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const User = require('../models/user');
const Company = require('../models/company');
const path = require('path');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const app = express();



// =======================================
// USERS LOGIN
// =======================================


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password incorrect'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password incorrect'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.tokenExpiration });

        res.json({
            ok: true,
            userDB
        });
    })

});


// =======================================
// USERS REGISTERS
// =======================================


app.get('/register', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the register page'
    });
});

app.post('/registerUser', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {
            return res.status(404).json({
                ok: false,
                err: 'The email is already registered'
            });
        }

        if (!userDB) {
            let user = new User({
                email: body.email,
                name: body.name,
                skills: body.skills,
                courses: body.courses,
                certificates: body.certificates,
                password: bcrypt.hashSync(body.password, 10)
            });

            user.save((err, userDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    user: userDB
                });
            });
        }
    });
});

app.post('/registerCompany', (req, res) => {

    let body = req.body;

    Company.findOne({ email: body.email }, (err, companyDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (companyDB) {
            return res.status(404).json({
                ok: false,
                err: 'The email is already registered'
            });
        }

        if (!cif) {
            return res.json({
                ok: false,
                err: {
                    message: 'The cif is empty'
                }
            });
        }

        if (!contactEmail) {
            return res.json({
                ok: false,
                err: {
                    message: 'The contactEmail is empty'
                }
            });
        }

        if (!companyDB) {
            let company = new Company({
                email: body.email,
                name: body.name,
                cif: body.cif,
                description: body.description,
                img: body.img,
                contactEmail: body.contactEmail,
                password: bcrypt.hashSync(body.password, 10)
            });

            company.save((err, companyDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //res.sendFile(path.join(__dirname, '../views', 'dashboard.html'));
                res.json({
                    ok: true,
                    company: companyDB
                });
            });
        }
    });
});

// =======================================
// COMPANY METHODS
// =======================================


app.get('/obtainContacts/:id', (req, res) => {
    let id = req.params.id;

    Company.findById(id, 'contacts', (err, company) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!company) {
            return res.status(500).json({
                ok: false,
                err: 'The company dont exists'
            });
        }

        res.json({
            ok: true,
            company
        });
    });
});


// =======================================
// USERS METHODS
// =======================================

app.get('/getUser/:id', (req, res) => {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user
        });
    });
});


app.get('/getCertificates/:id', (req, res) => {
    var id = req.params.id;
    User.find({ _id: id }).select("certificates")
        .populate()
        .exec((err, userCertificates) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                userCertificates
            });
        })
});


app.get('/getCourses/:id', (req, res) => {
    var id = req.params.id;
    User.find({ _id: id }).select("courses")
        .populate()
        .exec((err, userCourses) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                userCourses
            });
        })
});

module.exports = app;