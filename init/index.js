const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to the database");
    initDB();
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

// To delete previous data and insert new data
async function initDB() {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data has been initialized");
  } catch (error) {
    console.error("Error initializing data:", error);
  } finally {
    // Close the MongoDB connection after initializing data
    await mongoose.connection.close();
  }
}

