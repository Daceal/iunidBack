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

app.post('/externalProjects', checkToken, (req, res) => {
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

app.post('/createInternalProject', checkToken, (req, res) => {
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
    let users = req.body.users;
    let category = req.body.category;

    let internalProject = new InternalProject({
        userOwner: email,
        name: name,
        description: description,
        tags: tags,
        files: files,
        minPrice: minPrice,
        maxPrice: maxPrice,
        initialDate: initialDate,
        deliveryDate: deliveryDate,
        counteroffer: counterOffer,
        users: users,
        category: category

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

app.post('/obtainAllProjects', checkToken, (req, res) => {
    let email = req.body.email;

    InternalProject.find({ userOwner: email }, (err, internalProjects) => {
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
            });
        }

        res.json({
            ok: true,
            internalProjects
        });
    });

});

app.post('/obtainAllProjectsThatHeWorks', checkToken, (req, res) => {
    let email = req.body.email;

    InternalProject.find({ users: email }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!internalProjects) {
            return res.json({
                ok: false,
                message: 'This user doesn\'t work in any project'
            });
        }

        res.json({
            ok: true,
            internalProjects
        });
    });

});

/**
 * OBTAIN A INTERNAL PROJECT BY NAME
 */

app.post('/obtainProjectName', checkToken, (req, res) => {
    let name = req.body.name;
    let email = req.body.email;

    InternalProject.find({ name: { "$regex": name, "$options": "i" } }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (internalProjects.length === 0) {
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
 * OBTAIN A INTERNAL PROJECT BY CATEGORY
 */

app.post('/obtainProjectCategory', checkToken, (req, res) => {
    let category = req.body.category;
    let email = req.body.email;

    InternalProject.find({ category: category }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (internalProjects.length === 0) {
            return res.json({
                ok: false,
                message: 'There is not a project with this category'
            })
        }

        res.json({
            ok: true,
            internalProjects
        });
    });
});

/**
 * OBTAIN A INTERNAL PROJECT BY TAGS
 */

app.post('/obtainProjectTags', checkToken, (req, res) => {
    let tags = req.body.tags;

    InternalProject.find({ tags: { $all: tags } }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (internalProjects.length === 0) {
            return res.json({
                ok: false,
                message: 'There is not a project with this tags'
            })
        }

        res.json({
            ok: true,
            internalProjects
        });
    });
});

module.exports = app;