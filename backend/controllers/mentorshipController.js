const db = require('../config/db');

// @desc    Send a mentorship request
// @route   POST /api/mentorship/request
const requestMentorship = async (req, res) => {
    const { alumni_id } = req.body;

    if (!alumni_id) {
        return res.status(400).json({ message: 'Alumni ID is required' });
    }

    try {
        // Check if request already exists
        const [existing] = await db.query(
            'SELECT * FROM MentorshipRequests WHERE student_id = ? AND alumni_id = ?',
            [req.user.id, alumni_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Mentorship request already exists' });
        }

        const [result] = await db.query(
            'INSERT INTO MentorshipRequests (student_id, alumni_id, status) VALUES (?, ?, ?)',
            [req.user.id, alumni_id, 'pending']
        );

        res.status(201).json({
            id: result.insertId,
            student_id: req.user.id,
            alumni_id,
            status: 'pending'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error sending mentorship request' });
    }
};

// @desc    Get user's mentorship requests
// @route   GET /api/mentorship/requests
const getRequests = async (req, res) => {
    try {
        let query = '';
        let params = [req.user.id];

        if (req.user.role === 'Student') {
            query = `
                SELECT mr.*, u.name as alumni_name, p.company, p.job_title
                FROM MentorshipRequests mr
                JOIN Users u ON mr.alumni_id = u.id
                LEFT JOIN Profiles p ON u.id = p.user_id
                WHERE mr.student_id = ?
            `;
        } else if (req.user.role === 'Alumni') {
            query = `
                SELECT mr.*, u.name as student_name, u.email as student_email
                FROM MentorshipRequests mr
                JOIN Users u ON mr.student_id = u.id
                WHERE mr.alumni_id = ?
            `;
        }

        const [requests] = await db.query(query, params);
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching mentorship requests' });
    }
};

// @desc    Update mentorship request status
// @route   PUT /api/mentorship/request/:id
const updateRequestStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const [result] = await db.query(
            'UPDATE MentorshipRequests SET status = ? WHERE id = ? AND alumni_id = ?',
            [status, id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found or not authorized' });
        }

        res.json({ message: `Mentorship request ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating request status' });
    }
};

module.exports = {
    requestMentorship,
    getRequests,
    updateRequestStatus
};