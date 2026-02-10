const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  renderSignupForm,
  postSignupForm,
  renderLoginForm,
  postLoginForm,
  getLogout,
} = require("../controllers/users");

const passportAuthentication = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
});

router.route("/signup").get(renderSignupForm).post(wrapAsync(postSignupForm));

router
  .route("/login")
  .get(renderLoginForm)
  .post(saveRedirectUrl, passportAuthentication, postLoginForm);

router.get("/logout", getLogout);

module.exports = router;
