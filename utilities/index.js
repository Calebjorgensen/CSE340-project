const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
    // Fetch classifications data from the model
    let data = await invModel.getClassifications();

    // Log the data to ensure it's being returned properly
    console.log("Classifications Data:", data);

    // Check if data is an array and contains elements
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No classifications available");
    }

    // Construct the navigation HTML list
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    // Loop through the classifications and add them to the nav
    data.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });

    list += "</ul>";

    return list;
  } catch (error) {
    // Log the error and pass it to the next middleware
    console.error("Error in getNav:", error);
    next(error); // Pass error to error-handling middleware
  }
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



// Build the vehicle detail view HTML
Util.buildVehicleDetailHTML = function (vehicle) {
  // Format price and mileage with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(vehicle.inv_price);

  const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_mileage);

  // Build the HTML string for the vehicle detail view
  let html = `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h1>
        <p><strong>Price:</strong> ${formattedPrice}</p>
        <p><strong>Mileage:</strong> ${formattedMileage} miles</p>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      </div>
    </div>
  `;

  return html;
};



/* **************************************
 * Handle Errors Middleware Function
 ************************************** */
Util.handleErrors = (fn) => {
  return async (req, res, next) => {
      try {
          await fn(req, res, next);
      } catch (err) {
          console.error("Error in handleErrors middleware:", err);
          next(err);
      }
  };
};



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }
 


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }




module.exports = Util