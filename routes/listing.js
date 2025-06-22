const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const controller = require("../controller/listing.js");
require("dotenv").config();
const { storage } = require("../cloudinaryConfig.js");
const {
  urlRedirect,
  isLogedIn,
  validateListing,
  listingSchema,
  isOwner,
} = require("../middleware.js");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const multer = require("multer");
const upload = multer({ storage });

//Index Route
router.get("/", wrapAsync(controller.allIndex));

//New Route
router.get("/new", urlRedirect, isLogedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", urlRedirect, isLogedIn, wrapAsync(controller.showListing));

//Create Route
router.post(
  "/",
  isLogedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(controller.createListing)
);

//Edit Route
router.get(
  "/:id/edit",
  urlRedirect,
  isLogedIn,
  isOwner,
  wrapAsync(controller.editListing)
);

//Update Route
router.put(
  "/:id",
  isLogedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(controller.updateListing)
);

//Delete Route
router.delete(
  "/:id",
  urlRedirect,
  isLogedIn,
  isOwner,
  wrapAsync(controller.destroyListing)
);

module.exports = router;
