const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const app = express();


// =======================================
// CREATE EXTERNAL PROJECTS
// =======================================

app.post('/createExternalProject', (req, res) => {
    let id = '5c9cf67b1804bf1170e99ac4';
    let name = req.body.name;
    let description = req.body.description;
    let url = req.body.url;

    let externalProject = new ExternalProject({
        user: id,
        name: name,
        description: description,
        url: url
    });

    externalProject.save((err, internalDB) => {
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

// =======================================
// OBTAIN AL EXTERNAL PROJECTS  BY ID
// =======================================

app.get('/externalProjects/:id', (req, res) => {
    var id = req.params.id;
    ExternalProject.find({ user: id })
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
    let id = '5c9cf845f439f63c4c24cc6a';
    let name = req.body.name;
    let description = req.body.description;
    let skills = req.body.skills;
    let files = req.body.files;
    let minPrice = req.body.minPrice;
    let maxPrice = req.body.maxPrice;
    let initialDate = req.body.initialDate;
    let deliveryDate = req.body.deliveryDate;
    let counterOffer = req.body.counterOffer;

    let internalProject = new InternalProject({
        user: id,
        name: name,
        description: description,
        tags: skills,
        files: files,
        minPrice: minPrice,
        maxPrice: maxPrice,
        initialDate: initialDate,
        deliveryDate: deliveryDate,
        counteroffer: counterOffer
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
 * OBTAIN ALL INTERNAL PROJECTS
 */

app.get('/obtainAllProjects', (req, res) => {
    InternalProject.find({ state: 'Open' }, 'name description')
        .exec((err, internalProjects) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                internalProjects
            });
        });
});

/**
 * OBTAIN ALL INTERNAL PROJECTS OF A COMPANY
 */

app.get('/obtainAllProjects/:id', (req, res) => {
    let id = req.params.id;
    InternalProject.find({ user: id }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!internalProjects) {
            return res.json({
                ok: false,
                message: 'This company doesnt have a project'
            })
        }

        return res.json({
            ok: true,
            internalProjects
        });

    });
});

/**
 * OBTAIN A INTERNAL PROJECT BY ID
 */

app.get('/obtainProject/:id', (req, res) => {
    let id = req.params.id;
    InternalProject.findById(id, 'name description')
        .exec((err, internalProjects) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            if (!internalProjects) {
                return res.json({
                    ok: false,
                    message: 'There is not id'
                })
            }

            res.json({
                ok: true,
                internalProjects
            });
        });
});

/**
 * OBTAIN A INTERNAL PROJECT BY SKILLS (TERMINAR DE HACER)
 */

app.get('/obtainProject', (req, res) => {
    let skills = req.body.skills;
    InternalProject.find({ skills: skills }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            internalProjects
        });
    });

    var arr = ["1", "2", "3"];
    var res = ["y", "n", "y"];

    var result = arr.filter(function(e, i) {
        return res[i] == 'y'
    })

    console.log(result)



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