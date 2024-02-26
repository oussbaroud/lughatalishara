const express = require('express');
const register = require('../../controllers/users/registerForUsers');
const login = require('../../controllers/users/loginForUsers');
const logout = require('../../controllers/users/logoutForUsers');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;