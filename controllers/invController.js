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

    //Create the HTML for the vehicle details using utility fucntion
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


module.exports = invCont