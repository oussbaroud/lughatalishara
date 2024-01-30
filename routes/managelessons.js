const express = require('express');
const loggedInForAdmins = require('../controllers/loggedinforadmins');
const { getAllSections, insertSection, updateSectionTitle, updateSectionsOrder, deleteSection, fillSectionsGap,
    getAllUnits, getUnits, insertUnit, updateUnitTitle, updateUnitsOrder, deleteUnit, fillUnitsGap,
    getAllLevels, getLevels, insertLevel, updateLevelTitle, updateLevelsOrder, deleteLevel, fillLevelsGap,
    getAllLessons, getLessons, insertLesson, updateLessonTitle, updateLessonsOrder, deleteLesson, fillLessonsGap, 
    getAllContents, getContents, insertContent, updateContent, updateContentsOrder, deleteContent, fillContentsGap } = require('../controllers/managelessons');

const router = express.Router();


router.get('/sections/get', getAllSections);
router.post('/sections/insert', insertSection);
router.patch('/sections/update/title/:sectionId', updateSectionTitle);
router.patch('/sections/update/order', updateSectionsOrder);
router.delete('/sections/delete/:sectionId/:deleteThis', deleteSection);
router.patch('/sections/update/fillgap', fillSectionsGap);

router.get('/units/get', getAllUnits);
router.get('/section:sectionId/get', getUnits);
router.post('/section:sectionId/insert', insertUnit);
router.patch('/section:sectionId/update/title/:unitId', updateUnitTitle);
router.patch('/section:sectionId/update/order', updateUnitsOrder);
router.delete('/section:sectionId/delete/:unitId/:deleteThis', deleteUnit);
router.patch('/section:sectionId/update/fillgap/:updateThis', fillUnitsGap);

router.get('/levels/get', getAllLevels);
router.get('/section:sectionId/unit:unitId/get', getLevels);
router.post('/section:sectionId/unit:unitId/insert', insertLevel);
router.patch('/section:sectionId/unit:unitId/update/title/:levelId', updateLevelTitle);
router.patch('/section:sectionId/unit:unitId/update/order', updateLevelsOrder);
router.delete('/section:sectionId/unit:unitId/delete/:levelId/:deleteThis', deleteLevel);
router.patch('/section:sectionId/unit:unitId/update/fillgap/:updateThis', fillLevelsGap);

router.get('/lessons/get', getAllLessons);
router.get('/section:sectionId/unit:unitId/level:levelId/get', getLessons);
router.post('/section:sectionId/unit:unitId/level:levelId/insert', insertLesson);
router.patch('/section:sectionId/unit:unitId/level:levelId/update/title/:lessonId', updateLessonTitle);
router.patch('/section:sectionId/unit:unitId/level:levelId/update/order', updateLessonsOrder);
router.delete('/section:sectionId/unit:unitId/level:levelId/delete/:lessonId/:deleteThis', deleteLesson);
router.patch('/section:sectionId/unit:unitId/level:levelId/update/fillgap/:updateThis', fillLessonsGap);

router.get('/:content/:position/get', getAllContents);
router.get('/section:sectionId/unit:unitId/level:levelId/lesson:lessonId/get', getContents);
router.post('/section:sectionId/unit:unitId/level:levelId/lesson:lessonId/insert', insertContent);
router.patch('/section:sectionId/unit:unitId/level:levelId/lesson:lessonId/update/title/:contentId', updateContent);
router.patch('/section:sectionId/unit:unitId/level:levelId/lesson:lessonId/update/order', updateContentsOrder);
router.delete('/section:sectionId/unit:unitId/level:levelId/lesson:lessonId/delete/:contentId/:deleteThis', deleteContent);
router.patch('/section:sectionId/unit:unitId/level:levelId/lesson:lessonId/update/fillgap/:updateThis', fillContentsGap);

module.exports = router;