const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport")

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerdeUser = await User.register(newUser, password)
        console.log(registerdeUser)
        req.flash("success", "SignedUp")
    } catch (error) {
        req.flash("error", error.message)
        return res.redirect("/signup")
    }
}))

router.get("/login", wrapAsync(async (req, res) => {
    res.render("users/login.ejs")
}))

router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", `Welcome Back ${req.body.username}!`)
    res.redirect("/listings")
}))

module.exports = router;