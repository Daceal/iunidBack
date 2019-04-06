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
            Company.findOne({ email: body.email }, (err, companyDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!companyDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'User or password incorrect'
                        }
                    });
                }

                if (!bcrypt.compareSync(body.password, companyDB.password)) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'User or password incorrect'
                        }
                    });
                }

                let token = jwt.sign({
                    company: companyDB
                }, process.env.SEED, { expiresIn: process.env.tokenExpiration });

                return res.json({
                    ok: true,
                    companyDB,
                    token
                });
            });
        }
        console.log('Password', body.password, userDB.password);
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
            userDB,
            token
        });
    });
});


// =======================================
// USERS REGISTERS
// =======================================


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
        } else {
            Company.findOne({ email: body.email }, (err, check) => {
                if (!check) {
                    let user = new User({
                        email: body.email,
                        name: body.name,
                        skills: body.skills,
                        courses: body.courses,
                        description: body.description,
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
                } else {
                    res.json({
                        ok: false,
                        err: 'The email must be unique'
                    });
                }
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

        if (!body.cif) {
            return res.status(404).json({
                ok: false,
                err: 'The cif is empty'
            });
        }

        if (!body.contactEmail) {
            return res.status(404).json({
                ok: false,
                err: 'The contact email is empty'
            });
        }

        if (companyDB) {
            return res.status(404).json({
                ok: false,
                err: 'The email is already registered'
            });
        } else {
            User.findOne({ email: body.email }, (err, check) => {
                if (!check) {
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

                        res.json({
                            ok: true,
                            company: companyDB
                        });
                    });
                } else {
                    res.json({
                        ok: false,
                        err: 'The email must be unique'
                    });
                }
            });
        }
    });
});

// =======================================
// COMPANY METHODS
// =======================================


app.post('/obtainContacts', (req, res) => {
    let email = req.body.email;

    Company.findOne(email, 'contacts', (err, company) => {
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

app.post('/getCompany', checkToken, (req, res) => {
    var email = req.body.email;

    Company.findOne({ email: email }, 'name email contactEmail description score img contacts', function(err, company) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!company) {
            return res.status(403).json({
                ok: false,
                err: 'The email is invalid'
            });
        }

        res.json({
            ok: true,
            company
        });
    });
});

app.post('/getUser', checkToken, (req, res) => {
    var email = req.body.email;

    User.findOne({ email: email }, 'name email description score skills curses certificates img', function(err, user) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!user) {
            return res.status(403).json({
                ok: false,
                err: 'The email is invalid'
            });
        }

        res.json({
            ok: true,
            user
        });
    });
});

module.exports = app;