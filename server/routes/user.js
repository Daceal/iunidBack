const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const _ = require('underscore');
const User = require('../models/user');
const Company = require('../models/company');
const path = require('path');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const app = express();



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

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'registro.html'));
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
                err: 'El email está registrado'
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
                err: 'El email está registrado'
            });
        }

        if (!companyDB) {
            let company = new Company({
                email: body.email,
                name: body.name,
                cif: body.cif,
                description: body.description,
                img: body.img,
                emailContacto: body.emailContacto,
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



/* app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
}); 

app.put('/user/:id', [checkToken, checkAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

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

    })
});

app.delete('/user/:id', checkToken, function(req, res) {

    let id = req.params.id;
    let changeState = {
        state: false
    };

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            usuario: userDeleted
        });

    });

});*/

module.exports = app;