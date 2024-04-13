const express = require("express")
const router = express.Router()

// Index- posts
router.get("/", (req,res)=>{
    res.send("GET posts");
})

// Show- posts
router.get("/:id", (req, res)=>{
    res.send("GET post");
})

//Post- posts
router.post("/", (req, res)=>{
    res.send("POST posts");
})

// Delte- posts
router.delete("/:id", (req, res)=>{
    res.send("DELETE posts");
})

module.exports = router;