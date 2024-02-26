const express = require('express');
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { getAllLetters, insertLetter, uploadFile, deleteLetter, deleteFile, fillLettersGap, updateLetter, SearchForLetter } = require('../../controllers/admins/manageLetters');

const router = express.Router();

router.get('/get', getAllLetters);
router.post('/insert', loggedIn, insertLetter);
router.post('/upload/:fileName', loggedIn, uploadFile);
router.delete('/delete/details/:id', loggedIn, deleteLetter);
router.delete('/delete/file/:fileName', loggedIn, deleteFile);
router.patch('/update/fillgap', loggedIn, fillLettersGap);
router.patch('/update/details/:id', loggedIn, updateLetter);
router.get('/search/:letter', SearchForLetter);

module.exports = router;