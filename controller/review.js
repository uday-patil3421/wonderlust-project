const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.newReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.finalReview);
  newReview.author = res.locals.currUser._id;
  listing.reviews.push(newReview);
  await newReview.save();
  console.log(newReview);
  await listing.save();
  req.flash("success", "review added!");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewsId } = req.params;
  const listing = await Listing.findById(id);
  await Review.findByIdAndDelete(reviewsId);
  listing.reviews.pull(reviewsId);
  await listing.save();
  req.flash("success", "review deleted!");
  res.redirect(`/listings/${id}`);
};
