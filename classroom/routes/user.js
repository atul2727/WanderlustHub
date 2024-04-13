const express = require("express")
const router = express.Router()

// Index- users
router.get("/", (req,res)=>{
    res.send("GET users");
})

// Show- users
router.get("/:id", (req, res)=>{
    res.send("GET user");
})

//Post- users
router.post("/uers", (req, res)=>{
    res.send("POST users");
})

// Delte- users
router.delete("/:id", (req, res)=>{
    res.send("DELETE users");
})

module.exports = router;