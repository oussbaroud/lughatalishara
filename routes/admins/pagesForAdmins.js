const express = require('express');
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const router = express.Router();

// Rendering Pages
router.get('', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/homeforadmins', { title: 'الرئيسية', home: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['users.css'], js: [''] });
    }else{
        response.redirect('/login');
    }
})
router.get('/dictionary', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managedictionary', { title: 'القاموس', manageDictionary: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/manageDictionary.js', 'admins/pagifortables.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/letters', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/manageletters', { title: 'الحروف', manageLetters: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/manageletters.js', 'admins/pagifortables.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/course/sections', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageSections: 'true', statusAdmin: "true", fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/course/section:sectionNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageUnits: 'true', statusAdmin: "true", fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/course/section:sectionNumber/unit:unitNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageLevels: 'true', statusAdmin: "true", fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/course/section:sectionNumber/unit:unitNumber/level:levelNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageLessons: 'true', statusAdmin: "true", fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/course/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الدروس', manageCourse: 'page-active', manageContents: 'true', statusAdmin: "true", fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/tests/sections', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الإختبارات', manageTests: 'page-active', manageSections: 'true', statusAdmin: "true", fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/tests/section:sectionNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الإختبارات', manageTests: 'page-active', tests: 'true', statusAdmin: "true", css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/tests/section:sectionNumber/unit:unitNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('admins/managecourse', { title: 'الإختبارات', manageTests: 'page-active', manageContents: 'true', statusAdmin: "true", css: ['users.css'], js: ['admins/managecourse.js'] })
    }else{
        response.redirect('/login');
    }
})
router.get('/admins', loggedIn, (request, response) => {
    if(request.user && request.fullAccess){
        response.render('admins/manageadmins', { title: 'المشرفين', manageAdmins: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['users.css'], js: ['admins/manageadmins.js', 'admins/pagifortables.js'] })
    }else{
        response.redirect('/login');
    }
})

router.get('/login', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('');
    }else{
        response.render('admins/loginforadmins', { title: 'تسجيل الدخول', statusVisitor: 'true', css: ['visitors.css'], js: ['admins/loginforadmins.js'] })
    }
})

module.exports = router;