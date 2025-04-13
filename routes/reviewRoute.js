// routes/reviewRoute.js
const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");

// A GET route to display reviews for a vehicle (this might also be integrated into your inventory detail route)
router.get("/vehicle/:vehicleId", utilities.handleErrors(reviewController.displayReviews));

// A POST route to submit a review
router.post("/", utilities.handleErrors(reviewController.submitReview));

module.exports = router;
