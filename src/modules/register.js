const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        min: 2

    },
    lastname: {
        type: String,

    },
    email: {
        type: String,
        unique: true,
        required: true,

    },
    gender: {
        type: String,
        required: true
    },
    phone:{
        type:Number,
        unique:true,
        required:true

    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Confirmpassword:{
        type:String,
        required:true
    }
})

const Register=new mongoose.model("Register",employeeSchema)

// we need to create collection 
module.exports=Register;