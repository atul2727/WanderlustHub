const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

app.use(cookieParser("secret code"))

app.get("/signedcookies", (req, res)=>{
    res.cookie("signedname","atul", {signed: true})
    res.send("signed cookie set")
})

app.get("/verify", (req, res)=>{
    console.log(req.cookies)            // unsigned cookies
    console.log(req.signedCookies)      // signed cookies
    res.send(req.signedCookies)
})

app.get("/getcookies",(req,res)=>{
    res.cookie("name","atul")
    res.cookie("name2","arun")
    res.send("cookies set")
})

app.get("/greet",(req,res)=>{
    let {name = "user"} = req.cookies;
    res.send(`Hello ${name}`)
})

app.get("/", (req, res)=>{
    console.dir(req.cookies)
    res.send("I am root");
})

const users = require("./routes/user.js")
const posts = require("./routes/post.js") 

app.use("/", users)
app.use("/", posts)



app.get("/", (req, res)=>{
    res.send("I am root");
})


app.listen(2700,(req,res)=>{
    console.log("Server is running on port 2700")
})