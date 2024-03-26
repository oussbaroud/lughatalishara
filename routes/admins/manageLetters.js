// Imporing Express
const express = require('express');

// Importing Functions
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { getAllLetters, getLetter, insertLetter, uploadFile, deleteLetter, deleteFile, updateLetter, SearchForLetter } = require('../../controllers/admins/manageLetters');

// Declaring Router
const router = express.Router();

// Express Methods
router.get('/get', getAllLetters);
router.get('/:letter/get', getLetter);
router.post('/insert', loggedIn, insertLetter);
router.post('/upload/:fileName', loggedIn, uploadFile);
router.delete('/delete/details/:id', loggedIn, deleteLetter);
router.delete('/delete/file/:fileName', loggedIn, deleteFile);
router.patch('/update/details/:id', loggedIn, updateLetter);
router.get('/search/:letter', SearchForLetter);

// Exporting Router
module.exports = router;