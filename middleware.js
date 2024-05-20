module.exports.isLoggedIn = (req, res, next) =>{
    console.log(req.path, "...." ,req.originalUrl);
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Be Logged In To Create A Listing!")
        return res.redirect("/login")
    };
    next();
}


module.exports.saveRedirectUrl = (req, res, next) =>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}