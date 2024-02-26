const express = require('express');
const loggedIn = require('../../controllers/users/loggedInForUsers');
const router = express.Router();

// Rendering Pages
router.get('/', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('users/homeForUsers', { title: 'الرئيسية', home: 'page-active', css: ['visitors.css'], js: ['users/addNavBorderOnScroll.js'], statusVisitor: 'true' })
    }
})
router.get('/login', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('users/loginForUsers', { title: 'تسجيل الدخول', css: ['visitors.css'], js: ['login.js'], statusVisitor: 'true' })
    }
})
router.get('/section:sectionNumber/unit:unitNumber/level:levelNumber/lesson:lessonNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/play', { layout: 'plain', title: 'الحروف', letters: 'page-active', css: ['play.css'], js: ['users/play.js'], status: "loggedIn", userId: request.user })
    }else{
        response.redirect('/');    }
})
router.get('/section:sectionNumber/test', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/play', { layout: 'plain', title: 'الحروف', letters: 'page-active', css: ['play.css'], js: ['users/play.js'], status: "loggedIn", userId: request.user })
    }else{
        response.redirect('/');    }
})
router.get('/section:sectionNumber/unit:unitNumber/test', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/play', { layout: 'plain', title: 'الحروف', letters: 'page-active', css: ['play.css'], js: ['users/play.js'], status: "loggedIn", userId: request.user })
    }else{
        response.redirect('/');    }
})
router.get('/letters', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/letters', { title: 'الحروف', letters: 'page-active', css: ['users.css'], js: ['users/scroll.js', 'users/styleheader.js', 'users/tranletters.js', 'users/pagiforletters.js'], status: "loggedIn", user: request.user })
    }else{
        response.render('users/letters', { title: 'الحروف', letters: 'page-active', css: ['visitors.css'], js: ['users/addNavBorderOnScroll.js', 'users/tranletters.js', 'users/pagiforletters.js'], statusVisitor: 'true' })
    }
})
router.get('/dictionary', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/dictionary', { title: 'القاموس', dictionary: 'page-active', css: ['users.css'], js: ['users/scroll.js', 'users/styleheader.js', 'users/tranwords.js', 'users/sortbyletters.js', 'users/pagifordictionary.js'], status: "loggedIn", user: request.user })
    }else{
        response.render('users/dictionary', { title: 'القاموس', dictionary: 'page-active', statusVisitor: 'true', css: ['visitors.css'], js: ['users/addNavBorderOnScroll.js', 'users/tranwords.js', 'users/sortbyletters.js', 'users/pagifordictionary.js'] })
    }
})

router.get('/register', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('users/register', { title: 'أنشئ حسابا', css: ['visitors.css'], js: ['users/register.js'], statusVisitor: 'true' })
    }
})
router.get('/learn', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/learn', { title: 'تعلم', learn: 'page-active', css: ['users.css'], js: ['users/learn.js', 'users/scroll.js'], status: "loggedIn", userId: request.user })
    }else{
        response.redirect('/');
    }
})
router.get('/sections', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/sections', { title: 'الوحدات', learn: 'page-active', css: ['users.css'], js: ['users/sections.js', 'users/scroll.js'], status: "loggedIn", userId: request.user })
    }else{
        response.redirect('/');
    }
})
router.get('/section:sectionNumber', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/learn', { title: 'تعلم', learn: 'page-active', css: ['users.css'], js: ['users/learn.js', 'users/scroll.js'], status: "loggedIn", userId: request.user })
    }else{
        response.redirect('/');
    }
})
router.get('/leaderboard', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/leaderboard', { title: 'لوحة المتصدرين', leaderboard: 'page-active', css: ['users.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/');
    }
})
router.get('/quests', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/quests', { title: 'المسابقات', quests: 'page-active', css: ['users.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/');
    }
})
router.get('/profile', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/profile', { title: 'الحساب', profile: 'page-active', css: ['users.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/');
    }
})
router.get('/settings', loggedIn, (request, response) => {
    if(request.user){
        response.render('users/settings', { title: 'الإعدادات', settings: 'page-active', css: ['users.css'], js: [''], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/');
    }
})

module.exports = router;