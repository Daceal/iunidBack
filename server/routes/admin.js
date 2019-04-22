const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const Company = require('../models/company');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const app = express();


app.post('/getUsers', [checkToken, checkAdmin_Role], (req, res) => {
    User.find({ state: true }, (err, usersDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Company.find({ state: true }, (err, companiesDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                usersDB,
                companiesDB
            });
        });
    });
});

app.post('/newUser', (req, res) => {

    let body = req.body;

    if (body.userType === 'USER_ROLE') {
        let user = new User({
            name: body.name,
            email: body.email,
            state: body.state,
            description: body.description,
            phone: body.phone,
            password: bcrypt.hashSync(body.password, 10),
            skills: body.skills,
            courses: body.courses,
            certificates: body.certificates,
            img: body.img,
            userType: body.userType
        });

        user.save((err, userDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                user: userDB
            });
        });
    } else if (body.userType === 'COMPANY_ROLE') {
        let company = new Company({
            name: body.name,
            email: body.email,
            contactEmail: body.contactEmail,
            state: body.state,
            description: body.description,
            phone: body.phone,
            password: bcrypt.hashSync(body.password, 10),
            img: body.img,
            userType: body.userType,
            cif: body.cif
        });

        company.save((err, companyDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                company: companyDB
            });
        });
    } else {
        let admin = new Admin({
            name: body.name,
            userType: body.userType
        });

        admin.save((err, adminDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                admin: adminDB
            });
        });
    }
});

app.put('/editUser', checkToken, (req, res) => {

    let id = req.body.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'description', 'phone', 'skills', 'courses', 'certificates']);

    User.findOne({ email: req.body.email }, (err, check) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (check) {
            if (check.id === id) {
                User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
                    if (err) {
                        return res.json({
                            ok: false,
                            err
                        });
                    }

                    return res.json({
                        ok: true,
                        user: userDB
                    });
                });
            } else {
                return res.json({
                    ok: false,
                    err: {
                        message: 'The email exists'
                    }
                });
            }
        } else {
            User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    user: userDB
                });
            });
        }
    });

});

app.put('/editCompany', checkToken, (req, res) => {

    let id = req.body.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'description']);

    Company.findOne({ email: req.body.email }, (err, check) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (check) {
            if (check.id === id) {
                Company.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, companyDB) => {
                    if (err) {
                        return res.json({
                            ok: false,
                            err
                        });
                    }

                    return res.json({
                        ok: true,
                        company: companyDB
                    });
                });
            } else {
                return res.json({
                    ok: false,
                    err: {
                        message: 'The email exists'
                    }
                });
            }
        } else {
            Company.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, companyDB) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    company: companyDB
                });
            });
        }
    });

});

app.delete('/removeAccount', (req, res) => {
    let emailAccount = req.body.email;

    User.findOneAndRemove({ email: emailAccount }, (err, deletedUser) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (deletedUser) {
            InternalProject.countDocuments({ userOwner: emailAccount }, (err, count) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                if (count === 0) {
                    return res.json({
                        ok: true,
                        deletedUser,
                        count
                    });
                } else {
                    for (let i = 1; i <= count; i++) {
                        InternalProject.findOneAndRemove({ userOwner: emailAccount }, (err, totalProjects) => {
                            if (err) {
                                return res.json({
                                    ok: false,
                                    err
                                });
                            }
                        });
                    }

                    return res.json({
                        ok: true,
                        deletedUser,
                        count
                    });
                }
            });

        } else {
            Company.findOneAndRemove({ email: emailAccount }, (err, deletedCompany) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                InternalProject.countDocuments({ userOwner: emailAccount }, (err, count) => {
                    if (err) {
                        return res.json({
                            ok: false,
                            err
                        });
                    }

                    if (count === 0) {
                        return res.json({
                            ok: true,
                            deletedCompany,
                            count
                        });
                    } else {
                        for (let j = 1; j <= count; j++) {
                            InternalProject.findOneAndRemove({ userOwner: emailAccount }, (err, totalProjects) => {
                                if (err) {
                                    return res.json({
                                        ok: false,
                                        err
                                    });
                                }
                            });
                        }

                        return res.json({
                            ok: true,
                            deletedCompany,
                            count
                        });
                    }

                });

            });
        }
    });
});

module.exports = app;