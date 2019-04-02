const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const app = express();

// =======================================
// COMPANY OPTIONS
// =======================================

app.get('/company/searchContacts', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the search contacts page'
    });
});

app.get('/company/myBills', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the my bills page'
    });
});

app.get('/company/workingRoom', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the working room page'
    });
});

app.get('/company/help', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the help page'
    });
});

app.get('/company/dashboard', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the dashboard page'
    });
});

app.get('/company/profile', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the profile page'
    });
});


// =======================================
// USERS OPTIONS
// =======================================



app.get('/user/dashboard', (req, res) => {
    res.json('I am in dashboard')
});

app.get('/user/perfil', (req, res) => {
    res.json('I am in perfil')
});

app.get('/user/createproject', (req, res) => {
    res.json('I am in publicar proyecto')
});

app.get('/user/projects', (req, res) => {
    res.json('I am in mis proyectos')
});

app.get('/user/help', (req, res) => {
    res.json('I am in ayuda')
});

app.get('/user/workcenter', (req, res) => {
    res.json('I am in sala de trabajo')
});

app.get('/user/findjobs', (req, res) => {
    res.json('I am in buscar trabajos')
});

module.exports = app;