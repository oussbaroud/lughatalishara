const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const logout = require('../controllers/logout');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;