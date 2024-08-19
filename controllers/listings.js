const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.new = async (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.show = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    console.log(listing)
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist!")
        res.redirect("/")
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.create = async (req, res) => {
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    console.log(req.body)
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!")
    // res.redirect("/listings");
    res.redirect(`/listings/${newListing._id}`);
}

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist!")
        res.redirect("/")
    }
    res.render("listings/edit.ejs", { listing })
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", "Listing Updated Successfully!")
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!")
    res.redirect("/listings");
}