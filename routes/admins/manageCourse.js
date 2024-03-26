// Imporing Express
const express = require('express');

// Importing Functions
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { 
    getAllCurriculums, insertCurriculum, updateCurriculumTitle, updateCurriculumReleased, getCurriculumReleased, getCurriculum,
} = require('../../controllers/admins/manageCurriculums');
const { 
    getSections, insertSection, updateSectionTitle, updateSectionsOrder, deleteSection, fillSectionsGap,
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

// Declaring Router
const router = express.Router();

// Express Methods
router.get('/curriculums/get', getAllCurriculums);
router.get('/curriculums:releaseDate/get', getCurriculum);
router.get('/curriculum:curriculumVersion/getReleased', getCurriculumReleased);
router.post('/curriculums/insert', loggedIn, insertCurriculum);
router.patch('/curriculums/update/title/:curriculumVersion', [loggedIn, getCurriculumReleased], updateCurriculumTitle);
router.patch('/curriculums/update/released/:curriculumVersion', [loggedIn, getCurriculumReleased], updateCurriculumReleased);

router.get('/curriculum:curriculumVersion/get', getSections);
router.post('/curriculum:curriculumVersion/insert', [loggedIn, getCurriculumReleased], insertSection);
router.patch('/curriculum:curriculumVersion/update/title/:sectionId', [loggedIn, getCurriculumReleased], updateSectionTitle);
router.patch('/curriculum:curriculumVersion/update/order', [loggedIn, getCurriculumReleased], updateSectionsOrder);
router.delete('/curriculum:curriculumVersion/delete/:sectionNumber', [loggedIn, getCurriculumReleased], deleteSection);
router.patch('/curriculum:curriculumVersion/update/fillgap', [loggedIn, getCurriculumReleased], fillSectionsGap);

router.get('/units/get', getAllUnits);
router.get('/curriculum:curriculumVersion/section:sectionNumber/get', getUnits);
router.post('/curriculum:curriculumVersion/section:sectionNumber/insert', [loggedIn, getCurriculumReleased], insertUnit);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/update/title/:unitId', [loggedIn, getCurriculumReleased], updateUnitTitle);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/update/order', [loggedIn, getCurriculumReleased], updateUnitsOrder);
router.delete('/curriculum:curriculumVersion/section:sectionNumber/delete/:unitNumber', [loggedIn, getCurriculumReleased], deleteUnit);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/update/fillgap', [loggedIn, getCurriculumReleased], fillUnitsGap);

router.get('/levels/get', getAllLevels);
router.get('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/get', getLevels);
router.post('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/insert', [loggedIn, getCurriculumReleased], insertLevel);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/update/title/:levelId', [loggedIn, getCurriculumReleased], updateLevelTitle);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/update/order', [loggedIn, getCurriculumReleased], updateLevelsOrder);
router.delete('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/delete/:levelNumber', [loggedIn, getCurriculumReleased], deleteLevel);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/update/fillgap', [loggedIn, getCurriculumReleased], fillLevelsGap);

router.get('/lessons/get', getAllLessons);
router.get('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/get', getLessons);
router.get('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/:from/getnext', getNextLesson);
router.post('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/insert', [loggedIn, getCurriculumReleased], insertLesson);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/update/title/:lessonId', [loggedIn, getCurriculumReleased], updateLessonTitle);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/update/order', [loggedIn, getCurriculumReleased], updateLessonsOrder);
router.delete('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/delete/:lessonNumber', [loggedIn, getCurriculumReleased], deleteLesson);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/update/fillgap', [loggedIn, getCurriculumReleased], fillLessonsGap);

router.get('/curriculum:curriculumVersion/:content/:position/get', getAllContents);
router.get('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/get', getContents);
router.post('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/insert', [loggedIn, getCurriculumReleased], insertContent);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/update/content/:contentId', [loggedIn, getCurriculumReleased], updateContent);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/update/order', [loggedIn, getCurriculumReleased], updateContentsOrder);
router.delete('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/delete/:contentId', [loggedIn, getCurriculumReleased], deleteContent);
router.patch('/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber/update/fillgap', [loggedIn, getCurriculumReleased], fillContentsGap);

// Exporting Router
module.exports = router;