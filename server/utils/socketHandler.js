const Chat = require('../models/Chat');
const { getAIResponse } = require('../services/aiService');

const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected: ' + socket.id);

        // User joins room with their userId
        socket.on('join_room', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        });

        // User sends message
        socket.on('send_message', async (data) => {
            // data: { userId, message, sender: 'user' }
            const { userId, message, sender } = data;

            try {
                // Find or create chat for user
                let chat = await Chat.findOne({ user: userId });
                if (!chat) {
                    chat = new Chat({ user: userId, messages: [] });
                }

                // Add user message
                const userMsg = { sender: 'user', message, timestamp: new Date() };
                chat.messages.push(userMsg);
                await chat.save();

                // Broadcast back to user room (so user sees it confirmed, and admin sees it)
                io.to(userId).emit('receive_message', userMsg);

                // Send notification to admin if they are listening (optional, for now just emit in room)

                // Get AI response
                const aiReply = await getAIResponse(message);
                const botMsg = { sender: 'bot', message: aiReply, timestamp: new Date() };

                chat.messages.push(botMsg);
                await chat.save();

                // Send bot reply
                setTimeout(() => {
                    io.to(userId).emit('receive_message', botMsg);
                }, 1000); // Simulate typing delay

            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // Admin sends message
        socket.on('admin_message', async (data) => {
            // data: { userId, message } -- Message sent TO userId
            const { userId, message } = data;

            try {
                let chat = await Chat.findOne({ user: userId });
                if (chat) {
                    const adminMsg = { sender: 'admin', message, timestamp: new Date() };
                    chat.messages.push(adminMsg);
                    await chat.save();

                    io.to(userId).emit('receive_message', adminMsg);
                }
            } catch (error) {
                console.error('Error sending admin message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = initSocket;
