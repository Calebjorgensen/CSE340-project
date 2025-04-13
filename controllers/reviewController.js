// controllers/reviewController.js
const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

async function displayReviews(req, res) {
  try {
    const vehicle_id = req.params.vehicleId;
    // Get reviews for the given vehicle_id
    const reviews = await reviewModel.getReviewsByVehicle(vehicle_id);
    let nav = await utilities.getNav();
    res.render("reviews", {  // or integrate into vehicle detail view
      title: "Reviews",
      nav,
      vehicle_id,
      reviews,
      errorMessage: null,
      notice: req.flash("notice"),
    });
  } catch (error) {
    console.error("Error displaying reviews:", error);
    res.status(500).render("error", { message: "Failed to display reviews." });
  }
}

async function submitReview(req, res) {
  try {
    const { vehicle_id, review_text, rating } = req.body;
    // Optionally, retrieve account_id from res.locals.accountData (if user is logged in)
    const account_id = res.locals.accountData ? res.locals.accountData.account_id : null;
    const newReview = await reviewModel.addReview(vehicle_id, account_id, review_text, rating);
    req.flash("notice", "Review submitted successfully.");
    res.redirect(`/inv/detail/${vehicle_id}`); // Redirect back to vehicle details
  } catch (error) {
    console.error("Error submitting review:", error);
    req.flash("notice", "Failed to submit review.");
    res.redirect("back");
  }
}

module.exports = { displayReviews, submitReview };
