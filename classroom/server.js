const express = require("express")
const app = express()

app.listen(2700,(req,res)=>{
    console.log("Server is running on port 2700")
})

const users = require("./routes/user.js")
const posts = require("./routes/post.js") 

app.use("/", users)
app.use("/", posts)



app.get("/", (req, res)=>{
    res.send("I am root");
})