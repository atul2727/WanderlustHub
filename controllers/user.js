const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");

module.exports.signup = async (req, res) => {
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
}

module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", `Welcome Back ${req.body.username}!`)
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged Out Successfully!")
        res.redirect("/listings")
    })
}