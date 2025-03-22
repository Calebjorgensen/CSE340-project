// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInventoryId);

//Route to get inventory as JSON for dynamic updates
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route to present a view for editing an inventory item, based on the inventory
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryItem));

module.exports = router;