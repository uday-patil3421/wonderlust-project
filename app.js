const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./listingSchema.js");
const Review = require("./models/review.js");
const listintRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const filtersRouter = require("./routes/filters.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO STORE", error);
});

const sessionOpn = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOpn), (req, res, next) => {
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.session());
app.use(passport.initialize());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  res.locals.redirectUrl = req.originalUrl;
  next();
});

app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listintRouter);
app.use("/", userRouter);
app.use("/filters", filtersRouter);

app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found"));
});

//middleware

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "some" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(3030, () => {
  console.log("server is listening to port 3030");
});
