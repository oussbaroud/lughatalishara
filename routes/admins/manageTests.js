// Imporing Express
const express = require('express');

// Importing Functions
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { 
    getAllCurriculums, updateCurriculumTitle, getCurriculumReleased
} = require('../../controllers/admins/manageCurriculums');
const { 
    getSections, updateSectionTitle
} = require('../../controllers/admins/manageSections');
const { 
    getTests, getTest, insertTest, deleteTest
} = require('../../controllers/admins/manageTests');
const { 
    getTestContent, insertTestContent, updateContent, deleteContent, fillContentsGap
} = require('../../controllers/admins/manageContents');

// Declaring Router
const router = express.Router();

// Express Methods
router.get('/curriculums/get', getAllCurriculums);
router.get('/curriculum:curriculumVersion/getReleased', getCurriculumReleased);
router.patch('/curriculums/update/title/:curriculumVersion', [loggedIn, getCurriculumReleased], updateCurriculumTitle);

router.get('/curriculum:curriculumVersion/get', getSections);
router.patch('/curriculum:curriculumVersion/update/title/:sectionId', [loggedIn, getCurriculumReleased], updateSectionTitle);

router.get('/curriculum:curriculumVersion/section:sectionNumber/get', getTests);
router.post('/curriculum:curriculumVersion/section:sectionNumber/insert', [loggedIn, getCurriculumReleased], insertTest);
router.delete('/curriculum:curriculumVersion/section:sectionNumber/delete/:unitNumber', [loggedIn, getCurriculumReleased], deleteTest);

router.get('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/getthis', getTest);
router.get('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/get', getTestContent);
router.post('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/insert', [loggedIn, getCurriculumReleased], insertTestContent);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/update/content/:contentId', [loggedIn, getCurriculumReleased], updateContent);
router.delete('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/delete/:contentId', [loggedIn, getCurriculumReleased], deleteContent);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/update/fillgap', [loggedIn, getCurriculumReleased], fillContentsGap);

// Exporting Router
module.exports = router;