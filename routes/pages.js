const express = require('express');
const router = express.Router();

// Rendering Pages
router.get('/', (request, response) => {
    response.render('index', { title: 'الرئيسية', css: ['style.css', 'style.css'] })
})
router.get('/letters', (request, response) => {
    response.render('letters', { title: 'الحروف', css: ['style.css', 'style.css'] })
})
router.get('/dictionary', (request, response) => {
    response.render('dictionary', { title: 'القاموس', css: ['style.css', 'style.css'] })
})
router.get('/manage/dictionary', (request, response) => {
    response.render('managewords', { title: 'القاموس', css: ['style.css', 'style.css'] })
})
router.get('/manage/letters', (request, response) => {
    response.render('manageletters', { title: 'الحروف', css: ['style.css', 'style.css'] })
})
router.get('/login', (request, response) => {
    response.render('login', { title: 'تسجيل الدخول', css: ['style.css', 'style.css'] })
})
router.get('/register', (request, response) => {
    response.render('register', { title: 'أنشئ حسابا', css: ['style.css', 'style.css'] })
})

module.exports = router;