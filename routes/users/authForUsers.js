// Imporing Express
const express = require('express');

// Importing Functions
const register = require('../../controllers/users/registerForUsers');
const login = require('../../controllers/users/loginForUsers');
const logout = require('../../controllers/users/logoutForUsers');

// Declaring Router
const router = express.Router();

// Express Methods
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Exporting Router
module.exports = router;