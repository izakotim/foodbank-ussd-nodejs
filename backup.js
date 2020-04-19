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
    var text 	= req.body.text;

   console.log(sessionId, serviceCode, phoneNumber, text);

    var length = text.split('*').length;
    var txt = text.split('*');

    //var length = text.split(/\*/g | /\*0/g).length;
    //var txt = text.split(/\*/g | /\*0/g);

    console.log("Regexed", txt);

    // look up - is customer? or Agent - offer 2 parts, agent -?
    if (text === '') {
        message = 'Please select the food bundle you would like to purchase: \n';
        message += '1: Single member family bundle \n';
        message += '2: Couple bundle \n';
        message += '3: With 1-2 Children bundle \n';
        message += '4: With 3-5 Children bundle';
    }

    // confirm selection
    else if (text === '1') {
        message = 'CON You have selected the Single member family bundle: 10kg rice, 5kg meat, 3l milk for $100.00 \n';
        message += '1: Confirm \n';
        message += '0: Go Back \n';
    }
    else if (length === 2 && txt[0] === '1') {
        message = 'CON Enter device color';
    }
    else if (length === 3 && txt[0] === '1') {
        message = 'CON Enter device model\n';
        message += 'eg. Nokia 3310';
    }
    else if (length === 4 && txt[0] === '1') {
        message = 'CON Enter Warranty status\n';
        message += '1) Yes / 2) No';
    }
    else if (length === 5 && txt[0] === '1') {
        message = 'CON Enter Insurance status\n';
        message += '1). Yes / 2). No';
    }
    else if (length === 6 && txt[0] === '1') {
        message = 'CON Is device in stock\n';
        message += '1). Yes / 2). No';
    }
    else if (length === 7 && txt[0] === '1') {
        // commit to db
        message = 'END Device registered';
        var options = text.split('*');

        db.Device.create({
            imei: options[1],
            color: options[2],
            model: options[3],
            warrant_status: options[4],
            insurance_status: options[5],
            in_stock: options[6]
        }).then(function (device) {
            console.log('device added', device);
        });

    }

    // add sales person
    else if (text === '2') {
        // check is user is agent
        message = 'CON Enter sales agent name\n';
    }
    else if (length === 2 && txt[0] === '2') {
        message = 'CON Enter sales agent email';
    }
    else if (length === 3 && txt[0] === '2') {
        message = 'CON Enter Agent sales code';
    }
    else if (length === 4 && txt[0] === '2') {
        message = 'CON Enter agent location\n';
        message += 'eg. Kilimani';
    }
    else if (length === 5 && txt[0] === '2') {
        message = 'END Sales agent added';
        var options = text.split('*');

        db.Agent.create({
            name: options[1],
            primary_email: options[2],
            agent_sales_code: options[3],
            location: options[4],
            phone_number: phoneNumber
        }).then(function (agent) {
            console.log('agent person added', agent);
        });
    }


    else if (text === '3') {
        message = 'CON Enter device IMEI number';
    }
    else if (length === 2 && txt[0] === '3') {
        message = 'CON Enter your ID number';
    }
    else if (length === 3 && txt[0] === '3') {
        // check device authenticity
        var options = text.split('*');

        db.Device.findOne({
            where: { imei: options[1] }
        }).then(function (device) {
            console.log('device found -', device);
            message = 'END You have a genuine device';
        });

        message = 'END You do not have a genuine device';
    }


    else if (text === '4') {
        message = 'CON Enter Sales code';
    }
    else if (length === 2 && txt[0] === '4') {
        message = 'CON Enter Phone IMEI number';
    }
    else if (length === 3 && txt[0] === '4') {
        message = 'CON Enter Buyer ID number';
    }
    else if (length === 4 && txt[0] === '4') {
        message = 'CON Enter Buyer Name';
    }
    else if (length === 5 && txt[0] === '4') {
        message = 'CON Enter Buyer Phone number';
    }
    else if (length === 6 && txt[0] === '4') {
        message = 'END Device sold';
        var options = text.split('*');

        db.Sale.create({
            sales_code: options[1],
            imei: options[2],
            buyer_id: options[3],
            buyer_name: options[4],
            buyer_phone_number: options[5]
        }).then(function (sales) {
            console.log('sales added', sales);
        });

        db.Device.findOne({
            where: { imei: options[1] }
        }).then(function (device) {
            device.update({
                sold: 'true'
            }).then(function (device) {
                console.log('device marked as sold', device);
            });
        });
    }

    else {
        message = 'END Wrong input';
        // reply with menu
    }

    res.contentType('text/plain');
    res.status(200).send(message);
});


app.get("/url", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.listen(8383, () => {
    console.log("Server running on port 8383");
});