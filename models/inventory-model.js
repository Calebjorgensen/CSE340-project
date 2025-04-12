const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  const result = await pool.query("SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name");
  return result.rows; // Ensure to return only the rows, which is an array of objects
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
    throw error
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
      const sql = "SELECT * FROM inventory WHERE inv_id = $1";
      const result = await pool.query(sql, [inv_id]);
      return result.rows[0]; 
  } catch (error) {
      console.error("Error fetching vehicle details:", error);
      throw new Error("Database error retrieving vehicle details.");
  }
}

/* ***************************
 *  Insert a new classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const query = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(query, [classification_name]);
    return result.rows[0]; // Return inserted classification
  } catch (error) {
    console.error("Error inserting classification:", error);
    throw new Error("Database error inserting classification.");
  }
}



/* ***************************
 *  Insert a new inventory item
 * ************************** */
async function insertInventory(
  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
  inv_price, inv_miles, inv_color, classification_id
) {
  try {
    const query = `
      INSERT INTO public.inventory (
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
        inv_price, inv_miles, inv_color, classification_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

    const result = await pool.query(query, [
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color, classification_id
    ]);
    
    return result.rows[0]; // Return the inserted inventory item
  } catch (error) {
    console.error("Error inserting inventory:", error);
    throw new Error("Database error inserting inventory.");
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById,insertClassification, insertInventory };
