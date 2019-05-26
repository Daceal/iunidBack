const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const User = require('../models/user');
const Company = require('../models/company');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const { checkToken } = require('../middlewares/authentication');
const ChatConversation = require('../models/chatConversation');
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
 * If the previous comparation returns true, it compares the received password with the user or company password
 * 
 * Finally the method create a token for that user session.
 * 
 * ===============================================================================================
 * 
 * Este metodo logea a un usuario o compañia de la siguiente manera:
 * 
 * El método compara si el email recibido esta en la alguna de las tablas.
 * 
 * Después compara el estado de la cuenta, si es falso automáticamente se sale y devuelve falso
 * porque indica que la cuenta se encuentra inactiva.
 * 
 * Si es estado devuelve true compara la contraseña recibida con la de el usuario o compañia.
 * 
 * Finalmente el metodo crea un token para la sesión de ese usuario.
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

                if (!companyDB) {
                    return res.json({
                        ok: false,
                        err: {
                            message: 'User or password incorrect'
                        }
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
 * ============================================================================================
 * 
 * El método encuentra el email pasado y busca coincidencias en las tablas de usuario y compañia
 * porque el email debe ser único.
 * 
 * Si no existe ese email el método crea al usuario y encripta su contraseña.
 * 
 * Finalmente el usuario se guarda en la base de datos.
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
 * ============================================================================================
 * 
 * El método encuentra el email pasado y busca coincidencias en las tablas de usuario y compañia
 * porque el email debe ser único.
 * 
 * Si no existe ese email el método crea a la empresa y encripta su contraseña.
 * 
 * Finalmente la empresa se guarda en la base de datos.
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
 * ==================================================================
 * 
 * Busca todos los contactos de una compañia por su email.
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
 * Search the company by email and returns the elements necessaries for the profile.
 * 
 * =======================================================================================
 * 
 * Busca la compañia por email y devuelve los elementos necesarios para su perfil.
 * 
 */

app.post('/getCompany', checkToken, (req, res) => {
    let email = req.body.email;
    let average = 0;
    let sum = 0;
    let cont = 0;

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

        for (var i = 0; i < company.score.length; i++) {
            sum = sum + parseInt(company.score[i].userScore);
            cont++;
        }
        average = (sum / cont);

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
                projects,
                average
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
 * =======================================================================================
 * 
 * Busca al usuario por email y devuelve los elementos necesarios para su perfil.
 * 
 */

app.post('/getUser', checkToken, (req, res) => {
    let email = req.body.email;
    let average = 0;
    let sum = 0;
    let cont = 0;

    User.findOne({ email: email }, 'name email description score skills courses certificates img phone', function(err, user) {
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

        for (var i = 0; i < user.score.length; i++) {
            sum = sum + parseInt(user.score[i].userScore);
            cont++;
        }
        average = (sum / cont);

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
                projects,
                average
            });
        });
    });
});

/**
 * Method name:
 *      getUsersByName
 * 
 * Received parameters:
 *      name
 * 
 * Search the users by name (company search).
 * 
 * ==================================================
 * 
 * Busca a los usuarios por su nombre (Busqueda de una compañia).
 * 
 */

app.post('/getUsersByName', (req, res) => {
    let userName = req.body.name;

    User.find({ name: userName }, (err, users) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!users) {
            return res.json({
                ok: false,
                err: 'There is not user with this name'
            });
        }

        return res.json({
            ok: true,
            user: users
        });
    })
});

/**
 * Method name:
 *      getUsersByCertificates
 * 
 * Received parameters:
 *      name
 * 
 * Search the users by certificates (company search).
 * 
 * ==================================================
 * 
 * Busca a los usuarios por sus certificados (Busqueda de una compañia).
 * 
 */

app.post('/getUsersByCertificates', checkToken, (req, res) => {
    let certificates = req.body.certificates;

    User.find({ certificates: { $all: certificates } }, (err, users) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (users.length === 0) {
            return res.json({
                ok: false,
                message: 'There is not a user with this Certificates'
            });
        }

        return res.json({
            ok: true,
            users
        });
    });
});

/**
 * Method name:
 *      getUsersByCourses
 * 
 * Received parameters:
 *      name
 * 
 * Search the users by courses (company search).
 * 
 * ==================================================
 * 
 * Busca a los usuarios por sus cursos (Busqueda de una compañia).
 * 
 */

app.post('/getUsersByCourses', checkToken, (req, res) => {
    let courses = req.body.courses;

    User.find({ courses: { $all: courses } }, (err, users) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (users.length === 0) {
            return res.json({
                ok: false,
                message: 'There is not a user with this Courses'
            });
        }

        return res.json({
            ok: true,
            users
        });
    });
});

/**
 * Method name:
 *      getUsersBySkills
 * 
 * Received parameters:
 *      name
 * 
 * Search the users by skills (company search).
 * 
 * ==================================================
 * 
 * Busca a los usuarios por sus habilidades (Busqueda de una compañia).
 * 
 */

app.post('/getUsersBySkills', checkToken, (req, res) => {
    let skills = req.body.skills;

    User.find({ skills: { $all: skills } }, (err, users) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (users.length === 0) {
            return res.json({
                ok: false,
                message: 'There is not a user with this Skills'
            });
        }

        return res.json({
            ok: true,
            users
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
 * Find the user in the database and update the changes.
 * 
 * ==================================================
 * 
 * Encuentra al usuario en la base de datos y guarda los cambios.
 * 
 */

app.put('/editUser', checkToken, (req, res) => {
    let body = _.pick(req.body, ['name', 'email', 'img', 'description', 'phone', 'skills', 'courses', 'certificates']);

    User.findOne({ email: body.email }, (err, checkUser) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (checkUser) {
            User.findOneAndUpdate({ email: body.email }, body, { new: true, runValidators: true }, (err, userDB) => {
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
 *      editCompany
 * 
 * Received parameters:
 *      body
 * 
 * Find the company in the database and update the changes
 * 
 * ==================================================
 * 
 * Encuentra a la compañia en la base de datos y guarda los cambios.
 * 
 */

app.put('/editCompany', checkToken, (req, res) => {
    let body = _.pick(req.body, ['name', 'email', 'img', 'description']);

    Company.findOne({ email: body.email }, (err, checkCompany) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (checkCompany) {
            Company.findOneAndUpdate({ email: body.email }, body, { new: true, runValidators: true }, (err, companyDB) => {
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
 *      addScore
 * 
 * Received parameters:
 *      email, projectId, userEmail, score
 * 
 * The method find the user or the company by the email, then compare the userEmail
 * and the projectId, if the condition returns false that means he cant vote the user
 * because he only can vote a user one time per project.
 * 
 * ====================================================================================
 * 
 * El método encuentra al usuario o compañia por su email y compara el userEmail y el
 * projectId, si la condición devuelve falso significa que ese usuario no puede votar
 * a otro usuario porque ya lo hizo y solo está permitido una vez por proyecto.
 * 
 */

app.post('/addScore', checkToken, (req, res) => {
    let email = req.body.email;
    let projectId = req.body.projectId;
    let userEmail = req.body.userEmail;
    let userScore = req.body.score;
    let check = true;
    let addScore = {
        projectId: projectId,
        user: email,
        score: userScore
    }

    User.findOne({ email: userEmail }, (err, searchUser) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (searchUser) {
            for (let i = 0; i < searchUser.score.length; i++) {
                if (searchUser.score[i].user === email && searchUser.score[i].projectId === projectId) {
                    check = false;
                }
            }

            if (check) {
                User.findOneAndUpdate({ email: userEmail }, { $push: { score: addScore } }, (err, addScore) => {
                    if (err) {
                        return res.json({
                            ok: false,
                            err
                        });
                    }

                    return res.json({
                        ok: true,
                        user: addScore
                    });
                });

            } else {
                return res.json({
                    ok: false,
                    err: {
                        message: 'You can´t vote this user'
                    }
                });
            }

        } else {
            Company.findOne({ email: userEmail }, (err, searchCompany) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                for (let i = 0; i < searchCompany.score.length; i++) {
                    if (searchCompany.score[i].user === email && searchCompany.score[i].projectId === projectId) {
                        check = false;
                    }
                }

                if (check) {
                    Company.findOneAndUpdate({ email: userEmail }, { $push: { score: addScore } }, (err, addScore) => {
                        if (err) {
                            return res.json({
                                ok: false,
                                err
                            });
                        }

                        return res.json({
                            ok: true,
                            user: addScore
                        });
                    });

                } else {
                    return res.json({
                        ok: false,
                        err: {
                            message: 'You can´t vote this user'
                        }
                    });
                }
            });
        }

    });
});

/**
 * Method name:
 *      sendMessageCollaborator
 * 
 * Received parameters:
 *      projectId, userEmail
 * 
 * The method search a internal project by id and fill a variable with his id and name,
 * then search the user by the email and add a message.
 * 
 * ====================================================================================
 * 
 * El método busca un proyecto interno por su id y almacena en una variable su id
 * y su nombre, después busca al usuario por su email y le añade un mensaje.
 * 
 */

app.post('/sendMessageCollaborator', (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.userEmail;

    InternalProject.findById(projectId, (err, project) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (project.userOwner === userEmail) {
            return res.json({
                ok: false,
                err: {
                    message: 'You can´t send a message if you are the owner of the project'
                }
            });
        }

        for (let i = 0; i < project.users.length; i++) {
            if (project.users[i].userEmail === userEmail) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'You can´t send a message because the user is in the project'
                    }
                });
            }
        }

        for (let j = 0; j < project.pendingCounterOffer.length; j++) {
            if (project.pendingCounterOffer[j].user === userEmail) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'You can´t send a message because the user is pending to be accepted'
                    }
                });
            }
        }

        let messageProject = {
            "ProjectId": projectId,
            "ProjectName": project.name
        };

        User.findOneAndUpdate({ email: userEmail }, { $push: { pendingMessages: messageProject } }, (err, userDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            for (let k = 0; k < userDB.pendingMessages.length; k++) {
                if (userDB.pendingMessages[k].ProjectId === projectId) {
                    return res.json({
                        ok: false,
                        err: {
                            message: 'You can´t send a message because this user has an email of this project'
                        }
                    });
                }
            }

            return res.json({
                ok: true,
                userDB
            });
        });
    });
});

/**
 * Method name:
 *      showMessagesCollaborator
 * 
 * Received parameters:
 *      userEmail
 * 
 * The method shows all the pending messages that he has.
 * 
 * ====================================================================================
 * 
 * El método muestra todos los mensajes pendientes que tiene ese usuario.
 * 
 */

app.post('/showMessagesCollaborator', checkToken, (req, res) => {
    let userEmail = req.body.email;

    User.findOne({ email: userEmail }, 'pendingMessages', (err, messages) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            messages
        });
    });
});

/**
 * Method name:
 *      acceptPendingRequestCollaborator
 * 
 * Received parameters:
 *      projectId, userEmail
 * 
 * Find the project by id and change the user email from pendingAccepts to users, then remove the message from the user. 
 * 
 * ==========================================================================================================================
 * 
 * Encuentra el proyecto por su id y cambia el email del usuario de pendingAccepts a users, y elimina el mensaje al usuario.
 * 
 */

app.post('/acceptPendingRequestCollaborator', checkToken, (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.email;
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

        User.findOneAndUpdate({ email: userEmail }, { $pull: { pendingMessages: { ProjectId: projectId } } }, (err, eliminateMessage) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            ChatConversation.findOneAndUpdate({ owner: acceptRequest.userOwner }, { $push: { members: email } }, (err, chatDB) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }

                if (!chat) {
                    return res.json({
                        ok: false,
                        err: {
                            message: 'The chat not exists'
                        }
                    });
                }

                return res.json({
                    ok: true,
                    project: acceptRequest,
                    user: eliminateMessage,
                    chat: chatDB
                });
            });
        });
    });
});

/**
 * Method name:
 *      denyPendingRequestCollaborator
 * 
 * Received parameters:
 *      projectId, userEmail
 * 
 * Find the project by id and remove the user from pendingAccepts then remove the message from the user. 
 * 
 * ==========================================================================================================================
 * 
 * Encuentra el proyecto por id y elimina al usuario de pendingAccepts, después elimina el mensaje al usuario.
 * 
 */

app.post('/denyPendingRequestCollaborator', checkToken, (req, res) => {
    let projectId = req.body.id;
    let userEmail = req.body.email;

    InternalProject.findByIdAndUpdate(projectId, { $pull: { pendingAccepts: userEmail } }, (err, denyRequest) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        User.findOneAndUpdate({ email: userEmail }, { $pull: { pendingMessages: { ProjectId: projectId } } }, (err, eliminateMessage) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                project: denyRequest,
                user: eliminateMessage
            });
        });
    });
});

/**
 * Method name:
 *      deleteAccount
 * 
 * Received parameters:
 *      emailAccount
 * 
 * The method find the user or the company by the email, then change the stateAccount to false
 * and close all the internal projects that the user have, but only when is not already close.
 * 
 * ==========================================================================================================================
 * 
 * El metodo encuentra al usuario o compañia por el email, cambia el estado de la cuenta a false
 * y cierra todos los proyectos internos que ese usuario tiene, pero solo si no estan cerrados.
 * 
 */

app.post('/deleteAccount', checkToken, (req, res) => {
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
            InternalProject.countDocuments({ userOwner: emailAccount, state: { $ne: stateProject } }, (err, count) => {
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
                        InternalProject.findOneAndUpdate({ userOwner: emailAccount, state: { $ne: stateProject } }, { state: stateProject }, (err, totalProjects) => {
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

                InternalProject.countDocuments({ userOwner: emailAccount, state: { $ne: stateProject } }, (err, count) => {
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
                            InternalProject.findOneAndUpdate({ userOwner: emailAccount, state: { $ne: stateProject } }, { state: stateProject }, (err, totalProjects) => {
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

app.get('/img/:type/:rute', (req, res, next) => {

    var rute = req.params.rute;
    var type = req.params.type;
    var path = `./uploads/${ rute }`;

    fs.exists(path, exist => {
        if (!exist) {

            if (type === 'user') {
                path = './uploads/images/user-avatar.svg';
            } else {
                path = './uploads/images/company-avatar.svg';
            }
        }

        res.sendfile(path);

    });
});

module.exports = app;