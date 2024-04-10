const express = require("express")
const app = express()
const port = 2700
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const path = require("path");
// const { connect } = require("http2")
const methodOverride = require('method-override');
const {listingSchema} = require("./schemas.js")
const {reviewSchema} = require("./schemas.js")

const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilities/wrapAsync.js")
const ExpressError = require("./utilities/ExpressError.js")

// After app has been defined
app.use(methodOverride('_method'));


const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"


main()
    .then(() => {
        console.log("Connected to the database")
    })
    .catch(err => console.log(err))


async function main() {
    await mongoose.connect(mongo_url);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Allows us to access data from forms in the request body
app.engine("ejs", ejsMate);


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


// INDEX
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

// NEW
app.get("/listings/new", wrapAsync (async(req, res) => {
    res.render("listings/new.ejs")
}))

// SHOW(READ)
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");
    res.render("listings/show.ejs", { listing })
}))

// CREATE
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);

// EDIT
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))

// UPDATE
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`);
}))

// DELETE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))




// Reviews
// POST
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}))

// DELETE
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findById(reviewId);
    res.redirect(`/listings/${id}`);
}));

// app.get("/testlisting", async (req, res) => {
//     try {
//         let sampleListing = new Listing({
//             title: "Test",
//             description: "Test",
//             image: "", // Replace with the actual image URL or path
//             price: 0,
//             location: "Test",
//             country: "Test"
//         });

//         await sampleListing.save();
//         console.log("Listing has been saved");
//         res.send("Listing has been saved");
//     } catch (error) {
//         console.error("Error saving listing:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

// express middleware
app.use((err, req, res, next) => {
    // res.send("Something went wrong");
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("listings/error.ejs", { err });
})

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
