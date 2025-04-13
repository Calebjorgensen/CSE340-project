CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  vehicle_id INT NOT NULL,
  account_id INT,  -- optional if you want to associate a review with a user
  review_text TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES inventory(inv_id)
);
-- This is how I build the table for reveiws.