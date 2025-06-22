const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { urlRedirect } = require("../middleware");
const controller = require("../controller/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post("/signup", wrapAsync(controller.registerUser));

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
  console.log(req.user);
});

router.post(
  "/login",
  (req, res, next) => {
    res.locals.url = req.session.url || "/listings";
    next();
  },
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(controller.loginUser)
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "logOuted!");
    res.redirect("/listings");
  });
});

module.exports = router;
