const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignupForm = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    let newUser = new User({
      username,
      email,
    });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLoginForm = async (req, res) => {
  req.flash("success", "User Login Successfully!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout successfully!");
    res.redirect("/listings");
  });
};
