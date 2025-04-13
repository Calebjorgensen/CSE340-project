/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require('./database/');
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const utilities = require("./utilities");
const flash = require('connect-flash');

// Set up session
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Set up flash message middleware
app.use(flash());

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine (e.g., EJS, Pug)
app.set('view engine', 'ejs');

/* ***********************
 * Middleware
 ************************/
app.use(cookieParser());
app.use(utilities.checkJWTToken);

// Express Messages Middleware
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("error", {
    title: "Error",
    message: err.message || "Something went wrong",
    status: err.status || 500,
  });
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Account routes
app.use("/account", require("./routes/accountRoute"));

// Inventory routes
app.use("/inv", inventoryRoute);


// Review Route
app.use("/reviews", require("./routes/reviewRoute"));


// Index route
app.get("/", baseController.buildHome);

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
