const express = require('express');
const loggedIn = require('../controllers/loggedin');
const router = express.Router();

// Rendering Pages
router.get('/', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('index', { title: 'الرئيسية', home: 'page-active', css: ['styleforvisitors.css'], js: [''], statusVisitor: 'true' })
    }
})
router.get('/letters', loggedIn, (request, response) => {
    if(request.user){
        response.render('letters', { title: 'الحروف', letters: 'page-active', css: ['styleforvisitors.css'], js: ['tranletters.js', 'pagiforletters.js'], status: "loggedIn", user: request.user })
    }else{
        response.render('letters', { title: 'الحروف', letters: 'page-active', css: ['styleforvisitors.css'], js: ['tranletters.js', 'pagiforletters.js'], statusVisitor: 'true' })
    }
})
router.get('/dictionary', loggedIn, (request, response) => {
    if(request.user){
        response.render('dictionary', { title: 'القاموس', dictionary: 'page-active', css: ['styleforvisitors.css'], js: ['tranwords.js', 'sortbyletters.js', 'pagiforwords.js'], status: "loggedIn", user: request.user })
    }else{
        response.render('dictionary', { title: 'القاموس', dictionary: 'page-active', css: ['styleforvisitors.css'], js: ['tranwords.js', 'sortbyletters.js', 'pagiforwords.js'], statusVisitor: 'true' })
    }
})
router.get('/manage/dictionary', (request, response) => {
    response.render('managewords', { title: 'القاموس', manageWords: 'page-active', statusAdmin: 'true', css: ['styleforadmins.css'], js: ['managewords.js', 'pagifortable.js'] })
})
router.get('/manage/letters', (request, response) => {
    response.render('manageletters', { title: 'الحروف', manageLetters: 'page-active', statusAdmin: 'true', css: ['styleforadmins.css'], js: ['manageletters.js', 'pagifortable.js'] })
})
router.get('/login', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('login', { title: 'تسجيل الدخول', css: ['styleforvisitors.css'], js: ['login.js'], statusVisitor: 'true' })
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
        response.render('learn', { title: 'تعلم', learn: 'page-active', css: ['styleforusers.css'], js: [''], status: "loggedIn", user: request.user })
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