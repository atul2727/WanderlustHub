const express = require("express");
const router = express.Router();

const wrapAsync = require("../utilities/wrapAsync.js")
const ExpressError = require("../utilities/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schemas.js")
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js")
const session = require("express-session")
const flash = require("connect-flash")

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log("Listing validation error:", error.message);
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

// INDEX
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

// NEW
router.get("/new", isLoggedIn, wrapAsync (async(req, res) => {
    res.render("listings/new.ejs")
}))

// SHOW(READ)
router.get("/:id", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    console.log(listing)
    if (!listing){
        req.flash("error", "Requested Listing Does Not Exist!")
        res.redirect("/")
    }
    res.render("listings/show.ejs", { listing })
}))

// CREATE
router.post("/",validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    console.log(req.body)
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!")
    res.redirect("/listings");
})
);

// EDIT
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing){
        req.flash("error", "Requested Listing Does Not Exist!")
        res.redirect("/")
    }
    res.render("listings/edit.ejs", { listing })
}))

// UPDATE
router.put("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", "Listing Updated Successfully!")
    res.redirect(`/listings/${id}`);
}))

// DELETE
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!")
    res.redirect("/listings");
}))

module.exports = router;