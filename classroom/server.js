const express = require("express")
const app = express()
const users = require("./routes/user.js")
const posts = require("./routes/post.js") 
const session = require("express-session")

app.use(session({ secret: "secretstring"}));

app.get("/test", (req,res)=>{
    res.send("succesfull")
})

app.listen(2700,(req,res)=>{
    console.log("Server is running on port 2700")
})