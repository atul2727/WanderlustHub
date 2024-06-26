const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js")
const { reviewSchema} = require("../schemas.js")
const Review = require("../models/review.js"); // Require the Review model
const Listing = require("../models/listing.js")
const {validateReview} = require("../middleware.js")



// Reviews
// POST
router.post("/",validateReview, wrapAsync(async (req, res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id)
    // let newReview = new Review(req.body.review)
    let newReview = new Review(req.body.review);

    // console.log(newReview)
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created Successfully!")
    res.redirect(`/listings/${listing._id}`);
}))

// DELETE
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted Successfully!")
    res.redirect(`/listings/${id}`);
}));

module.exports = router;