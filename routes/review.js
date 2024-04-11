const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utilities/wrapAsync.js")
const ExpressError = require("../utilities/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schemas.js")
const Review = require("../models/listing.js")
const Listing = require("../models/listing.js")

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log("Listing validation error:", error.message);
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}


// Reviews
// POST
router.post("/",validateReview, wrapAsync(async (req, res)=>{
    console.log(req.body);
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}))

// DELETE
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findById(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;