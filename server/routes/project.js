const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const app = express();


// =======================================
// CREATE EXTERNAL PROJECTS
// =======================================

app.post('/createExternalProject', checkToken, (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let description = req.body.description;
    let url = req.body.url;

    let externalProject = new ExternalProject({
        user: email,
        name: name,
        description: description,
        url: url
    });

    externalProject.save((err, externalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            externalProject: externalDB
        });
    });
});

// =======================================
// OBTAIN AL EXTERNAL PROJECTS  BY ID
// =======================================

app.get('/externalProjects', (req, res) => {
    let email = req.body.email;
    ExternalProject.find({ email: email })
        .populate()
        .exec((err, externalProject) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                externalProject
            });
        })
});

// =======================================
// CREATE INTERNAL PROJECTS
// =======================================

app.post('/createInternalProject', (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let description = req.body.description;
    let tags = req.body.tags;
    let files = req.body.files;
    let minPrice = req.body.minPrice;
    let maxPrice = req.body.maxPrice;
    let initialDate = req.body.initialDate;
    let deliveryDate = req.body.deliveryDate;
    let counterOffer = req.body.counterOffer;
    let origin = req.body.origin;

    let internalProject = new InternalProject({
        user: email,
        name: name,
        description: description,
        tags: tags,
        files: files,
        minPrice: minPrice,
        maxPrice: maxPrice,
        initialDate: initialDate,
        deliveryDate: deliveryDate,
        counteroffer: counterOffer,
        origin: origin
    });

    internalProject.save((err, internalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            internalProject: internalDB
        });
    });
});

/**
 * OBTAIN ALL INTERNAL PROJECTS, EXTERNAL PROJECTS, PROJECTS WHO IS WORKING AT
 */

app.post('/obtainAllProjects', (req, res) => {
    let email = req.body.email;

    InternalProject.find({ user: email }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!internalProjects) {
            return res.json({
                ok: false,
                message: 'This user doesn\'t have a project'
            })
        }

        return res.json({
            ok: true,
            internalProjects
        });

    });
});

/**
 * OBTAIN A INTERNAL PROJECT BY NAME
 */

app.get('/obtainProjectName', (req, res) => {
    let name = req.body.name;

    InternalProject.find({ name: name }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!internalProjects) {
            return res.json({
                ok: false,
                message: 'There is not a project with this name'
            })
        }

        res.json({
            ok: true,
            internalProjects
        });
    });
});

/**
 * OBTAIN A INTERNAL PROJECT BY DATE
 */

app.get('/obtainProjectDate', (req, res) => {
    let date = req.body.date;

    InternalProject.find({ date: date }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!internalProjects) {
            return res.json({
                ok: false,
                message: 'There is not a project with this date'
            })
        }

        res.json({
            ok: true,
            internalProjects
        });
    });
});

module.exports = app;