const db = require('../config/db');

// @desc    Get chat history between current user and a target user
// @route   GET /api/chat/:userId
const getChatHistory = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.id;

        const [messages] = await db.query(`
            SELECT m.*, u.name as sender_name 
            FROM Messages m
            JOIN Users u ON m.sender_id = u.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?)
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.created_at ASC
        `, [currentUserId, targetUserId, targetUserId, currentUserId]);

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching chat history' });
    }
};

// @desc    Send a message to a target user
// @route   POST /api/chat/:userId
const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.userId;
        const senderId = req.user.id;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        // If Student, verify mentorship relationship exists and is accepted
        if (req.user.role === 'Student') {
            const [relationship] = await db.query(`
                SELECT * FROM MentorshipRequests 
                WHERE status = 'accepted' AND (
                    (student_id = ? AND alumni_id = ?) OR 
                    (student_id = ? AND alumni_id = ?)
                )
            `, [senderId, receiverId, receiverId, senderId]);

            if (relationship.length === 0) {
                return res.status(403).json({ message: 'Students can only message an accepted mentor.' });
            }
        }

        const [result] = await db.query(`
            INSERT INTO Messages (sender_id, receiver_id, content) 
            VALUES (?, ?, ?)
        `, [senderId, receiverId, content]);

        // Fetch the newly created message with sender name
        const [newMessage] = await db.query(`
            SELECT m.*, u.name as sender_name 
            FROM Messages m
            JOIN Users u ON m.sender_id = u.id
            WHERE m.id = ?
        `, [result.insertId]);

        res.status(201).json(newMessage[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error sending message' });
    }
};

module.exports = {
    getChatHistory,
    sendMessage
};