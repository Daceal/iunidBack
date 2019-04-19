const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const app = express();


/**
 * Method name:
 *      createExternalProject
 * 
 * Received parameters:
 *      email, name, description, url
 * 
 * The method set the parameters in a externalProject object and save them
 * in the ExternalProject table.
 * 
 */

app.post('/createExternalProject', checkToken, (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let description = req.body.description;
    let url = req.body.url;

    let externalProject = new ExternalProject({
        userOwner: email,
        name: name,
        description: description,
        url: url
    });

    externalProject.save((err, externalDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            externalProject: externalDB
        });
    });
});

/**
 * Method name:
 *      externalProjects
 * 
 * Received parameters:
 *      email, name, description, url
 * 
 * The method find and obtain all the external projects by the email received
 * 
 */

app.post('/externalProjects', checkToken, (req, res) => {
    let email = req.body.email;
    ExternalProject.find({ email: email })
        .populate()
        .exec((err, externalProject) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                externalProject
            });
        })
});

/**
 * Method name:
 *      createInternalProject
 * 
 * Received parameters:
 *      email, name, description, tags, files, minPrice, maxPrice, initialDate, deliveryDate, 
 *      counterOffer, users, category, pendingAcepts
 * 
 * The method set the parameters in a internalProject object and save them
 * in the InternalProject table.
 * 
 */

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
    let pendingAccepts = req.body.pendingAccepts;

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
        category: category,
        pendingAccepts: pendingAccepts
    });

    internalProject.save((err, internalDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            internalProject: internalDB
        });
    });
});

/**
 * Method name:
 *      obtainAllProjects
 * 
 * Received parameters:
 *      email
 * 
 * The method find the email in the internal project table and obtain all the projects
 * where the userOwner is the same email.
 * 
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
                message: 'This user doesn´t have a project'
            });
        }

        return res.json({
            ok: true,
            internalProjects
        });
    });

});

/**
 * Method name:
 *      obtainProjectNameAndId
 * 
 * Received parameters:
 *      email
 * 
 * Returned parameters:
 *      id and name
 * 
 * Find the user owner of the internal project and return the id and name of the project
 * using the email
 * 
 */

app.post('/obtainProjectNameAndId', checkToken, (req, res) => {
    let email = req.body.email;

    InternalProject.find({ userOwner: email }, 'id name', (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!internalProjects) {
            return res.json({
                ok: false,
                message: 'This user doesn´t have a project'
            });
        }

        return res.json({
            ok: true,
            internalProjects
        });
    });

});


/**
 * Method name:
 *      obtainAllProjectsThatHeWorks
 * 
 * Received parameters:
 *      email
 * 
 * The method find and return all the projects that the user is working
 * in this moment using the email
 * 
 */

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

        return res.json({
            ok: true,
            internalProjects
        });
    });

});

/**
 * Method name:
 *      obtainProjectName
 * 
 * Received parameters:
 *      name
 * 
 * The method find and return all the projects with the name received
 * 
 */

app.post('/obtainProjectName', checkToken, (req, res) => {
    let name = req.body.name;

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

        return res.json({
            ok: true,
            internalProjects
        });
    });
});

/**
 * Method name:
 *      obtainProjectCategory
 * 
 * Received parameters:
 *      category
 * 
 * The method find and return all the projects with the category received
 * 
 */

app.post('/obtainProjectCategory', checkToken, (req, res) => {
    let category = req.body.category;

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

        return res.json({
            ok: true,
            internalProjects
        });
    });
});

/**
 * Method name:
 *      obtainProjectTags
 * 
 * Received parameters:
 *      tags
 * 
 * The method find and return all the projects with the tags received
 * 
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

        return res.json({
            ok: true,
            internalProjects
        });
    });
});

/**
 * Method name:
 *      obtainProjectPrice
 * 
 * Received parameters:
 *      minPrice, maxPrice
 * 
 * The method find and return all the projects between the min price and max price received
 * 
 */

app.post('/obtainProjectPrice', checkToken, (req, res) => {
    let minPrice = req.body.minPrice;
    let maxPrice = req.body.maxPrice;

    InternalProject.find({ $and: [{ minPrice: { $gte: minPrice } }], $and: [{ maxPrice: { $lte: maxPrice } }] }, (err, internalProjects) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (internalProjects.length === 0) {
            return res.json({
                ok: false,
                message: 'There is not a project with this prices'
            })
        }

        return res.json({
            ok: true,
            internalProjects
        });
    });
});

/**
 * Method name:
 *      addingPendingRequest
 * 
 * Received parameters:
 *      id, email
 * 
 * The method find the email in the userOwner row, if it´s true thats mean the user is
 * the owner of the project so the request is not sent. 
 * 
 * Then find it in the users row, if it´s true that means the user is working on the 
 * project so the request is not sent.
 * 
 * After that compare if the user is in the pendingAccepts row, if it´s true that means
 * the user is already pending to accept.
 * 
 * Finally, if all the previous checks are false, the pending accept is send and the user
 * is introduce in the pendingAccepts row.
 * 
 */

app.put('/addingPendingRequest', checkToken, (req, res) => {
    let id = req.body.id;
    let email = req.body.email;

    InternalProject.findById(id, (err, check) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (check.userOwner === email) {
            return res.json({
                ok: false,
                err: {
                    message: 'You can´t send a request if you are the owner of the project'
                }
            });
        }

        for (let i = 0; i < check.users.length; i++) {
            if (check.users[i] === email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'The user is already in the project'
                    }
                });
            }
        }

        for (let j = 0; j < check.pendingAccepts.length; j++) {
            if (check.pendingAccepts[j] === email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'The user is pending to accept'
                    }
                });
            }
        }

        InternalProject.findByIdAndUpdate(id, { $push: { "pendingAccepts": email } }, (err, response) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                message: response
            });
        });
    });
});

app.put('/editInternalProject', checkToken, (req, res) => {
    let idProject = req.body.id;
    let body = req.body;

    InternalProject.findByIdAndUpdate(idProject, body, (err, internalProjectEdited) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: internalProjectEdited
        });
    });
});

app.put('/editExternalProject', checkToken, (req, res) => {
    let idProject = req.body.id;
    let body = req.body;

    ExternalProject.findByIdAndUpdate(idProject, body, (err, externalProjectEdited) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: externalProjectEdited
        });
    });
});

app.delete('/deleteInternalProject', checkToken, (req, res) => {
    let idProject = req.body.id;

    InternalProject.findByIdAndDelete(idProject, (err, deletedProject) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: deletedProject
        });
    });
});

app.delete('/deleteExternalProject', checkToken, (req, res) => {
    let idProject = req.body.id;

    ExternalProject.findByIdAndDelete(idProject, (err, deletedProject) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: deletedProject
        });
    });
});

module.exports = app;