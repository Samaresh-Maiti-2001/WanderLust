if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import core packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const usersRoute = require("./routes/user.js");

// Initialize app
const app = express();

// Constants
const MONGO_URL = process.env.MONGO_URL;
const PORT = 3000;

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log(err);
  }
}
connectDB();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in mongostore.");
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root.");
});

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", usersRoute);

//page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//Error handeling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Internal Server Error" } = err;
  res.status(status).render("error.ejs", { err });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
