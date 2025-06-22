const express = require("express");
const router = express.Router({ mergeParams: true });
const filter = require("../controller/filters.js");
// search request
router.post("/", (req, res) => {
  let search = req.body.findListing.trim();
  if (!search || search == "") {
    req.flash("error", "please search something!");
    return res.redirect("/listings");
  } else {
    return res.redirect(`/filters/${search}?search=${search}`);
  }
});
router.get("/trending", filter.trending);
router.get("/building", filter.building);
router.get("/skyline", filter.skyline);
router.get("/oasis", filter.oasis);
router.get("/bed", filter.bed);
router.get("/nest", filter.nest);
router.get("/vista", filter.vista);
router.get("/forest", filter.forest);
router.get("/water", filter.water);
router.get("/hotel", filter.hotel);
router.get("/sunset", filter.sunset);
router.get("*", filter.searchlisting);
router.all("*", (req, res) => {
  req.flash("error", "no such listing find!");
  res.redirect("/listings");
});

module.exports = router;
