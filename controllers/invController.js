const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    //Get the vehicle data by inv_id
    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();
    const vehicleDetailsHTML = utilities.buildVehicleDetailHTML(vehicle);

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleDetailsHTML
    });
  } catch (error) {
    next(error);
  }
};


/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();

  // Create a select list for classifications
  const classificationSelect = await utilities.buildClassificationList();

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect, // Pass the select list to the view
  });
};



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


exports.showManagementView = (req, res) => {
  res.render("inventory/management", { messages: req.flash() });
};


exports.showAddClassification = (req, res) => {
  res.render("inventory/add-classification", { messages: req.flash() });
};

exports.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  const validationRegex = /^[a-zA-Z0-9]+$/;
  
  if (!validationRegex.test(classification_name)) {
      req.flash("error", "Invalid classification name.");
      return res.redirect("/inv/add-classification");
  }

  try {
      await invModel.insertClassification(classification_name);
      req.flash("success", "Classification added successfully!");
      return res.redirect("/inv/");
  } catch (error) {
      req.flash("error", "Error adding classification.");
      return res.redirect("/inv/add-classification");
  }
};





/* ***************************
 *  Process New Classification Form
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  if (!/^[a-zA-Z0-9_-]+$/.test(classification_name)) {
    req.flash("error", "Classification name must not contain spaces or special characters.");
    return res.redirect("/inventory/add-classification");
  }

  try {
    await invModel.insertClassification(classification_name);
    req.flash("success", "Classification added successfully.");
    res.redirect("/inventory/management");
  } catch (error) {
    req.flash("error", "Error adding classification.");
    res.redirect("/inventory/add-classification");
  }
};



module.exports = invCont