const express = require('express');
const router = express.Router();
const { getChatHistory, getAllChats } = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getAllChats);
router.route('/:userId').get(protect, getChatHistory);

module.exports = router;
