const express = require('express');
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { getAllWords, insertWord, uploadFile, deleteWord, fillWordsGap, deleteFile, updateWord, SearchForWord, sortWordsByLetter } = require('../../controllers/admins/manageDictionary');

const router = express.Router();

router.get('/get', getAllWords);
router.post('/insert', loggedIn, insertWord);
router.post('/upload/:fileName', loggedIn, uploadFile);
router.delete('/delete/details/:id', loggedIn, deleteWord);
router.delete('/delete/file/:fileName', loggedIn, deleteFile);
router.patch('/update/fillgap', loggedIn, fillWordsGap);
router.patch('/update/details/:id', loggedIn, updateWord);
router.get('/search/:word', SearchForWord);
router.get('/sort/:letter', sortWordsByLetter);

module.exports = router;