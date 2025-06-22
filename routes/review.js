const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../listingSchema.js");
const Review = require("../models/review.js");
const controller = require("../controller/review.js");
const {
  urlRedirect,
  isLogedIn,
  validatReview,
  isAuthor,
} = require("../middleware.js");

router.post("/", isLogedIn, validatReview, wrapAsync(controller.newReview));

//review delete
router.delete(
  "/:reviewsId",
  isLogedIn,
  urlRedirect,
  isAuthor,
  wrapAsync(controller.destroyReview)
);

module.exports = router;
