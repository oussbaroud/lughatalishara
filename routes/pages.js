const express = require('express');
const loggedIn = require('../controllers/loggedin');
const loggedInForAdmins = require('../controllers/loggedinforadmins');
const router = express.Router();

// Rendering Pages
router.get('/', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('index', { title: 'الرئيسية', home: 'page-active', css: ['styleforvisitors.css'], js: [''], statusVisitor: 'true' })
    }
})
router.get('/section:sectionId/unit:unitId/level:levelId/lesson:lessonId', loggedIn, (request, response) => {
    if(request.user){
        response.render('lesson', { layout: 'plain', title: 'الحروف', letters: 'page-active', css: ['styleforlesson.css'], js: ['selectingwords.js'], status: "loggedIn", user: request.user })
    }else{
        response.render('index', { title: 'الرئيسية', home: 'page-active', css: ['styleforvisitors.css'], js: [''], statusVisitor: 'true' })
    }
})
router.get('/letters', loggedIn, (request, response) => {
    if(request.user){
        response.render('letters', { title: 'الحروف', letters: 'page-active', css: ['styleforusers.css'], js: ['scroll.js', 'styleheader.js', 'tranletters.js', 'pagiforletters.js'], status: "loggedIn", user: request.user })
    }else{
        response.render('letters', { title: 'الحروف', letters: 'page-active', css: ['styleforvisitors.css'], js: ['tranletters.js', 'pagiforletters.js'], statusVisitor: 'true' })
    }
})
router.get('/dictionary', loggedIn, (request, response) => {
    if(request.user){
        response.render('dictionary', { title: 'القاموس', dictionary: 'page-active', css: ['styleforusers.css'], js: ['scroll.js', 'styleheader.js', 'tranwords.js', 'sortbyletters.js', 'pagiforwords.js'], status: "loggedIn", user: request.user })
    }else{
        response.render('dictionary', { title: 'القاموس', dictionary: 'page-active', statusVisitor: 'true', css: ['styleforvisitors.css'], js: ['tranwords.js', 'sortbyletters.js', 'pagiforwords.js'] })
    }
})
router.get('/manage', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('homeforadmins', { title: 'الرئيسية', home: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['styleforusers.css'], js: [''] });
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/dictionary', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('managewords', { title: 'القاموس', manageWords: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['styleforusers.css'], js: ['managewords.js', 'pagifortable.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/letters', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('manageletters', { title: 'الحروف', manageLetters: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['styleforusers.css'], js: ['manageletters.js', 'pagifortable.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/sections', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('managesections', { title: 'الدروس', manageCourse: 'page-active', manageSections: 'true', statusAdmin: "true", fullAccess: request.fullAccess, css: ['styleforusers.css'], js: ['manageunits.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/section:sectionId', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('managesections', { title: 'الدروس', manageCourse: 'page-active', manageUnits: 'true', statusAdmin: "true", css: ['styleforusers.css'], js: ['manageunits.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/section:sectionId/unit:unitId', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('managesections', { title: 'الدروس', manageCourse: 'page-active', manageLevels: 'true', statusAdmin: "true", css: ['styleforusers.css'], js: ['manageunits.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/section:sectionId/unit:unitId/level:levelId', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('managesections', { title: 'الدروس', manageCourse: 'page-active', manageLessons: 'true', statusAdmin: "true", css: ['styleforusers.css'], js: ['manageunits.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/section:sectionId/unit:unitId/level:levelId/lesson:lessonId', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.render('managesections', { title: 'الدروس', manageCourse: 'page-active', manageContents: 'true', statusAdmin: "true", css: ['styleforusers.css'], js: ['manageunits.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/manage/admins', loggedInForAdmins, (request, response) => {
    if(request.user && request.fullAccess){
        response.render('manageadmins', { title: 'المشرفين', manageAdmins: 'page-active', statusAdmin: 'true', fullAccess: request.fullAccess, css: ['styleforusers.css'], js: ['manageadmins.js', 'pagifortable.js'] })
    }else{
        response.redirect('/manage/login');
    }
})
router.get('/login', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('login', { title: 'تسجيل الدخول', css: ['styleforvisitors.css'], js: ['login.js'], statusVisitor: 'true' })
    }
})
router.get('/manage/login', loggedInForAdmins, (request, response) => {
    if(request.user){
        response.redirect('/manage');
    }else{
        response.render('loginforadmins', { title: 'تسجيل الدخول', statusVisitor: 'true', css: ['styleforvisitors.css'], js: ['loginforadmins.js'] })
    }
})
router.get('/register', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('register', { title: 'أنشئ حسابا', css: ['styleforvisitors.css'], js: ['register.js'], statusVisitor: 'true' })
    }
})
router.get('/learn', loggedIn, (request, response) => {
    if(request.user){
        response.render('learn', { title: 'تعلم', learn: 'page-active', css: ['styleforusers.css'], js: ['learn.js'], status: "loggedIn", userId: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/leaderboard', loggedIn, (request, response) => {
    if(request.user){
        response.render('leaderboard', { title: 'لوحة المتصدرين', leaderboard: 'page-active', css: ['styleforusers.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/quests', loggedIn, (request, response) => {
    if(request.user){
        response.render('quests', { title: 'المسابقات', quests: 'page-active', css: ['styleforusers.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/profile', loggedIn, (request, response) => {
    if(request.user){
        response.render('profile', { title: 'الحساب', profile: 'page-active', css: ['styleforusers.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/settings', loggedIn, (request, response) => {
    if(request.user){
        response.render('settings', { title: 'الإعدادات', settings: 'page-active', css: ['styleforusers.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})

module.exports = router;