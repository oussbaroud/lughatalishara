const express = require('express');
const loggedInForAdmins = require('../controllers/loggedinforadmins');
const { getSections, getUnits, getLevels, getLessons, getContent } = require('../controllers/managelessons');

const router = express.Router();


router.get('/sections/get', getSections);
router.get('/?section=:sectionNumber/get', getUnits);
router.get('/?section=:sectionNumber/?unit=:unitNumber/get', getLevels);
router.get('/?section=:sectionNumber/?unit=:unitNumber/?level=:levelNumber/get', getLessons);
router.get('/?section=:sectionNumber/?unit=:unitNumber/?level=:levelNumber/?lesson=:lessonNumber/get', getContent);

module.exports = router;