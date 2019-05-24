const express = require('express');
const app = express();
const ChatConversation = require('../models/chatConversation');
const path = require('path');

app.get('/chat', function(req, res) {
    res.redirect('/chat.html');
});

app.get('/chat2', function(req, res) {
    res.redirect('/chat2.html');
});

app.get('/private', function(req, res) {
    res.redirect('/privateRoom.html')
});

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

/*app.post('/download', (req, res) => {
    console.log("DENTRO DOWNLOAD")
    var filePath = path.join(__dirname, '../sockets/uploads/');
    var fileName = "Grupo.rar";
    console.log("Path: " + filePath+fileName)
    res.download(filePath+fileName, fileName, function(err){
        if (err) {
          console.log('Error');
        } else {
          console.log('success');
        }
      });
});*/

app.post("/download", (req, res) => {
    var filePath = path.join(__dirname, '../sockets/uploads/');
    var ruta = filePath + req.body.filename;
    res.sendFile(ruta);
});


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