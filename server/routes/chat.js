const express = require('express'); 
const app = express();


app.get('/chat', function(req, res){
    res.redirect('/chat.html'); 
});

module.exports = app;