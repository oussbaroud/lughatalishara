const express = require('express');
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { 
    getAllSections, insertSection, updateSectionTitle, updateSectionsOrder, deleteSection, fillSectionsGap,
} = require('../../controllers/admins/manageSections');
const { 
    getAllUnits, getUnits, insertUnit, updateUnitTitle, updateUnitsOrder, deleteUnit, fillUnitsGap,
} = require('../../controllers/admins/manageUnits');
const { 
    getAllLevels, getLevels, insertLevel, updateLevelTitle, updateLevelsOrder, deleteLevel, fillLevelsGap,
} = require('../../controllers/admins/manageLevels');
const { 
    getAllLessons, getLessons, getNextLesson, insertLesson, updateLessonTitle, updateLessonsOrder, deleteLesson, fillLessonsGap, 
} = require('../../controllers/admins/manageLessons');
const {  
    getAllContents, getContents, insertContent, updateContent, updateContentsOrder, deleteContent, fillContentsGap, 
} = require('../../controllers/admins/manageContents');

const router = express.Router();


router.get('/sections/get', getAllSections);
router.post('/sections/insert', loggedIn, insertSection);
router.patch('/sections/update/title/:sectionId', loggedIn, updateSectionTitle);
router.patch('/sections/update/order', loggedIn, updateSectionsOrder);
router.delete('/sections/delete/:sectionNumber', loggedIn, deleteSection);
router.patch('/sections/update/fillgap', loggedIn, fillSectionsGap);

router.get('/units/get', getAllUnits);
router.get('/section:sectionNumber/get', getUnits);
router.post('/section:sectionNumber/insert', loggedIn, insertUnit);
router.patch('/section:sectionNumber/update/title/:unitId', loggedIn, updateUnitTitle);
router.patch('/section:sectionNumber/update/order', loggedIn, updateUnitsOrder);
router.delete('/section:sectionNumber/delete/:unitNumber', loggedIn, deleteUnit);
router.patch('/section:sectionNumber/update/fillgap', loggedIn, fillUnitsGap);

router.get('/levels/get', getAllLevels);
router.get('/section:sectionNumber/unit:unitNumber/get', getLevels);
router.post('/section:sectionNumber/unit:unitNumber/insert', loggedIn, insertLevel);
router.patch('/section:sectionNumber/unit:unitNumber/update/title/:levelId', loggedIn, updateLevelTitle);
router.patch('/section:sectionNumber/unit:unitNumber/update/order', loggedIn, updateLevelsOrder);
router.delete('/section:sectionNumber/unit:unitNumber/delete/:levelNumber', loggedIn, deleteLevel);
router.patch('/section:sectionNumber/unit:unitNumber/update/fillgap', loggedIn, fillLevelsGap);

router.get('/lessons/get', getAllLessons);
router.get('/section:sectionNumber/unit:unitNumber/level:levelNumber/get', getLessons);
router.get('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/:from/getnext', getNextLesson);
router.post('/section:sectionNumber/unit:unitNumber/level:levelNumber/insert', loggedIn, insertLesson);
router.patch('/section:sectionNumber/unit:unitNumber/level:levelNumber/update/title/:lessonId', loggedIn, updateLessonTitle);
router.patch('/section:sectionNumber/unit:unitNumber/level:levelNumber/update/order', loggedIn, updateLessonsOrder);
router.delete('/section:sectionNumber/unit:unitNumber/level:levelNumber/delete/:lessonNumber', loggedIn, deleteLesson);
router.patch('/section:sectionNumber/unit:unitNumber/level:levelNumber/update/fillgap', loggedIn, fillLessonsGap);

router.get('/:content/:position/get', getAllContents);
router.get('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/get', getContents);
router.post('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/insert', loggedIn, insertContent);
router.patch('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/update/title/:contentId', loggedIn, updateContent);
router.patch('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/update/order', loggedIn, updateContentsOrder);
router.delete('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/delete/:contentId', loggedIn, deleteContent);
router.patch('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/update/fillgap', loggedIn, fillContentsGap);

module.exports = router;