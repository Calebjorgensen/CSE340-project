// models/review-model.js
const pool = require("../database/");

async function addReview(vehicle_id, account_id, review_text, rating) {
  try {
    const sql = `
      INSERT INTO reviews (vehicle_id, account_id, review_text, rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(sql, [vehicle_id, account_id, review_text, rating]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

async function getReviewsByVehicle(vehicle_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname
      FROM reviews r
      LEFT JOIN account a ON r.account_id = a.account_id
      WHERE vehicle_id = $1
      ORDER BY review_date DESC;
    `;
    const result = await pool.query(sql, [vehicle_id]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

module.exports = { addReview, getReviewsByVehicle };
