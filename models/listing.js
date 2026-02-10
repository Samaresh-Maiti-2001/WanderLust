const mongoose = require("mongoose");
const User = require("./user");
const Review = require("./review");
const { required } = require("joi");
const Schema = mongoose.Schema;

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: Review,
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
