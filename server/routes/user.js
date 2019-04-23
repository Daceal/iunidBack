const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const User = require('../models/user');
const Company = require('../models/company');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const { checkToken } = require('../middlewares/authentication');
const app = express();


/**
 * Method name: 
 *      Login
 * 
 * Received parameters: 
 *      email and password.
 * 
 * This method log an user or a company as follows:
 * 
 * The method compare if the email received is on the user or company table.
 * 
 * Then compare the state of the account, if it´s false automatically stops the method and return a false
 * because that´s mean the account is inactive.
 * 
 * After that it is compared the received password is the same that the user in the table
 * 
 * Finally the method create a token for that user session.
 * 
 */

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (userDB) {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            if (!userDB.state) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'This account dont exists or is inactive'
                    }
                });
            }

            if (!bcrypt.compareSync(body.password, userDB.password)) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'User or password incorrect'
                    }
                });
            }

            let token = jwt.sign({
                user: {
                    id: userDB._id,
                    email: userDB.email,
                    password: userDB.password
                }
            }, process.env.SEED, { expiresIn: process.env.tokenExpiration });

            return res.json({
                ok: true,
                userDB,
                token
            });

        } else {

            Company.findOne({ email: body.email }, (err, companyDB) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                if (!companyDB.state) {
                    return res.json({
                        ok: false,
                        err: {
                            message: 'This account dont exists or is inactive'
                        }
                    });
                }

                if (!companyDB) {
                    return res.json({
                        ok: false,
                        err: {
                            message: 'User or password incorrect'
                        }
                    });
                }

                if (!bcrypt.compareSync(body.password, companyDB.password)) {
                    return res.json({
                        ok: false,
                        err: {
                            message: 'User or password incorrect'
                        }
                    });
                }

                let token = jwt.sign({
                    company: {
                        id: companyDB._id,
                        email: companyDB.email,
                        password: companyDB.password
                    }
                }, process.env.SEED, { expiresIn: process.env.tokenExpiration });

                return res.json({
                    ok: true,
                    companyDB,
                    token
                });
            });
        }
    });
});


/**
 * Method name:
 *      registerUser
 * 
 * Received parameters:
 *      email, password, name, img, description, skills, courses and certificates
 * 
 * The method find the email received and search for coincidences in the user and company tables
 * because the email must be unique in the web site.
 * 
 * If there is not an email the method set the other parameters and encrypt the password.
 * 
 * Finally the user is saved in the database.
 * 
 */

app.post('/registerUser', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (userDB) {
            return res.json({
                ok: false,
                err: 'The email is already registered'
            });
        } else {
            Company.findOne({ email: body.email }, (err, check) => {

                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                if (!check) {
                    let user = new User({
                        name: body.name,
                        email: body.email,
                        description: body.description,
                        phone: body.phone,
                        password: bcrypt.hashSync(body.password, 10),
                        skills: body.skills,
                        courses: body.courses,
                        certificates: body.certificates,
                        img: body.img
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
                } else {
                    return res.json({
                        ok: false,
                        err: 'The email must be unique'
                    });
                }
            });
        }
    });
});

/**
 * Method name:
 *      registerCompany
 * 
 * Received parameters:
 *      email, name, cif, description, img, contactEmail and password
 *      
 * The method find the email received and search for coincidences in the user and company tables
 * because the email must be unique in the web site.
 * 
 * If there is not an email the method set the other parameters and encrypt the password.
 * 
 * Finally the company is saved in the database.
 * 
 */

app.post('/registerCompany', (req, res) => {

    let body = req.body;

    Company.findOne({ email: body.email }, (err, companyDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!body.cif) {
            return res.json({
                ok: false,
                err: 'The cif is empty'
            });
        }

        if (companyDB) {
            return res.json({
                ok: false,
                err: 'The email is already registered'
            });
        } else {
            User.findOne({ email: body.email }, (err, check) => {
                if (!check) {
                    let company = new Company({
                        name: body.name,
                        email: body.email,
                        contactEmail: body.contactEmail,
                        description: body.description,
                        password: bcrypt.hashSync(body.password, 10),
                        img: body.img,
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
                    return res.json({
                        ok: false,
                        err: 'The email must be unique'
                    });
                }
            });
        }
    });
});

/**
 * Method name:
 *      obtainContacts
 * 
 * Received parameters:
 *      email
 * 
 * Returned parameters:
 *      contacts
 * 
 * Search all the contacts of a company by the email.
 * 
 */

app.post('/obtainContacts', checkToken, (req, res) => {
    let email = req.body.email;

    Company.findOne(email, 'contacts', (err, company) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!company) {
            return res.json({
                ok: false,
                err: 'The company don´t exists'
            });
        }

        res.json({
            ok: true,
            company
        });
    });
});


/**
 * Method name:
 *      getCompany
 * 
 * Received parameters:
 *      email
 * 
 * Returned parameters:
 *      name, email, contactEmail, description, score, img, contacts and external projects
 * 
 * Search the company by email and returned the elements necessaries for the profile.
 * 
 */

app.post('/getCompany', checkToken, (req, res) => {
    let email = req.body.email;

    Company.findOne({ email: email }, 'name email contactEmail description score img contacts', function(err, company) {
        if (err) {
            return res.json({
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

        ExternalProject.find({ userOwner: email }, (err, projects) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            if (!projects) {
                return res.json({
                    ok: false,
                    err: 'The email is invalid'
                });
            }

            return res.json({
                ok: true,
                company,
                projects
            });
        });
    });
});

/**
 * Method name:
 *      getUser
 * 
 * Received parameters:
 *      email
 * 
 * Returned parameters:
 *      name, email, description, score, skills, courses, certificates, img and external projects
 * 
 * Search the user by email and returned the elements necessaries for the profile.
 * 
 */

app.post('/getUser', checkToken, (req, res) => {
    let email = req.body.email;

    User.findOne({ email: email }, 'name email description score skills courses certificates img', function(err, user) {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!user) {
            return res.json({
                ok: false,
                err: 'The email is invalid'
            });
        }

        ExternalProject.find({ userOwner: email }, (err, projects) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            if (!projects) {
                return res.json({
                    ok: false,
                    err: 'The email is invalid'
                });
            }

            return res.json({
                ok: true,
                user,
                projects
            });
        });
    });
});

/**
 * Method name:
 *      editUser
 * 
 * Received parameters:
 *      body
 * 
 * 
 * 
 */

app.put('/editUser', checkToken, (req, res) => {
    let body = _.pick(req.body, ['name', 'img', 'description', 'phone', 'skills', 'courses', 'certificates']);

    User.findOne({ email: req.body.email }, (err, checkUser) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (checkUser) {
            User.findOneAndUpdate(email, body, { new: true, runValidators: true }, (err, userDB) => {
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
                    message: 'The email don´t exists'
                }
            });
        }
    });

});

app.put('/editCompany', checkToken, (req, res) => {

    let id = req.body.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'description']);

    Company.findOne({ email: req.body.email }, (err, checkCompany) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (checkCompany) {
            Company.findOneAndUpdate(email, body, { new: true, runValidators: true }, (err, companyDB) => {
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
                    message: 'The email don´t exists'
                }
            });
        }
    });

});

app.put('/editPassword', checkToken, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne(email, (err, check) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (check) {
            User.findOneAndUpdate(email, { password: bcrypt.hashSync(password, 10) }, (err, passwordChanged) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }
                return res.json({
                    ok: true,
                    user: passwordChanged
                });
            });
        } else {
            Company.findOneAndUpdate(email, { password: bcrypt.hashSync(password, 10) }, (err, passwordChanged) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }
                return res.json({
                    ok: true,
                    company: passwordChanged
                });
            });
        }
    });
});

app.delete('/deleteAccount', checkToken, (req, res) => {
    let emailAccount = req.body.email;
    let stateAccount = false;
    let stateProject = 'Close';

    User.findOneAndUpdate({ email: emailAccount }, { state: stateAccount }, (err, deletedUser) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (deletedUser) {
            InternalProject.countDocuments({ userOwner: emailAccount, state: { $ne: "Close" } }, (err, count) => {
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
                        InternalProject.findOneAndUpdate({ userOwner: emailAccount, state: { $ne: "Close" } }, { state: stateProject }, (err, totalProjects) => {
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
            Company.findOneAndUpdate({ email: emailAccount }, { state: stateAccount }, (err, deletedCompany) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                InternalProject.countDocuments({ userOwner: emailAccount, state: { $ne: "Close" } }, (err, count) => {
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
                            InternalProject.findOneAndUpdate({ userOwner: emailAccount, state: { $ne: "Close" } }, { state: stateProject }, (err, totalProjects) => {
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