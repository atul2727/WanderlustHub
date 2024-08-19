const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schemas.js");

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

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings'); // Redirect to a safe fallback
        }

        if (!res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
            req.flash("error", "Permission denied");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        req.flash("error", "Something went wrong");
        return res.redirect('/listings');
    }
}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log("Listing validation error:", error.message);
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}



module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // console.log("Review validation error:", error.message); // Update log message
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}



module.exports.isReviewAuthor = async (req, res, next) => {
    // try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review.author.equals(res.locals.currentUser._id)) {
            req.flash("error", "You are not the author of this review.");
            return res.redirect(`/listings/${id}`); // Redirect to a safe fallback
        }
        next();

    //     if (!res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
    //         req.flash("error", "Permission denied");
    //         return res.redirect(`/listings/${id}`);
    //     }
    //     next();
    // } catch (error) {
    //     console.error("Error in isOwner middleware:", error);
    //     req.flash("error", "Something went wrong");
    //     return res.redirect('/listings');
    // }
}