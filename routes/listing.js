const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const session = require("express-session")
const flash = require("connect-flash")

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

const listingController = require("../controllers/listings.js")

// INDEX
router.get(
    "/",
    wrapAsync(listingController.index)
)

// NEW
router.get(
    "/new",
    isLoggedIn,
    wrapAsync(listingController.new)
)

// SHOW(READ)
router.get(
    "/:id",
    wrapAsync(listingController.show)
)

// CREATE
router.post(
    "/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.create)
);


// EDIT
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.edit)
)

// UPDATE
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    // validateListing,
    wrapAsync(listingController.update)
)

// DELETE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.delete)
)

module.exports = router;
