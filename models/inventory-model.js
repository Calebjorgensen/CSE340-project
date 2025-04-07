const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById,insertClassification, };
