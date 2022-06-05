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

// Send JSON responses
app.use(bodyParser.json());// response : format JSON
// Parse Request Objects
app.use(bodyParser.urlencoded({ extended: true }));// permet parcour des body

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
    //collect data from req body
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        tel: req.body.tel,
        role : req.body.role    })

    //save 
    user.save();

    //response
    res.status(200).json({
        message: "USER ADDED WITH SUCCESS"
    })

});

// Business Logic :Get All User
app.get("/users",(req,res)=>{

    console.log("HERE IN GET ALL USERS");

    User.find((err,docs)=>{
            
        if (err) {
            console.log("ERROR IN DB");
        } else {
            res.status(200).json({
                users : docs
            })
        }
    })
})
// Business Logic :Get One User by id
app.get("/users/:id",(req,res)=>{

    console.log("HERE IS GET USER BY ID");
    let userId = req.params.id;
    User.findOne({_id : userId}).then(
        (doc)=>{
            if (!doc) {
                console.log("ERROR");
            } else {
                res.status(200).json({
                    user : doc
                })
            }
        }


    )
})
// Business Logic :update user
app.put("/users/:id",(req,res)=>{

    console.log("HERE IN UPDATE USER");

    let user ={
        _id : req.body._id,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        tel : req.body.tel,
        role : req.body.role,
        
    }

    User.updateOne({_id : req.body._id},user).then(
        (result)=>{
            if (result) {
                console.log(result);
                res.status(200).json({
                    message : "USER UPDATED"
                })
            }
        }

    )
})
// Business Logic :delete user
app.delete("/users/:id",(req,res)=>{

    console.log("HERE IN DELETE USER");

    let userId = req.params.id;
    User.deleteOne({_id : userId}).then(
        (result)=>{
            if (result) {
                res.status(200).json({
                    message : "USER DELETED"
                })
            }
        }
    )
})


//export app
module.exports = app;