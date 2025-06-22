const User = require("../models/user");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const user = await User.register(newUser, password);
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "welcomento wondurlust!");
  res.redirect(res.locals.url);
  console.log(req.user);
};
