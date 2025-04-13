// Needed Resoures
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build account by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  [...regValidate.registationRules()],  // spread into individual middleware functions
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

  // Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )



  
router.get(
  "/management",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
);


// Add a GET route for logout
router.get("/logout", utilities.handleErrors(accountController.logout));


// Route to display the account update view
router.get(
  "/update/:id",
  utilities.checkLogin,  // Ensure user is logged in
  utilities.handleErrors(accountController.buildUpdateView)
);

// Route to process the account update form (personal information)
router.post(
  "/update-info",
  utilities.checkLogin,
  /* Add validation middleware here, e.g., updateRules() and checkUpdateData */
  utilities.handleErrors(accountController.updateAccountInfo)
);

// Route to process the password change form
router.post(
  "/change-password",
  utilities.checkLogin,
  /* Add validation middleware here, e.g., passwordUpdateRules() and checkPasswordData */
  utilities.handleErrors(accountController.updatePassword)
);



module.exports = router;
