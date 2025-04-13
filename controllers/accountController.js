const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // Fetch any flash messages stored under "notice"
  const notice = req.flash("notice");
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    notice,  // Pass the notice variable here
    account_email: "" 
  });
}





  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errorMessage: null,
        account_firstname: "",  // Provide default empty value
        account_lastname: "",
        account_email: ""
    });
  }
  


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  console.log("Received registration data:", {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  });

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice"),
      account_email: ""
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    // Pass the errorMessage here instead of locals.errorMessage
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errorMessage: "Registration failed. Please try again.", // Pass the errorMessage properly here
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}








/* ****************************************
 *  Process login request
 * ************************************ */
// Process Login
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Get the account details from the database
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email || "",
    });
  }

  try {
    // Compare password with the hashed password in the database
    const isMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (!isMatch) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: account_email || "",
      });
    }

    // Generate a JWT token
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
    }

    return res.redirect("/account/management");
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("notice", "An error occurred during login.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email || "",
    });
  }
}


async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    successMessage: req.flash("success"),
    errorMessage: req.flash("error")
  });
}


async function logout(req, res) {
  // Clear the JWT cookie to log the user out
  res.clearCookie("jwt");
  // Optionally, you can flash a message here
  req.flash("notice", "You have been logged out.");
  // Redirect the user to the home page (or login page)
  res.redirect("/");
}


async function buildUpdateView(req, res) {
  let nav = await utilities.getNav();
  // Get account details using the account ID from the URL parameter
  const accountData = await accountModel.getAccountById(req.params.id);
  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    successMessage: req.flash("success"),
    errorMessage: req.flash("error")
  });
}

async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  // Server-side validation could be applied here to check for unique email
  const updateResult = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email);

  if (updateResult) {
    req.flash("success", "Account information updated successfully.");
  } else {
    req.flash("error", "Failed to update account information.");
  }
  // Re-query account data after update
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData,
    successMessage: req.flash("success"),
    errorMessage: req.flash("error")
  });
}


async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, new_password } = req.body;

  // Validate the new password (server-side validation here)
  // If valid, hash the new password:
  const hashedPassword = await bcrypt.hash(new_password, 10);
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("success", "Password updated successfully.");
  } else {
    req.flash("error", "Failed to update password.");
  }
  // Re-query account data after update, then render account management view
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData,
    successMessage: req.flash("success"),
    errorMessage: req.flash("error")
  });
}



  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, logout, buildUpdateView, updateAccountInfo, updatePassword }
