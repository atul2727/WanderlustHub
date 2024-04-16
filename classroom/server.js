const express = require("express")
const app = express()
const users = require("./routes/user.js")
const posts = require("./routes/post.js")
const session = require("express-session")
const sessionOptions = ({
    secret: "secretstring",
    resave: false,
    saveUninitialized: true
})

app.use(session(sessionOptions));

app.get("/register", (req, res)=>{
    let {name = "Anonymous", age} = req.query;
    req.session.name = name;
    // res.send(`Welcome ${name} your age is ${age}`);
    res.redirect("/hello");
})
app.get("/hello", (req,res)=>{
    res.send(`Hello ${req.session.name}`);
})

app.get("/test", (req, res) => {
    res.send("succesfull")
})
app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count ++
    } else {
        req.session.count = 1 
    }
    res.send(`You have visited this page ${req.session.count} times`)
})

app.listen(2700, (req, res) => {
    console.log("Server is running on port 2700")
})