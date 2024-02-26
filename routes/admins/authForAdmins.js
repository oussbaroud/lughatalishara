const express = require('express');
const register = require('../../controllers/admins/registerForAdmins');
const login = require('../../controllers/admins/loginForAdmins');
const logout = require('../../controllers/admins/logoutForAdmins');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;