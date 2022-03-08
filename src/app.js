const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");

const Register = require("./modules/register");
const { json } = require("express");
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

app.get("/", (req, res) => {
  res.render("index");
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
  res.send("hello from the other side");
});

app.listen(port, () => {
  console.log("connection sucessful");
});

// app.listen(port,()=>{

// })
