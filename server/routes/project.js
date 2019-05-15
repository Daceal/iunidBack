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
        counterOffer: counterOffer,
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

    InternalProject.find({ users: { $elemMatch: { userEmail: email } } }, (err, internalProjects) => {
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
 *      obtainProjectPrice
 * 
 * Received parameters:
 *      minPrice, maxPrice
 * 
 * The method find and return all projects between the min price and max price received
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
 * is introduce in the pendingAccepts column.
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
            if (check.users[i].userEmail === email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'You are already in the project'
                    }
                });
            }
        }

        for (let j = 0; j < check.pendingAccepts.length; j++) {
            if (check.pendingAccepts[j] === email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'You are pending to accept'
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

/**
 * Method name:
 *      acceptPendingRequest
 * 
 * Received parameters:
 *      projectId, userEmail
 * 
 * Find the project by id and change the user email from pendingAccepts to users. 
 */

app.post('/acceptPendingRequest', checkToken, (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.userEmail;
    let user = {
        userEmail: userEmail,
        userOffer: 0,
        userPay: false
    };

    InternalProject.findByIdAndUpdate(projectId, { $push: { users: user }, $pull: { pendingAccepts: userEmail } }, (err, acceptRequest) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: acceptRequest
        });
    });
});

/**
 * Method name:
 *      denyPendingRequest
 * 
 * Received parameters:
 *      projectId, userEmail
 * 
 * Find the project by id and remove the user from pendingAccepts. 
 */

app.post('/denyPendingRequest', checkToken, (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.userEmail;

    InternalProject.findByIdAndUpdate(projectId, { $pull: { pendingAccepts: userEmail } }, (err, denyRequest) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: denyRequest
        });
    });
});

/**
 * Method name:
 *      kickPerson
 * 
 * Received parameters:
 *      projectId, userEmail
 * 
 * Find the project by id and remove the user from the project. 
 */

app.post('/kickPerson', checkToken, (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.userEmail;

    InternalProject.findByIdAndUpdate(projectId, { $pull: { users: userEmail } }, (err, userKicked) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: userKicked
        });
    });
});

/**
 * Method name:
 *      addingCounterOffer
 * 
 * Received parameters:
 *      projectId, userEmail, price
 * 
 * Find the project by id, then search the userEmail, if exists the user
 * is in the project so don´t need to be added.
 * 
 * Finally add the counter offer in the pendingCounterOffer. 
 */

app.post('/addingCounterOffer', checkToken, (req, res) => {
    let projectId = req.body.id;
    let email = req.body.email;
    let price = req.body.price;
    let counterOffer = {
        user: email,
        offer: price
    };

    InternalProject.findById(projectId, (err, checkOffer) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (checkOffer.userOwner === email) {
            return res.json({
                ok: false,
                err: {
                    message: 'You can´t send a counter offer if you are the owner of the project'
                }
            });
        }

        for (let i = 0; i < checkOffer.users.length; i++) {
            if (checkOffer.users[i].userEmail === email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'You can´t send a counter offer because you are in the project'
                    }
                });
            }
        }

        for (let j = 0; j < checkOffer.pendingCounterOffer.length; j++) {
            if (checkOffer.pendingCounterOffer[j].user === email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'You can´t send a counter offer because you are pending to be accepted'
                    }
                });
            }
        }

        InternalProject.findByIdAndUpdate(projectId, { $push: { pendingCounterOffer: counterOffer } }, (err, projectOffer) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                project: projectOffer
            });
        });
    });
});

/**
 * Method name:
 *      acceptCounterOffer
 * 
 * Received parameters:
 *      projectId, userEmail, price
 * 
 * Find the project by id and change the counter offer in pendingCounterOffer to users
 */

app.post('/acceptCounterOffer', checkToken, (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.userEmail;
    let price = req.body.price;
    let counterOffer = {
        user: userEmail,
        offer: price
    };
    let user = {
        userEmail: userEmail,
        userOffer: price,
        userPay: false
    };

    InternalProject.findByIdAndUpdate(projectId, { $push: { users: user }, $pull: { pendingCounterOffer: counterOffer } }, (err, accepted) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: accepted
        });
    });
});

/**
 * Method name:
 *      denyCounterOffer
 * 
 * Received parameters:
 *      projectId, userEmail, price
 * 
 * Find the project by id and remove the counter offer from pendingCounterOffer
 */

app.post('/denyCounterOffer', checkToken, (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.userEmail;
    let price = req.body.price;
    let counterOffer = {
        user: userEmail,
        offer: price
    };

    InternalProject.findByIdAndUpdate(projectId, { $pull: { pendingCounterOffer: counterOffer } }, (err, denied) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: denied
        });
    });

});

/**
 * Method name:
 *      closeProject
 * 
 * Received parameters:
 *      projectId
 * 
 * Find the project by id and change the state to close. 
 */

app.post('/closeProject', checkToken, (req, res) => {
    let projectId = req.body.id;
    let state = 'Close';

    InternalProject.findByIdAndUpdate(projectId, { state: state }, (err, closeProject) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            project: closeProject
        });
    });
});

/**
 * Method name:
 *      editInternalProject
 * 
 * Received parameters:
 *      projectId, body
 * 
 * The method find a internal project by id and update the changes
 * 
 */

app.put('/editInternalProject', checkToken, (req, res) => {
    let projectId = req.body.id;
    let body = req.body;

    InternalProject.findByIdAndUpdate(projectId, body, (err, internalProjectEdited) => {
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

/**
 * Method name:
 *      editExternalProject
 * 
 * Received parameters:
 *      projectId, body
 * 
 * The method find a external project by id and update the changes
 * 
 */

app.put('/editExternalProject', checkToken, (req, res) => {
    let projectId = req.body.id;
    let body = req.body;

    ExternalProject.findByIdAndUpdate(projectId, body, (err, externalProjectEdited) => {
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

/**
 * Method name:
 *      deleteInternalProject
 * 
 * Received parameters:
 *      projectId
 * 
 * The method find a external project by id and delete it
 * 
 */

app.post('/deleteInternalProject', checkToken, (req, res) => {
    let projectId = req.body.id;

    InternalProject.findByIdAndDelete(projectId, (err, deletedProject) => {
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

/**
 * Method name:
 *      deleteExternalProject
 * 
 * Received parameters:
 *      projectId
 * 
 * The method find a external project by id and delete it
 * 
 */

app.post('/deleteExternalProject', checkToken, (req, res) => {
    let projectId = req.body.id;

    ExternalProject.findByIdAndDelete(projectId, (err, deletedProject) => {
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