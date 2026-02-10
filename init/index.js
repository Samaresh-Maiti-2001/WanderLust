const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

//constant variable.
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const port = 3000;

//mongodb connection.
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("mongodb connected successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "69845bfc490c1f4a4bde5eba",
  }));
  await Listing.insertMany(initData.data);
  console.log("Wanderlust was initialize successfully.");
};

initDb();
