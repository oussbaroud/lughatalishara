const express = require('express');
const register = require('../controllers/register');
const registerForAdmins = require('../controllers/registerforadmins');
const login = require('../controllers/login');
const loginForAdmins = require('../controllers/loginforadmins');
const logout = require('../controllers/logout');
const router = express.Router();

router.post('/register', register);
router.post('/manage/register', registerForAdmins);
router.post('/login', login);
router.post('/manage/login', loginForAdmins);
router.get('/logout', logout);

module.exports = router;