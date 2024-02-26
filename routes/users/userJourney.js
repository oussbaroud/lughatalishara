const express = require('express');
const loggedIn = require('../../controllers/users/loggedInForUsers');
const { getUserJourney, deletePreviousCheckPoint, insertCheckPoint } = require('../../controllers/users/userJourney');
const router = express.Router();

router.get('/:category/:userId/get', loggedIn, getUserJourney);
router.delete('/:category/:userId/:sectionNumber/:unitNumber/delete', loggedIn, deletePreviousCheckPoint)
router.post('/:category/:userId/insert', loggedIn, insertCheckPoint);

module.exports = router;