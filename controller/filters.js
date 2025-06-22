const Listing = require("../models/listing.js");
const find = require("../middleware.js");

module.exports.trending = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.building = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.skyline = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.oasis = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.bed = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.nest = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.vista = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.forest = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.water = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.hotel = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.sunset = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ filter: search });
  find.isListing(allListings, req, res);
};

module.exports.searchlisting = async (req, res) => {
  const search = req.query.search;
  const allListings = await Listing.find({ country: search });
  if (allListings.length <= 0) {
    const allListings = await Listing.find({ location: search });
    return find.isListing(allListings, req, res);
  } else {
    return find.isListing(allListings, req, res);
  }
};
