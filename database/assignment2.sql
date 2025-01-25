-- Data insert for table `account`
INSERT INTO "account" 
(account_firstname, account_lastname, account_email, account_password)
VALUES 
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update the account for Tony
UPDATE "account"
SET account_type = 'Admin'
WHERE account_id = 1;

-- Deleting Tony from the data
DELETE FROM "account"
WHERE account_id = 1;

-- Updating the inventory description for GM Hummer
UPDATE "inventory"
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;

-- Using a inner join to grab certain records.
SELECT i.inv_make, i.inv_model, c.classification_name AS classification_name
FROM "inventory" i
INNER JOIN "classification" c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--Update the inventory to put the world vehivles in the path
UPDATE "inventory"
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');