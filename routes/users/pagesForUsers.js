// Imporing Express
const express = require('express');

// Importing LoggedIn Function
const loggedIn = require('../../controllers/users/loggedInForUsers');

// Declaring Router
const router = express.Router();

// Rendering Pages
router.get('/', loggedIn, (request, response) => {
    if (request.user) {
        response.redirect('/learn');
    } else {
        response.render('users/homeForVisitors', { title: 'الرئيسية', home: 'page-active', css: ['visitors.css', 'main.css'], js: ['users/addNavBorder.js', 'preventScroll.js'], statusVisitor: 'true' })
    }
})
router.get('/login', loggedIn, (request, response) => {
    if (request.user) {
        response.redirect('/learn');
    } else {
        response.render('users/loginForUsers', { title: 'تسجيل الدخول', css: ['visitors.css', 'main.css'], js: ['users/loginForUsers.js', 'preventScroll.js'], statusVisitor: 'true' })
    }
})
router.get('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/play', { layout: 'plain', title: 'درس', play: 'page-active', css: ['play.css', 'main.css'], js: ['users/play.js', 'loadingScreen.js'], status: "loggedIn", userId: request.userId, userRegDate: request.userRegDate })
    } else {
        response.redirect('/');    }
})
router.get('/section:sectionNumber/test', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/play', { layout: 'plain', title: 'إختبار', play: 'page-active', css: ['play.css', 'main.css'], js: ['users/play.js', 'loadingScreen.js'], status: "loggedIn", userId: request.userId, userRegDate: request.userRegDate })
    } else {
        response.redirect('/');    }
})
router.get('/section:sectionNumber/unit:unitNumber/test', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/play', { layout: 'plain', title: 'إختبار', play: 'page-active', css: ['play.css', 'main.css'], js: ['users/play.js', 'loadingScreen.js'], status: "loggedIn", userId: request.userId, userRegDate: request.userRegDate })
    } else {
        response.redirect('/');    }
})
router.get('/letters', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/letters', { title: 'الحروف', letters: 'page-active', css: ['users.css', 'main.css'], js: ['users/tranletters.js', 'pagination.js', 'preventScroll.js'], status: "loggedIn", user: request.user })
    } else {
        response.render('users/letters', { title: 'الحروف', letters: 'page-active', css: ['visitors.css', 'main.css'], js: ['users/addNavBorder.js', 'users/tranletters.js', 'pagination.js', 'preventScroll.js'], statusVisitor: 'true' })
    }
})
router.get('/dictionary', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/dictionary', { title: 'القاموس', dictionary: 'page-active', css: ['users.css', 'main.css'], js: ['users/tranwords.js', 'users/sortbyletters.js', 'pagination.js', 'preventScroll.js', 'loadingScreen.js'], status: "loggedIn", user: request.user })
    } else {
        response.render('users/dictionary', { title: 'القاموس', dictionary: 'page-active', statusVisitor: 'true', css: ['visitors.css', 'main.css'], js: ['users/addNavBorder.js', 'users/tranwords.js', 'users/sortbyletters.js', 'pagination.js', 'preventScroll.js', 'loadingScreen.js'] })
    }
})

router.get('/register', loggedIn, (request, response) => {
    if (request.user) {
        response.redirect('/learn');
    } else {
        response.render('users/registerForUsers', { title: 'أنشئ حسابا', css: ['visitors.css', 'main.css'], js: ['users/registerForUsers.js', 'preventScroll.js'], statusVisitor: 'true' })
    }
})
router.get('/learn', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/learn', { title: 'تعلم', learn: 'page-active', css: ['users.css', 'main.css'], js: ['users/learn.js', 'preventScroll.js'], status: "loggedIn", userId: request.userId, userRegDate: request.userRegDate })
    } else {
        response.redirect('/');
    }
})
router.get('/sections', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/sections', { title: 'الوحدات', learn: 'page-active', css: ['users.css', 'main.css'], js: ['users/sections.js', 'preventScroll.js'], status: "loggedIn", userId: request.userId, userRegDate: request.userRegDate })
    } else {
        response.redirect('/');
    }
})
router.get('/section:sectionNumber', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/learn', { title: 'تعلم', learn: 'page-active', css: ['users.css', 'main.css'], js: ['users/learn.js', 'preventScroll.js'], status: "loggedIn", userId: request.userId, userRegDate: request.userRegDate })
    } else {
        response.redirect('/');
    }
})
router.get('/leaderboard', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/leaderboard', { title: 'لوحة المتصدرين', leaderboard: 'page-active', css: ['users.css', 'main.css'], js: ['preventScroll.js'], status: "loggedIn", user: request.user })
    } else {
        response.redirect('/');
    }
})
router.get('/quests', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/quests', { title: 'المسابقات', quests: 'page-active', css: ['users.css', 'main.css'], js: ['preventScroll.js'], status: "loggedIn", user: request.user })
    } else {
        response.redirect('/');
    }
})
router.get('/profile', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/profile', { title: 'الحساب', profile: 'page-active', css: ['users.css', 'main.css'], js: ['preventScroll.js'], status: "loggedIn", user: request.user })
    } else {
        response.redirect('/');
    }
})
router.get('/settings', loggedIn, (request, response) => {
    if (request.user) {
        response.render('users/settings', { title: 'الإعدادات', settings: 'page-active', css: ['users.css', 'main.css'], js: ['preventScroll.js'], status: "loggedIn", user: request.user })
    } else {
        response.redirect('/');
    }
})

// Exporting Router
module.exports = router;