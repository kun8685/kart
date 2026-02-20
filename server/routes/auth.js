const express = require('express');
const router = express.Router();
const { authUser, registerUser, logoutUser } = require('../controllers/authController');

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);

module.exports = router;
