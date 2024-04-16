const express = require("express")
const app = express()
const users = require("./routes/user.js")
const posts = require("./routes/post.js")
const session = require("express-session")
const flash = require("connect-flash")

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = ({
    secret: "secretstring",
    resave: false,
    saveUninitialized: true
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMessages = req.flash("success");
    res.locals.errorMessages = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let { name = "anonymous", age } = req.query;
    req.session.name = name;
    // req.flash("key", "this is a sample message")
    if (name === "anonymous") {
        req.flash("error", "some error")
    } else {
        req.flash("succcess", "success!")
    }
    // res.send(`Welcome ${name} your age is ${age}`);
    res.redirect("/hello");
})
app.get("/hello", (req, res) => {
    // res.send(`Hello ${req.session.name}`);
    // console.log(res.locals.messages)
    res.render("page.ejs", { name: req.session.name });
})

app.get("/test", (req, res) => {
    res.send("succesfull")
})
app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++
    } else {
        req.session.count = 1
    }
    res.send(`You have visited this page ${req.session.count} times`)
})

app.listen(2700, (req, res) => {
    console.log("Server is running on port 2700")
})