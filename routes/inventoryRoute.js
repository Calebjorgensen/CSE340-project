// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invModel = require('../models/inventory-model'); 


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to fetch a specific vehicle details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to get inventory as JSON for dynamic updates
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to present a view for editing an inventory item, based on the inventory
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryItem));

// Route to trigger an intentional 500 error
router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional 500 error triggered"));
});

// Route to render the management view
router.get('/', invController.renderManagementView);  // <-- Correct route for the management view

// Route to display Add Classification form
router.get("/add-classification", async (req, res) => {
    const nav = await utilities.getNav(); // Fetch the navigation data
    res.render("inventory/add-classification", {
      title: "Add Classification", 
      nav,  // Pass the nav data here
      messages: req.flash()
    });
  });
  

// Route to process the form submission for adding a classification
router.post("/add-classification", invController.addClassification);

router.get("/add-inventory", async (req, res) => {
  let classifications = await invModel.getClassifications(); // Get all classifications

  // Fetch the flash messages
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');

  // Fetch the navigation data
  const nav = await utilities.getNav();

  // Render the add-inventory view and pass data including nav
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    classifications, // Pass classifications to the view
    successMessage,  // Pass success message to the view
    errorMessage,    // Pass error message to the view
    nav              // Pass nav to the view for the layout
  });
});




// Route to handle the form submission for adding an inventory item
router.post("/add-inventory", invController.addInventory);



router.get("/add-inventory", utilities.checkInventoryAdmin, async (req, res) => {
  let classifications = await invModel.getClassifications();
  const nav = await utilities.getNav();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    classifications,
    nav,
    successMessage: req.flash("success"),
    errorMessage: req.flash("error")
  });
});

// Similarly protect POST routes for add/edit/delete operations:
router.post("/add-inventory", utilities.checkInventoryAdmin, utilities.handleErrors(invController.addInventory));





module.exports = router;
