const { listingSchema, reviewSchema } = require("./listingSchema.js");
const expressError = require("./utils/expressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const axios = require("axios");

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "please login to wondurlust");
    return res.redirect("/login");
  }
  next();
};
module.exports.urlRedirect = (req, res, next) => {
  req.session.url = req.originalUrl;
  next();
};

module.exports.validatReview = async (req, res, next) => {
  const result = reviewSchema.validate(req.body.review);
  if (result.error) {
    req.flash("error", `${result.error.message}`);
    return res.redirect(`${req.body.redirectUrl}`);
  } else {
    req.finalReview = result.value;
    return next();
  }
};

module.exports.validateListing = async (req, res, next) => {
  const result = listingSchema.validate(req.body.listing);
  // console.log("new listinggggg", result.value.listing);
  if (result.error) {
    req.flash("error", `${result.error.message}`);
    return res.redirect(`${req.body.originalUrl}`);
  } else {
    req.finalListing = result.value;
    return next();
  }
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (res.locals.currUser && !res.locals.currUser._id.equals(listing.owner)) {
    req.flash("error", "you are not owner of this listing!");
    return res.redirect(`/listings/${listing.id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewsId } = req.params;
  const review = await Review.findById(reviewsId);
  if (res.locals.currUser && !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not author!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isListing = (allListings, req, res) => {
  if (allListings.length <= 0) {
    return res.render("listings/noFilter.ejs");
  }
  return res.render("listings/index.ejs", { allListings });
};
