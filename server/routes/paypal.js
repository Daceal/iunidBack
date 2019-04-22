const express = require('express'); 
const app = express(); 
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': 'AafW8_J0_1S0S2nr10FWJgWWLZKVp6ZZQpGTHhHS-BzABe--81HFIuJkS5e3YSEnDGG4gi2ezQ89ZH3r', 
    'client_secret': 'ENQJSFlAQSKRZsjj6Qab04SPUsXM8pt680OtEQnnVNCJzJe68FrTHnAtKm53qNJoMwyvFFtlIJEtq5Re' 
});

app.get('/paypal' , (req , res) => {
    res.redirect('/index.html'); 
})

app.post('/buy' , ( req , res ) => {
    var amount = req.body.amount;
    var currency = req.body.currency;
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		"return_url": "http://127.0.0.1:3000/success",
		"cancel_url": "http://127.0.0.1:3000/err"
	},
	"transactions": [{
		"amount": {
			"total": amount,
			"currency": currency
		},
		"description": " Pago intermedio "
	}]
    }
    createPay( payment ) 
    .then( ( transaction ) => {
        var id = transaction.id; 
        var links = transaction.links;
        var counter = links.length; 
        while( counter -- ) {
            if ( links[counter].method == 'REDIRECT') {                
                return res.redirect( links[counter].href )
            }
        }
    })
    .catch( ( err ) => { 
        console.log( err ); 
        res.redirect('/err');
    });
}); 

// success page 
app.get('/success' , (req ,res ) => {
    console.log(req.query); 
    res.redirect('/success.html'); 
})

// error page 
app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.redirect('/err.html'); 
})

// helper functions 
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}			

module.exports = app;