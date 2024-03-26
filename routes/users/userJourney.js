// Imporing Express
const express = require('express');

// Importing LoggedIn Function
const loggedIn = require('../../controllers/users/loggedInForUsers');
const { getUserJourney, deletePreviousCheckPoint, insertCheckPoint } = require('../../controllers/users/userJourney');

// Declaring Router
const router = express.Router();

// Express Methods
router.get('/:category/:userId/get', loggedIn, getUserJourney);
router.delete('/:category/:userId/:sectionNumber/:unitNumber/delete', loggedIn, deletePreviousCheckPoint)
router.post('/:category/:userId/insert', loggedIn, insertCheckPoint);

// Exporting Router
module.exports = router;