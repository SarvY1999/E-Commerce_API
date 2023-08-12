const express = require('express');
const router = express.Router();
const { getAllUser, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authentication');
const { authorizeUser } = require('../middleware/authorization');

router.route("/").get(authenticateUser, authorizeUser('admin'), getAllUser);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updatePassword').patch(authenticateUser, updateUserPassword);


router.route("/:id").get(authenticateUser, getSingleUser);



module.exports = router;