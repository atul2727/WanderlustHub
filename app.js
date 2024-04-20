const express = require("express")
const app = express()
const port = 2700
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const path = require("path");
// const { connect } = require("http2")
const methodOverride = require('method-override');
const {listingSchema, reviewSchema} = require("./schemas.js")

const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilities/wrapAsync.js")
const ExpressError = require("./utilities/ExpressError.js")

// After app has been defined
app.use(methodOverride('_method'));

const listing = require("./routes/listing.js");
// const review = require("./routes/listing.js");

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

app.use("/listings", listing);
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
