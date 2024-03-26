// Imporing Express
const express = require('express');

// Importing LoggedIn Function
const loggedIn = require('../../controllers/admins/loggedInForAdmins');

// Declaring Router
const router = express.Router();

// Rendering Pages
router.get('', loggedIn, (request, response) => {
    if (request.user && request.stats) {
        response.render('admins/homeforadmins', { title: 'الإحصائيات', stats: 'page-active', statusAdmin: 'true', statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['preventScroll.js'] });
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/rotatescreen', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/rotatescreen', { title: 'أدر جهازك', statusAdmin: 'true', statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/dictionary', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/managedictionary', { title: 'القاموس', manageDictionary: 'page-active', statusAdmin: 'true', statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/manageDictionary.js', 'pagination.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/letters', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/manageletters', { title: 'الحروف', manageLetters: 'page-active', statusAdmin: 'true', statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/manageletters.js', 'pagination.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/course/curriculums', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageCurriculums: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managecourse.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/course/curriculum:curriculumVersion', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageSections: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managecourse.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/course/curriculum:curriculumVersion/section:sectionNumber', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageUnits: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managecourse.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/course/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageLevels: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managecourse.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/course/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageLessons: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managecourse.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/course/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageContents: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managecourse.js', 'preventScroll.js', 'admins/rotatescreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/tests/curriculums', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/manageTests', { title: 'الإختبارات', manageTests: 'page-active', manageCurriculums: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managetests.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/tests/curriculum:curriculumVersion', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/manageTests', { title: 'الإختبارات', manageTests: 'page-active', manageSections: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managetests.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/tests/curriculum:curriculumVersion/section:sectionNumber', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/manageTests', { title: 'الإختبارات', manageTests: 'page-active', tests: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managetests.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/tests/curriculum:curriculumVersion/section:sectionNumber/unit:unitNumber', loggedIn, (request, response) => {
    if (request.user && request.content) {
        response.render('admins/manageTests', { title: 'الإختبارات', manageTests: 'page-active', manageContents: 'true', statusAdmin: "true", statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/managetests.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})
router.get('/admins', loggedIn, (request, response) => {
    if (request.user && request.fullAccess) {
        response.render('admins/manageadmins', { title: 'المشرفين', manageAdmins: 'page-active', statusAdmin: 'true', statsAccess: request.stats, contentAccess: request.content, fullAccess: request.fullAccess, css: ['admins.css', 'main.css'], js: ['admins/manageadmins.js', 'pagination.js', 'preventScroll.js', 'admins/rotateScreen.js'] })
    } else {
        response.redirect('/manage/login');
    }
})

router.get('/login', loggedIn, (request, response) => {
    if (request.user) {
        if ( request.fullAccess || request.stats) {
            response.redirect('/manage');
        } else {
            response.redirect('/manage/letters');
        }
    } else {
        response.render('admins/loginforadmins', { title: 'تسجيل الدخول', statusVisitor: 'true', css: ['main.css', 'visitors.css'], js: ['admins/loginforadmins.js', 'preventScroll.js'] })
    }
})

// Exporting Router
module.exports = router;