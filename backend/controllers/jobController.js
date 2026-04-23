const db = require('../config/db');

// @desc    Create a job posting (Alumni only)
// @route   POST /api/jobs
const createJob = async (req, res) => {
    const { title, company, description, location } = req.body;

    if (!title || !company || !description) {
        return res.status(400).json({ message: 'Please provide title, company, and description' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Jobs (title, company, description, location, posted_by) VALUES (?, ?, ?, ?, ?)',
            [title, company, description, location, req.user.id]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            company,
            description,
            location,
            posted_by: req.user.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating job posting' });
    }
};

// @desc    Get all job postings
// @route   GET /api/jobs
const getJobs = async (req, res) => {
    try {
        const [jobs] = await db.query(`
            SELECT j.*, u.name as posted_by_name, p.department 
            FROM Jobs j
            JOIN Users u ON j.posted_by = u.id
            LEFT JOIN Profiles p ON u.id = p.user_id
            ORDER BY j.created_at DESC
        `);
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching jobs' });
    }
};

// @desc    Get recent jobs for dashboard (limit 3)
// @route   GET /api/jobs/recent
const getRecentJobs = async (req, res) => {
    try {
        const [jobs] = await db.query(`
            SELECT j.*, u.name as posted_by_name, p.company as alumni_company
            FROM Jobs j
            JOIN Users u ON j.posted_by = u.id
            LEFT JOIN Profiles p ON u.id = p.user_id
            ORDER BY j.created_at DESC
            LIMIT 3
        `);
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching recent jobs' });
    }
};

module.exports = {
    createJob,
    getJobs,
    getRecentJobs
};