const bcrypt = require('bcryptjs/dist/bcrypt');
const async = require('hbs/lib/async');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const res = require('express/lib/response');

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
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
// generating  of token 

employeeSchema.methods.generateAuthToken= async function(){
    try {
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await  this.save()
        return token;
        
        
    } catch (error) {
        res.send("occured error is"+error)
    }
}

employeeSchema.pre("save", async function(next){
    // const passwordHash=await bcrypt.hash(password,12);
    if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password,12)
     this.Confirmpassword= await bcrypt.hash(this.Confirmpassword,12)
    }
     next()
}
)


const Register=new mongoose.model("Register",employeeSchema)

// we need to create collection 
module.exports=Register;