const express = require('express');
const loggedInForAdmins = require('../controllers/loggedinforadmins');
const { getUserJourney } = require('../controllers/userJourney');
const router = express.Router();

router.get('/user:userId/journey/get', getUserJourney);

module.exports = router;