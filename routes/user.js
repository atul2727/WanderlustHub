const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerdeUser = await User.register(newUser, password)
        console.log(registerdeUser)
        req.login(registerdeUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "SignedUp")
            res.redirect("/listings")
        })
    } catch (error) {
        req.flash("error", error.message)
        return res.redirect("/signup")
    }
}))

router.get("/login", wrapAsync(async (req, res) => {
    res.render("users/login.ejs")
}))

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", `Welcome Back ${req.body.username}!`)
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}))

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged Out Successfully!")
        res.redirect("/listings")
    })
})

module.exports = router;