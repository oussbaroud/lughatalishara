const express = require('express');
const loggedIn = require('../../controllers/admins/loggedInForAdmins');
const { getAdmins, insertAdmin, deleteAdmin, getAdminAccess, updateAdminAccess, searchForAdmin } = require('../../controllers/admins/manageAdmins');

const router = express.Router();

router.get('/get', getAdmins);
router.post('/insert', loggedIn, insertAdmin);
router.get('/getAccess/:id', loggedIn, getAdminAccess);
router.delete('/delete/:id', loggedIn, deleteAdmin);
router.patch('/update/:id', loggedIn, updateAdminAccess);
router.get('/search/:name', loggedIn, searchForAdmin);

module.exports = router;