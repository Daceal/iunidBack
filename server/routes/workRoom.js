const express = require('express');
const app = express();
const ChatConversation = require('../models/chatConversation');
const path = require('path');

/**
 * Method name:
 *      createConversation
 * 
 * Create a conversation for an internal project.
 * 
 * ================================================
 * 
 * El método crea una conversación para un proyecto interno.
 * 
 */
app.post('/createConversation', (req, res) => {
    let owner = req.body.owner;
    let members = owner;
    let state = true;

    let conversation = new ChatConversation({
        owner: owner,
        members: members,
        state: state
    });

    conversation.save((err, conversationDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            conversation: conversationDB
        });
    });
});

/**
 * Method name:
 *      download
 * 
 * Download a file from a conversation.
 * 
 * ================================================
 * 
 * El método descarga un archivo de una conversación.
 * 
 */
app.post("/download", (req, res) => {
    var filePath = path.join(__dirname, '../uploads/filesChat');
    var ruta = filePath + req.body.filename;
    res.sendFile(ruta);
});

/**
 * Method name:
 *      getDeliveriesById
 * 
 * Get all deliveries from an conversation by id
 * 
 * ================================================
 * 
 * El método obtiene todas las entregas por id de conversación
 * 
 */
app.post("/getDeliveriesById", (req, res) => {
    let id = req.body.id;
    console.log("ID:" + id);
    ChatConversation.findById(id, function(err, conversationDB) {
        if (err) {
            console.log("La conversacion no existe")
            return false;
        }

        let deliveries = conversationDB.deliveries;
        res.json({
            deliveries
        });

    });
});

/**
 * Method name:
 *      getConversationById
 * 
 * Get an conversation by id
 * 
 * ================================================
 * 
 * El método obtiene una conversación por id
 * 
 */
app.post('/getConversationById', (req, res) => {
    let id = req.body.id;

    ChatConversation.findById(id, function(err, conversationDB) {
        if (err) {
            console.log("Error al buscar conversacion")
            return false;
        }

        if (!conversationDB) {
            console.log("La conversacion no existe")
            return false;
        }
        console.log(conversationDB.owner)
    });
});

module.exports = app;