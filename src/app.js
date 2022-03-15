require('dotenv').config();
const bcrybt=require("bcryptjs")
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const jwt=require('jsonwebtoken')
const cookie=require('cookie-parser')
const auth=require('./middleware/auth')

require("./db/conn");

const Register = require("./modules/register");
const { json } = require("express");
app.use(cookie())
const async = require("hbs/lib/async");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
// console.log(static_path);

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);

const port = process.env.PORT || 8000;

console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/secret",auth, (req, res) => {
  // console.log(` this is cookie ${req.cookies.jwt}`);

  res.render("secret");
});
app.get("/register", (req, res) => {
  res.render("register");
});
// registration from
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.Confirmpassword;
    if (password === cpassword) {
      const registerStudent = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        Confirmpassword: req.body.Confirmpassword,
      })
      // concept of middle ware
        const token=await registerStudent.generateAuthToken()
        res.cookie("jwt",token,
        {
          expires:new Date(Date.now()+30000),
          httpOnly:true
        });
        

      const result=await registerStudent.save()
      res.status(200).render("index");
    } else {
      res.send("Password is not matched");
    }

  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
  
});

// login Check 

app.post("/login", async(req, res) => {
    try {
        const email=req.body.email;
        const password=req.body.password;
      const userEmail= await Register.findOne({email:email})
      const isMatch= await bcrybt.compare(password,userEmail.password)
      const token=await userEmail.generateAuthToken()
      console.log("token of login is"+token)
      res.cookie("jwt",token,
        {
          expires:new Date(Date.now()+300000),
          httpOnly:true,
          secure:true
        });

      if(isMatch){
          res.status(201).render("index")
      }
      else{
          res.send("Invelid login details")
      }  
      

    } catch (error) {
        res.status(400).send("Invelid login detailso");
        
    }
    
  });

  app.get("/logout",auth,async(req,res)=>{
    try {
// single device logout
        // req.user.tokens=req.user.tokens.filter((currentelem)=>{
        //   return currentelem.token !=req.token

        // })

        //multiple device logout
        req.user.tokens=[];

      res.clearCookie("jwt");
      console.log("logut ");
      await req.user.save()
      res.render("login")
      
    } catch (error) {
      res.status(500).send(error)
      
    }
  })


// const securePassword= async(password)=>{
//     const passwordHash=await bcrybt.hash(password,12);
//     const passwordMatch=await bcrybt.compare(password,passwordHash);
//     console.log(passwordMatch);

// }
// securePassword("hazari@123");

// const jwt=require('jsonwebtoken')
// const createToken= async ()=>{
    // jwt.sign({_id:""},"sz")
// }



// createToken()






app.listen(port, () => {
  console.log("connection sucessful");
});

// app.listen(port,()=>{

// })



