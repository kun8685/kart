const Chat = require('../models/Chat');
const asyncHandler = require('express-async-handler');

// @desc    Get chat history for a user
// @route   GET /api/chat/:userId
// @access  Private (User or Admin)
const getChatHistory = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ user: req.params.userId });
    if (chat) {
        res.json(chat);
    } else {
        res.json({ messages: [] });
    }
});

// @desc    Get all active chats (for admin)
// @route   GET /api/chat
// @access  Private (Admin)
const getAllChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({}).populate('user', 'name email');
    res.json(chats);
});

module.exports = {
    getChatHistory,
    getAllChats
};
