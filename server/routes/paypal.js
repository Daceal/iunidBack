const express = require('express');
const app = express();
const paypal = require('paypal-rest-sdk');
const InternalProject = require('../models/internalProject');

paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': '',
    'client_secret': ''
});

app.get('/paypal', (req, res) => {
    res.redirect('/index.html');
});

app.post('/buy', (req, res) => {
    var amount = req.body.amount;
    var currency = req.body.currency;
    var email = req.body.email;
    var id = req.body.id;
    var dinero = 5;
    var payment = {
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://127.0.0.1:3000/success?email=" + email + "&dinero=" + dinero + "&id=" + id + "",
            "cancel_url": "http://127.0.0.1:3000/err"
        },
        "transactions": [{
            "amount": {
                "total": amount,
                "currency": currency
            },
            "description": "Pago intermedio"
        }]
    }

    createPay(payment)
        .then((transaction) => {
            var id = transaction.id;
            var links = transaction.links;
            var counter = links.length;
            while (counter--) {
                if (links[counter].method == 'REDIRECT') {
                    //console.log(transaction)
                    return res.redirect(links[counter].href)
                        /* return res.json({
                             ok:true,
                             data:links[counter].href
                         })*/
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/err');
        });
});

app.get('/success', (req, res) => {
    let email = req.query.email;
    let id = req.query.id;

    InternalProject.findOne({ _id: id }, (err, changePayState) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        for (let i = 0; i < changePayState.users.length; i++) {
            if (changePayState.users[i].userEmail === email) {
                InternalProject.findOneAndUpdate({ _id: id, "users.userEmail": email }, { $set: { "users.$.userPay": true } }, (err, payChanged) => {
                    if (err) {
                        return res.json({
                            ok: false,
                            err
                        });
                    }

                    return res.json({
                        ok: true,
                        project: payChanged
                    });
                });
            }
        }
    });
});

// error page 
app.get('/err', (req, res) => {
    res.redirect('/err.html');
});

// helper functions 
var createPay = (payment) => {
    return new Promise((resolve, reject) => {
        paypal.payment.create(payment, function(err, payment) {
            if (err) {
                reject(err);
            } else {
                resolve(payment);
            }
        });
    });
}

module.exports = app;