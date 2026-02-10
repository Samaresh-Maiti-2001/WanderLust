const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  listingIndex,
  renderNewForm,
  showListing,
  createListing,
  updateListing,
  destroyListing,
  renderEditForm,
} = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

// New route – form to create listing
router.get("/new", isLoggedIn, renderNewForm);

//index and new post listing route
router
  .route("/")
  .get(wrapAsync(listingIndex))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(createListing)
  );

//show, update and delete listing route
router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

// Edit route – show edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
