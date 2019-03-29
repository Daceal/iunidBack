const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const app = express();

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

module.exports = app;