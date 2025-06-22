const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const mongoose = require("mongoose");
const axios = require("axios");

module.exports.allIndex = async (req, res) => {
  const allListings = await Listing.find({});

  // api call for all listing

  // for (listing of allListings) {
  //   const geoResponse = await axios.get(
  //     "https://nominatim.openstreetmap.org/search",
  //     {
  //       params: {
  //         q: listing.location + "," + listing.country,
  //         format: "geojson",
  //       },
  //       headers: { "User-Agent": "MyApp" },
  //     }
  //   );

  //   let coordinates = geoResponse.data.features[0].geometry;
  //   listing.geometry = coordinates;
  //   await listing.save();
  // }

  res.render("listings/index.ejs", { allListings });
};

module.exports.showListing = async (req, res, next) => {
  if (
    mongoose.Types.ObjectId.isValid(req.params.id) &&
    /^[0-9a-fA-F]{24}$/.test(req.params.id)
  ) {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: "author" })
      .populate("owner");
    let lat = listing.geometry.coordinates[0];
    let lon = listing.geometry.coordinates[1];
    if (!listing) {
      req.flash("error", "listing not found!");
      res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing, coordinates: { lat, lon } });
  } else {
    return next(new expressError(404, "page not found"));
  }
};

module.exports.createListing = async (req, res, next) => {
  const location = req.finalListing.location;
  const country = req.finalListing.country;
  const geoResponse = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: { q: location + "," + country, format: "geojson" },
      headers: { "User-Agent": "MyApp" },
    }
  );

  if (
    geoResponse.data &&
    geoResponse.data.features &&
    geoResponse.data.features.length > 0
  ) {
    let coordinates = geoResponse.data.features[0].geometry;

    const newListing = new Listing(req.finalListing);
    newListing.geometry = coordinates;
    newListing.owner = res.locals.currUser._id;
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
    await newListing.save();
    console.log("new listing", newListing);
    req.flash("success", "new listing added!");
    return res.redirect("/listings");
  } else {
    req.flash("error", "enter valid country or location");
    return res.redirect("/listings/new");
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing not found!");
    res.redirect("/listings");
  }

  let listingImageUrl = listing.image.url.replace(
    "upload/",
    "upload/c_fill,g_auto/q_50/f_auto/"
  );
  res.render("listings/edit.ejs", { listing, listingImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const trimListing = req.finalListing;
  let { id } = req.params;
  const oldListing = await Listing.findById(id);
  let {
    location: oldLocation,
    country: oldCountry,
    geometry: oldGeometry,
  } = oldListing;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...trimListing },
    { new: true }
  );

  let newLocation = trimListing.location;
  let nweCountry = trimListing.country;
  if (oldLocation !== newLocation || oldCountry !== nweCountry) {
    let geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: newLocation + "," + nweCountry, format: "geojson" },
        headers: { "User-Agent": "MyApp" },
      }
    );

    if (
      geoResponse.data &&
      geoResponse.data.features &&
      geoResponse.data.features.length > 0
    ) {
      listing.geometry = geoResponse.data.features[0].geometry;
      await listing.save();
    } else {
      listing.location = oldLocation;
      await listing.save();
      req.flash("error", "enter valid country or location!");
      return res.redirect(`/listings/${req.params.id}/edit`);
    }
  }
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing updatetd!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("deleted listing", deletedListing);
  req.flash("success", "listing deleted!");
  res.redirect("/listings");
};
