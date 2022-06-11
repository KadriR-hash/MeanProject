//import Mongoose
const mongoose = require('mongoose');

//generate schema
const platSchema = mongoose.Schema({

    platName : String,
    price : String,
    description : String,
    idChef : String

});

// generate model plat
const plat = mongoose.model("Plat", platSchema);

// export model
module.exports = plat;