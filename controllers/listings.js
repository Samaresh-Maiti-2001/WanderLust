const Listing = require("../models/listing");
const maptilersdk = require("@maptiler/client");
let mapToken = process.env.MAP_TOKEN;
// Configure SDK
maptilersdk.config.apiKey = mapToken;
const { geocoding } = maptilersdk;

module.exports.createListing = async (req, res) => {
  const geoData = await geocoding.forward(req.body.location, {
    limit: 1,
  });
  if (!geoData.features.length) {
    req.flash("error", "Invalid location!");
    return res.redirect("/listings/new");
  }
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = geoData.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.listingIndex = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for  doesn't exits!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  let imageUrl = listing.image.url;
  imageUrl = imageUrl.replace("/upload", "/upload/h_300");
  res.render("listings/edit.ejs", { listing, imageUrl });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body);
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
