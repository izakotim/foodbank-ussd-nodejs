var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const options = {
    apiKey: 'bb1d6ce530063c57749d55cf5318ba13c3b60c90836f27906fef6c11f6f24933',  // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};

const africastalking = require('africastalking')(options);

const router = express.Router();

// Initialize a service e.g. SMS
ussd = africastalking.USSD;

app.post("/", (req, res) => {

    var message = '';

    var sessionId   = req.body.sessionId;
    var serviceCode = req.body.serviceCode;
    var phoneNumber = req.body.phoneNumber;
    var text 	    = req.body.text;

   console.log(sessionId, serviceCode, phoneNumber, text);

    //var length = text.split('*').length;
    //var txt = text.split('*');

    //var length = text.split(/[0-9]\*0|\*/g).filter(x => x).length;
    var txt = text.split(/[0-9]\*0|\*0|\*/g).filter(x => x);

    console.log("ARR=> ", txt);

    //Level 1
    if (txt.length == 0) {
        message = 'CON Please select the food bundle you would like to purchase: \n';
        message += '1: Single member family bundle \n';
        message += '2: Couple bundle\n';
        message += '3: With 1-2 Children bundle\n';
        message += '4: With 3-5 Children bundle';
    }


    //Level 2
    else if (txt.length == 1 && txt[0] === '1') {
        message = 'CON You selected the Single member family bundle: 25kg mealie meal, 2kg kapenta, 1kg tea, 90kg charcoal for ZMW 493.16 \n';
        message += '1: Confirm \n';
        message += '0: Back \n';
    }

    else if (txt.length == 1 && txt[0] === '2') {
        message = 'CON You selected the Couple bundle: 2x25kg mealie meal, 2x2kg kapenta, 1kg tea, 90kg charcoal for ZMW 759.32 \n';
        message += '1: Confirm \n';
        message += '0: Back \n';
    }
    

    else if (txt.length == 1 && txt[0] === '3') {
        message = 'CON You selected the Single member family bundle: 3x25kg mealie meal, 3x2kg kapenta, 1kg tea, 90kg charcoal for ZMW 1024.48 \n';
        message += '1: Confirm \n';
        message += '0: Back \n';
    }


    else if (txt.length == 1 && txt[0] === '4') {
        message = 'CON You selected the Single member family bundle: 4x25kg mealie meal, 4x2kg kapenta, 1kg tea, 90kg charcoal for ZMW 1289.64  \n';
        message += '1: Confirm \n';
        message += '0: Back \n';
    }

    //Level 3
    //if confiremed (1)
    else if (txt.length == 2 && txt[1] === '1') {
        message = 'CON ZMW 1024.48 will be billed from your selected account. \n';
        message += '1: Mpesa \n';
        message += '2: MTN Money \n';
    }

    //Level 4
    //Mpesa logic
    else if (txt.length == 3 && txt[2] === '1') {
        message = 'END Thank you. ZMW 1024.48 was deducted from your Mpesa wallet. Here is your redeemable code: \n';
        message += randomCode() + ' \n';
    }

    //MTN logic
    else if (txt.length == 3 && txt[2] === '2') {
        message = 'END Thank you. ZMW 1024.48 was deducted from your MTN Money wallet. Here is your redeemable code: \n';
        message += randomCode() + ' \n';
    }

    else {
        message = 'END Invalid input. Try again.';
    }

    res.contentType('text/plain');
    res.status(200).send(message);
});

app.post("/9827", (req, res) => {

    var message = '';

    var sessionId   = req.body.sessionId;
    var serviceCode = req.body.serviceCode;
    var phoneNumber = req.body.phoneNumber;
    var text 	    = req.body.text;

   console.log(sessionId, serviceCode, phoneNumber, text);

    //var length = text.split('*').length;
    //var txt = text.split('*');

    //var length = text.split(/[0-9]\*0|\*/g).filter(x => x).length;
    var txt = text.split(/[0-9]\*0|\*0|\*/g).filter(x => x);

    console.log("ARR=> ", txt);

    //Level 1
    if (txt.length == 0) {
        message = 'CON Welcome to the Food Bank service: \n';
        message += '1: View packages \n';
        message += '2: Subscribe to a package \n';
    }


    //Level 2
    else if (txt.length == 1 && txt[0] === '1') {
        message = 'CON Select a package to view \n';
        message += '1. Basket for 1 person \n';
        message += '2. Basket for 2 people \n';
        message += '3. Basket for 3 people \n';
        message += '4. Basket for 4 people \n';
        message += '5. Basket for 5 people \n';
        message += '0: Back \n';
    }

    else if (txt.length == 1 && txt[0] === '2') {
        message = 'CON Select a package to buy \n';
        message += '1. Basket for 1 person (ZMW 1020.50) \n';
        message += '2. Basket for 2 people (ZMW 1250.60) \n';
        message += '3. Basket for 3 people (ZMW 1310.80) \n';
        message += '4. Basket for 4 people (ZMW 1430.10) \n';
        message += '5. Basket for 5 people (ZMW 1540.10) \n';
        message += '0: Back \n';
    }
    

    //Level 3
    //if viewing packages only END session
    else if (txt.length == 2 && txt[0] === '1') {
        message = 'END Thank you for your query. We will send you an SMS shortly with the contents and price of your selected package. \n';
    }

    else if (txt.length == 2 && txt[0] === '2') {
        message = 'CON You have seleccted a basket. Please choose your location. \n';
        message += '1. Location 1 \n';
        message += '2. Location 2 \n';
        message += '3. Location 3 \n';
        message += '4. Location 4 \n';
        message += '5. Location 5 \n';
    }

    //Level 4
    //Delivery logic (no need to check for selected value)
    else if (txt.length == 3) {
        message = 'CON We deliver every saturday. Please select your preferred date: \n';
        message += '1. 1st April \n';
        message += '2. 8th April \n';
        message += '3. 15th April \n';
        message += '4. 22nd April \n';
        message += '5. 29th April \n';
    }

    //Level 5
    else if (txt.length == 4) {
        message = 'CON Please input your ful address and phone number: \n';
    }

    //Level 6
    else if (txt.length == 5) {
        message = 'CON Please select your payment method: \n';
        message += '1. Cash on delivery \n';
        message += '2. Mobile Money \n';
    }

    //Level 7
    //condition for COD
    else if (txt.length == 6 && txt[5] === '1') {
        message = 'END Thank you for using our service. \n';
    }

    //condition for Mobile money
    else if (txt.length == 6 && txt[5] === '2') {
        message = 'CON Please enter your Mobile money PIN: \n';
    }

    //Level 8
    //Success mobile money
    else if (txt.length == 7) {
        message = 'END Thank you for using our service. \n';
    }

    else {
        message = 'END Invalid input. Try again.';
    }

    res.contentType('text/plain');
    res.status(200).send(message);
});

function randomCode() {
    var length = 3;
    chars = 'PYUTRW2345678ASDFGHKMVCX';

    var result = '';  
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return 'ZM' + result;
}


app.listen(8383, () => {
    console.log("Server running on port 8383 " + randomCode());
});