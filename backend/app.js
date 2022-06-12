//API

//import express
const express = require('express');


//import mongoose
const mongoose = require('mongoose');

// import model User
const User = require('./models/user');

// import model Plat
const Plat = require('./models/plat');

//import body-parser
const bodyParser = require('body-parser');

// import bcrypt
const bcrypt = require('bcrypt');

//import pdfKit
const fs = require('fs');
const PDFDocument = require('./pdfkit');

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

    User.findOne({ email: req.body.email }).then(
        (result) => {

            if (result) {
                res.status(200).json({ message: "USER ALREADY EXISTS" })
            } else {
                bcrypt.hash(req.body.password, 10).then(cryptedPassword => {
                    let user = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: cryptedPassword,
                        tel: req.body.tel,
                        role: req.body.role,
                        speciality: req.body.speciality,
                        experience: req.body.experience,
                        dateOfBirth: req.body.dateOfBirth
                    })

                    //save 
                    user.save();
                    //response
                    res.status(200).json({ message: "USER ADDED WITH SUCCESS" })
                })
            }
        })


})

// Business Logic :Get All User
app.get("/users", (req, res) => {

    console.log("HERE IN GET ALL USERS");

    User.find((err, docs) => {

        if (err) {
            console.log("ERROR IN DB");
        } else {
            res.status(200).json({
                users: docs
            })
        }
    })
})
// Business Logic :Get One User by id
app.get("/users/:id", (req, res) => {

    console.log("HERE IS GET USER BY ID");
    let userId = req.params.id;
    User.findOne({ _id: userId }).then(
        (doc) => {
            if (!doc) {
                console.log("ERROR");
            } else {
                res.status(200).json({
                    user: doc
                })
            }
        }


    )
})
// Business Logic :update user
app.put("/users/:id", (req, res) => {
    console.log("HERE IN UPDATE USER");
    bcrypt.hash(req.body.password, 10).then(cryptedPassword => {
        let user = {
            _id: req.body._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: cryptedPassword,
            tel: req.body.tel,
            role: req.body.role

        }

        User.updateOne({ _id: req.body._id }, user).then(
            (result) => {
                if (result) {
                    console.log(result);
                    res.status(200).json({
                        message: "USER UPDATED"
                    })
                }
            }

        )
    })
})
// Business Logic :delete user
app.delete("/users/:id", (req, res) => {

    console.log("HERE IN DELETE USER");
    let userId = req.params.id;


    Plat.deleteMany({ idChef: userId }).then(
        (result) => {
            if (result) {

                console.log("PLATS DELETED");

            }
        }
    )

    User.deleteOne({ _id: userId }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: "USER DELETED"
                })
            }
        }
    )

})

// Business Logic : get users by role
app.get("/users/role/:role", (req, res) => {
    console.log("HERE IS GET USER BY ROLE");
    let userRole = req.params.role;
    user.find({ role: userRole }).then(

        (docs) => {
            if (!docs) {
                console.log("ERROR");
            } else {
                res.status(200).json({
                    users: docs
                })
            }
        }


    )
})

// Business Logic : add plat
app.post("/plats", (req, res) => {
    console.log("HERE IN ADD PLAT");
    /*
    let plat = new Plat({
        platName :req.body.platName,
        price :req.body.price,
        description:req.body.description,
        idChef :req.body.idChef
    })
    User.findOne({_id : plat.idChef }).then(
        (result)=>{
            if (!result) {
                console.log(" CHEF INEXISTENT");
            } else {
                
                    Plat.findOne({platName : plat.platName }).then(
                        (result)=>{
                            if (result) {
                                res.status(200).json({message: "PLAT ALREADY EXISTS"})
                                console.log( "PLAT EXISTE DEJA");
                            } else {
                                plat.save()
                                res.status(200).json({message: "PLAT ADDED WITH SUCCESS"})
                            }
                    }
                )
            }
        }
    */
    Plat.findOne({ platName: req.body.platName, idChef: req.body.idChef }).then(
        (doc) => {
            if (!doc) {

                console.log("CE PLAT NEXISTE PAS");
                let plat = new Plat({
                    platName: req.body.platName,
                    price: req.body.price,
                    description: req.body.description,
                    idChef: req.body.idChef
                })
                plat.save()
                res.status(200).json({ message: "PLAT ADDED WITH SUCCESS" })

            } else {
                res.status(200).json({ message: "PLAT ALREADY EXISTS" })
            }

        }
    )



})
// Business Logic : get plats
app.get("/plats/:chefId", (req, res) => {
    console.log("HERE IS GET PLAT BY CHEF ID");
    let chefid = req.params.chefId;
    Plat.findOne({ chefId: chefid }).then(
        (doc) => {
            if (!doc) {
                console.log("ERROR");
            } else {
                res.status(200).json({
                    plat: doc
                })
            }
        })

})

// Business Logic : get all  plats
app.get("/plats", (req, res) => {
    console.log("HERE IN GET ALL PLATS");
    Plat.find((err, docs) => {
        if (err) {
            console.log("ERROR");
        } else {
            res.status(200).json({
                plats: docs
            })
        }
    })
})

// Business Logic : update plats
app.put("/plats/:id", (req, res) => {

    console.log("HERE IN UPDATE PLAT");
    let plat = {
        _id: req.body._idplatName,
        platName: req.body.platName,
        price: req.body.price,
        description: req.body.description,
        chefId: req.body.chefId,
    }

    Plat.updateOne({ _id: req.params.id }, plat).then(

        (result) => {
            if (result) {
                res.status(200).json({
                    message: "PLAT UPDATED"
                })
            }
        }
    )
})

// Business Logic : remove plats
app.delete("/plats/:id", (req, res) => {
    console.log("HERE IN DELETE PLAT BY ID ");
    let platId = req.params.id;
    Plat.deleteOne({ _id: platId }).then(

        (result) => {
            if (result) {
                res.status(200).json({
                    message: "PLAT DELETED"
                })
            }
        }
    )
})

// LOGIN
app.post("/login", (req, res) => {
    console.log("Here in login", req.body);
    User.findOne({ email: req.body.email }).then(
        (resultEmail) => {
            console.log("resultEmail", resultEmail);
            if (!resultEmail) {
                res.status(200).json({
                    message: "Wrong Email"
                });
            }
            return bcrypt.compare(req.body.password, resultEmail.password);
        })
        .then(
            (resultPwd) => {
                console.log("resultPwd", resultPwd);
                if (!resultPwd) {
                    res.status(200).json({
                        message: "Wrong password"
                    });
                }
                else {
                    User.findOne({ email: req.body.email }).then(
                        (result) => {
                            console.log("result", result);
                            let userToSend = {
                                _id: result._id,
                                firstName: result.firstName,
                                lastName: result.lastName,
                                email: result.email,
                                role: result.role,
                            }
                            res.status(200).json({
                                message: "SUCCESS",
                                connectedUser: userToSend //result gives all the info !!!
                            })
                        }
                    )
                }
            })
});

//GENERATE PDF
app.get("/generatePDF", (req, res) => {

    User.find((err, docs) => {
        if (err) {
            console.log("ERROR");
        } else {
            // Create The PDF document
            const doc = new PDFDocument();
            // Pipe the PDF into a user's file
            doc.pipe(fs.createWriteStream(`backend/pdfs/test.pdf`));
            // Add the header - https://pspdfkit.com/blog/2019/generate-invoices pdfkit-node/
            doc
                .image("backend/images/logo.png", 50, 45, { width: 50 })
                .fillColor("#444444").fontSize(20).text("Here All Users", 110, 57).fontSize(10)
                .text("Imm Yasmine Tower", 200, 65, { align: "right" })
                .text("Centre Urbain Nord", 200, 80, { align: "right" }).moveDown();
            // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
            const table = {
                headers: [
                    "FirstName",
                    "LastName",
                    "Email Address",
                    "Phone",
                ],
                rows: [],
            };
            // Add the users to the table
            for (const user of docs) {
                table.rows.push([
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.tel,
                ]);
            }
            // Draw the table
            doc.moveDown().table(table, 10, 125, { width: 590 }); // Finalize the PDF and end the stream
            doc.end();

            res.status(200).json({
                message: "HERE PDF (success)",
            });
        }
    });
});

//export app
module.exports = app;