// Imporing Express
const express = require('express');

// Importing Functions
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { getAllWords, getWord, insertWord, uploadFile, deleteWord, deleteFile, updateWord, SearchForWord, sortWordsByLetter } = require('../../controllers/admins/manageDictionary');

// Declaring Router
const router = express.Router();

// Express Methods
router.get('/get', getAllWords);
router.get('/:word/get', getWord);
router.post('/insert', loggedIn, insertWord);
router.post('/upload/:fileName', loggedIn, uploadFile);
router.delete('/delete/details/:id', loggedIn, deleteWord);
router.delete('/delete/file/:fileName', loggedIn, deleteFile);
router.patch('/update/details/:id', loggedIn, updateWord);
router.get('/search/:word', SearchForWord);
router.get('/sort/:letter', sortWordsByLetter);

// Exporting Router
module.exports = router;