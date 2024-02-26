const express = require('express');
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { 
    getAllSections
} = require('../../controllers/admins/manageSections');
const { 
    getTests, insertTest, deleteTest
} = require('../../controllers/admins/manageTests');
const { 
    getTestContent, insertTestContent, updateContent, deleteContent, fillContentsGap
} = require('../../controllers/admins/manageContents');

const router = express.Router();

router.get('/sections/get', getAllSections);

router.get('/section:sectionNumber/get', getTests);
router.post('/section:sectionNumber/insert', loggedIn, insertTest);
router.delete('/section:sectionNumber/delete/:unitNumber', loggedIn, deleteTest);

router.get('/section:sectionNumber/unit:unitNumber/get', getTestContent);
router.post('/section:sectionNumber/unit:unitNumber/insert', loggedIn, insertTestContent);
router.patch('/section:sectionNumber/unit:unitNumber/update/title/:contentId', loggedIn, updateContent);
router.delete('/section:sectionNumber/unit:unitNumber/delete/:contentId', loggedIn, deleteContent);
router.patch('/section:sectionNumber/unit:unitNumber/update/fillgap', loggedIn, fillContentsGap);

module.exports = router;