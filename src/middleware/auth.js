const async = require('hbs/lib/async');
const jwt=require('jsonwebtoken');
const Register=require('../modules/register');


const auth= async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
        console.log(verifyUser);
        const user= await Register.findOne({_id:verifyUser._id})  
        console.log(user.firstname);

        // log out \xxx
        req.token=token;
        req.user=user;
        next()
        
    } catch (error) {
        res.status(404).send(error)
        
    }
}

module.exports=auth;