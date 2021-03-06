const express = require('express');
const app = express();
const paypal = require('paypal-rest-sdk');
const InternalProject = require('../models/internalProject');

paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': 'AafW8_J0_1S0S2nr10FWJgWWLZKVp6ZZQpGTHhHS-BzABe--81HFIuJkS5e3YSEnDGG4gi2ezQ89ZH3r',
    'client_secret': 'ENQJSFlAQSKRZsjj6Qab04SPUsXM8pt680OtEQnnVNCJzJe68FrTHnAtKm53qNJoMwyvFFtlIJEtq5Re'
});


/**
 * Method name:
 *      buy
 * 
 * 
 *   Create pay object and send to paypal
 * 
 * ================================================
 * 
 *  Este método crea el pago y lo realiza
 * 
 */
app.post('/buy', (req, res) => {
    var amount = req.body.amount;
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
                "currency": 'EUR'
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
                    return res.json({
                        ok: true,
                        data: links[counter].href
                    });
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/err');
        });
});

/**
 * Method name:
 *      success
 * 
 * 
 *   This method handles the success payments that are made within the application.
 * 
 * ================================================
 * 
 * Este método maneja los pagos que se realizan dentro de la aplicación que son correctos
 * 
 */
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

                    res.redirect('/success.html');
                });
            }
        }
    });
});

/**
 * Method name:
 *      err
 * 
 * 
 *   This method handles the error payments that are made within the application.
 * 
 * ================================================
 * 
 * Este método maneja los pagos que se realizan dentro de la aplicación que son incorrectos
 * 
 */
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