const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const defaultImage = "https://t3.ftcdn.net/jpg/03/45/05/92/240_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg";

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        type: String,
        required: true,
        default: "https://t3.ftcdn.net/jpg/03/45/05/92/240_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg",
        set : (v) => v === "" ? "https://t3.ftcdn.net/jpg/03/45/05/92/240_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg" : v  //if no value is passed in use the default image
        // default: defaultImage
    }, // Directly store the image URL
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;




// image:
// {
//     type: String,
//     required: true,
//     default: "https://stock.adobe.com/search/images?k=no%20image%20available",
//     set: (v) => v === ""  ? "https://stock.adobe.com/search/images?k=no%20image%20available" : v
// },