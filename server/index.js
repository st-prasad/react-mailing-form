//import path express cors
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const nodemailer = require('nodemailer');
//bodyParser middleware for parsing body of request to json format for nodemailer to use it as a body of email message
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
//app.use is a middleware function that is executed every time the app receives a request (app.get, app.post, etc.)
//app.use(bodyParser.json()); is a middleware function that parses the body of the request to json format for nodemailer to use it as a body of email message
app.use(bodyParser.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from Express!' })
});

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
//nodemailer function that sends email

contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Ready to Send');
    }
});

app.post('/api/contact', bodyParser.urlencoded({extended: false}) , (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
 
    const mail = {
        from: name,
        to: process.env.EMAIL,
        subject: 'Contact Form Submission',
        html: `<p>Name: ${name}</p>
                <p>Email is: ${email}</p>
                <p>Message: ${message}</p>`
    }

    //error - smtp error object of sendmail function of nodemailer
    contactEmail.sendMail(mail, (error, info) => {
        if (error) {
            res.json(error, {status: "error", responseCode: error.responseCode  });
        } else {
            res.json({ MessageId: info.messageId ,status: "success", info: info });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

