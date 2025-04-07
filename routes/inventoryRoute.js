// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to fetch a specific vehicle details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

//Route to get inventory as JSON for dynamic updates
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route to present a view for editing an inventory item, based on the inventory
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryItem));

router.get("/trigger-error", (req, res, next) => {
    next(new Error("Intentional 500 error triggered"));
})


router.get("/inventory/management", invController.buildManagementView);


// Route to display Add Classification form
router.get("/add-classification", (req, res) => {
    res.render("inventory/add-classification", { title: "Add Classification", messages: req.flash() });
});
// Route to process the form submission
router.post("/add-classification", invController.addClassification);



module.exports = router;