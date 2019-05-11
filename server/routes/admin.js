const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Company = require('../models/company');
const InternalProject = require('../models/internalProject');
const Admin = require('../models/admin');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const app = express();

/**
 * Method name:
 *      getUsers
 * 
 * The method find all the users in iUnid.
 */

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

/**
 * Method name:
 *      newUser
 * 
 * The method create a new user depending of the userType: admin, editor, company or user.
 */

app.post('/newUser', [checkToken, checkAdmin_Role], (req, res) => {

    let body = req.body;

    if (body.newUserType === 'USER_ROLE') {
        let user = new User({
            name: body.name,
            email: body.userEmail,
            state: body.state,
            description: body.description,
            phone: body.phone,
            password: bcrypt.hashSync(body.password, 10),
            skills: body.skills,
            courses: body.courses,
            certificates: body.certificates,
            img: body.img,
            userType: body.newUserType
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
    } else if (body.newUserType === 'COMPANY_ROLE') {
        let company = new Company({
            name: body.name,
            email: body.userEmail,
            contactEmail: body.contactEmail,
            state: body.state,
            description: body.description,
            password: bcrypt.hashSync(body.password, 10),
            img: body.img,
            userType: body.newUserType,
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
        let admin = new User({
            name: 'Admin admin',
            email: body.userEmail,
            password: bcrypt.hashSync(body.password, 10),
            userType: body.newUserType
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

/**
 * Method name:
 *      editUserAdmin
 * 
 * The method edit a user by the email.
 */

app.put('/editUserAdmin', [checkToken, checkAdmin_Role], (req, res) => {
    let body = req.body;
    let user = {
        name: body.name,
        phone: body.phone,
        description: body.description,
        img: body.img,
        skills: body.skills,
        courses: body.courses,
        certificates: body.certificates
    }

    User.findOne({ email: body.userEmail }, (err, check) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (check) {
            User.findOneAndUpdate({ email: body.userEmail }, user, { new: true, runValidators: true }, (err, userDB) => {
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
                    message: 'The email doesn´t exists'
                }
            });
        }
    });

});

/**
 * Method name:
 *      editCompanyAdmin
 * 
 * The method edit a company by the email.
 */

app.put('/editCompanyAdmin', [checkToken, checkAdmin_Role], (req, res) => {
    let body = req.body;
    let company = {
        name: body.name,
        img: body.img,
        description: body.description,
        contactEmail: body.contactEmail
    }

    Company.findOne({ email: body.userEmail }, (err, check) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (check) {
            Company.findOneAndUpdate({ email: body.userEmail }, company, { new: true, runValidators: true }, (err, companyDB) => {
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
                    message: 'The email doesn´t exists'
                }
            });
        }
    });

});

/**
 * Method name:
 *      removeAccount
 * 
 * The method delete the account of the user/company by email.
 */

app.post('/removeAccount', [checkToken, checkAdmin_Role], (req, res) => {
    let emailAccount = req.body.userEmail;

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