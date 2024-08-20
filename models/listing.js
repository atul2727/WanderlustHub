const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const reviewSchema = mongoose.Schema;
const Review = require("./review")

const defaultImage = "https://t3.ftcdn.net/jpg/03/45/05/92/240_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg";

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        url: String,
        filename: String,
    }, // Directly store the image URL
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing){
        await Review.deleteMany({ _id : {$in: listing.review} });
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;




// image:
// {
//     type: String,
//     required: true,
//     default: "https://stock.adobe.com/search/images?k=no%20image%20available",
//     set: (v) => v === ""  ? "https://stock.adobe.com/search/images?k=no%20image%20available" : v
// },