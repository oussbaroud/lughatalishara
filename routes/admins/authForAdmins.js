// Imporing Express
const express = require('express');

// Importing Functions
const login = require('../../controllers/admins/loginForAdmins');
const logout = require('../../controllers/admins/logoutForAdmins');

// Declaring Router
const router = express.Router();

// Express Methods
router.post('/login', login);
router.get('/logout', logout);

// Exporting Router
module.exports = router;