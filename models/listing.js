const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filenaame: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  filter: {
    type: String,
    enum: [
      "trending",
      "building",
      "skyline",
      "oasis",
      "bed",
      "nest",
      "vista",
      "forest",
      "water",
      "hotel",
      "sunset",
    ],
    required: true,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  const res = await Review.deleteMany({ _id: { $in: listing.reviews } });
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
