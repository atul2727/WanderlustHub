const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js")
const { reviewSchema} = require("../schemas.js")
const Review = require("../models/review.js"); // Require the Review model
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js")

// Reviews
// POST
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;