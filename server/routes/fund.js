const express = require('express');
const InternalProject = require('../models/internalProject');
const ExternalProject = require('../models/externalProject');
const Fund = require('../models/fund');
const { checkToken, checkAdmin_Role } = require('../middlewares/authentication');
const app = express();

app.post('/createBenefit', (req, res) => {
    let body = req.body;

    let fund = new Fund({
        benefits: body.benefits,
        internalProject: body.internalProject,
        email: body.email
    });

    fund.save((err, fundDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            fund: fundDB
        });
    });
});

app.post('/createExpense', (req, res) => {
    let body = req.body;

    let fund = new Fund({
        expenses: body.expenses,
        internalProject: body.internalProject,
        email: body.email
    });

    fund.save((err, fundDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            fund: fundDB
        });
    });
});

app.post('/obtainFundsByEmail', checkToken, (req, res) => {
    let email = req.body.email;

    console.log(email);

    Fund.find({email: email}, (err, funds) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!funds) {
            return res.json({
                ok: false,
                message: 'This user doesn´t have funds'
            });
        }

        return res.json({
            ok: true,
            funds
        });
    });
});


app.post('/obtainBenefitsByEmail', checkToken, (req, res) => {
    let email = req.body.email;

    console.log(email);
    Fund.find({email: email, benefits : {$gt : 0}}, 'benefits', (err, funds) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!funds) {
            return res.json({
                ok: false,
                message: 'This user doesn´t have funds'
            });
        }

        var totalBenefits = 0;
        for ( var i = 0; i < funds.length; i++){
            console.log(funds[i])
            totalBenefits = totalBenefits + funds[i].benefits;
        }

        return res.json({
            ok: true,
            email: email,
            totalBenefits: totalBenefits,
            funds
        });
    });
});

app.post('/obtainExpensesByEmail', checkToken, (req, res) => {
    let email = req.body.email;

    Fund.find({email: email, expenses : {$gt : 0}}, 'expenses', (err, funds) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!funds) {
            return res.json({
                ok: false,
                message: 'This user doesn´t have funds'
            });
        }

        var totalExpenses = 0;
        for ( var i = 0; i < funds.length; i++){
            totalExpenses = totalExpenses + funds[i].expenses;
        }

        return res.json({
            ok: true,
            email: email,
            totalExpenses: totalExpenses,
            funds
        });
    });
});

app.post('/obtainFundsByProject', checkToken, (req, res) => {
    let internalProject = req.body.internalProject;

    Fund.find({internalProject: internalProject}, (err, funds) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!funds) {
            return res.json({
                ok: false,
                message: 'This project doesn´t have funds'
            });
        }

        return res.json({
            ok: true,
            funds
        });
    });
});

app.post('/obtainBenefitsByProject', checkToken, (req, res) => {
    let internalProject = req.body.internalProject;

    Fund.find({internalProject: internalProject, benefits : {$gt : 0}}, 'benefits', (err, funds) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!funds) {
            return res.json({
                ok: false,
                message: 'This project doesn´t have funds'
            });
        }

        var totalBenefits = 0;
        for ( var i = 0; i < funds.length; i++){
            totalBenefits = totalBenefits + funds[i].benefits;
        }

        return res.json({
            ok: true,
            internalProject: internalProject,
            totalBenefits: totalBenefits,
            funds
        });
    });
});

app.post('/obtainExpensesByProject', checkToken, (req, res) => {
    let internalProject = req.body.internalProject;

    Fund.find({internalProject: internalProject, expenses : {$gt : 0}}, 'expenses', (err, funds) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!funds) {
            return res.json({
                ok: false,
                message: 'This project doesn´t have funds'
            });
        }

        var totalExpenses = 0;
        for ( var i = 0; i < funds.length; i++){
            totalExpenses = totalExpenses + funds[i].expenses;
        }
        
        return res.json({
            ok: true,
            internalProject: internalProject,
            totalExpenses: totalExpenses,
            funds
        });
    });
});

module.exports = app;