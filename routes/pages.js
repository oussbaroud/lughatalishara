const express = require('express');
const loggedIn = require('../controllers/loggedin');
const router = express.Router();

// Rendering Pages
router.get('/', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('index', { title: 'الرئيسية', css: ['style.css'] })
    }
})
router.get('/letters', loggedIn, (request, response) => {
    if(request.user){
        response.render('letters', { title: 'الحروف', css: ['style.css'], status: "loggedIn", user: request.user })
    }else{
        response.render('letters', { title: 'الحروف', css: ['style.css'] })
    }
})
router.get('/dictionary', loggedIn, (request, response) => {
    if(request.user){
        response.render('dictionary', { title: 'القاموس', css: ['style.css'], status: "loggedIn", user: request.user })
    }else{
        response.render('dictionary', { title: 'القاموس', css: ['style.css'] })
    }
})
router.get('/manage/dictionary', (request, response) => {
    response.render('managewords', { title: 'القاموس', css: ['style.css', 'style.css'] })
})
router.get('/manage/letters', (request, response) => {
    response.render('manageletters', { title: 'الحروف', css: ['style.css', 'style.css'] })
})
router.get('/login', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('login', { title: 'تسجيل الدخول', css: ['style.css'] })
    }
})
router.get('/register', loggedIn, (request, response) => {
    if(request.user){
        response.redirect('/learn');
    }else{
        response.render('register', { title: 'أنشئ حسابا', css: ['style.css'] })
    }
})
router.get('/learn', loggedIn, (request, response) => {
    if(request.user){
        response.render('learn', { title: 'تعلم', css: ['style.css'], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/leaderboard', loggedIn, (request, response) => {
    if(request.user){
        response.render('leaderboard', { title: 'لوحة المتصدرين', css: ['style.css'], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/quests', loggedIn, (request, response) => {
    if(request.user){
        response.render('quests', { title: 'المسابقات', css: ['style.css'], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/profile', loggedIn, (request, response) => {
    if(request.user){
        response.render('profile', { title: 'الحساب', css: ['style.css'], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})
router.get('/settings', loggedIn, (request, response) => {
    if(request.user){
        response.render('settings', { title: 'الإعدادات', css: ['style.css', 'style.css'], status: "loggedIn", user: request.user })
    }else{
        response.redirect('/login');
    }
})

module.exports = router;