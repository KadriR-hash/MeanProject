//API
//import express
const express = require('express');


//import mongoose
const mongoose = require('mongoose');

// import model User
const User = require('./models/user');

//import body-parser
const bodyParser = require('body-parser');


//create express app
const app = express();


//config body parser
// Configuration
// Send JSON responses
app.use(bodyParser.json());
// Parse Request Objects
app.use(bodyParser.urlencoded({ extended: true }));

// Security configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, X-Requested-with, Authorization, expiresIn"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS, PATCH, PUT"
    );
    next();
});

//Connect to database
mongoose.connect('mongodb://localhost:27017/Mean', { useNewUrlParser: true, useUnifiedTopology: true });

// Business Logic : Add User
app.post("/users", (req, res) => {
    console.log("HERE IN ADD USER");
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        tel: req.body.tel
    })

    //save 
    user.save();

    //response
    res.status(200).json({
        message: "USER ADDED WITH SUCCESS"
    })

});



//export app
module.exports = app;