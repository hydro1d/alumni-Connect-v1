const db = require('../config/db');

// @desc    Get user profile (own profile)
// @route   GET /api/users/profile
const getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id, u.name, u.email, u.role, p.department, p.batch, p.company, p.job_title, p.skills, p.location
            FROM Users u
            LEFT JOIN Profiles p ON u.id = p.user_id
            WHERE u.id = ?
        `, [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
    const { department, batch, company, job_title, skills, location } = req.body;

    try {
        await db.query(`
            UPDATE Profiles 
            SET department = COALESCE(?, department), 
                batch = COALESCE(?, batch), 
                company = COALESCE(?, company),
                job_title = COALESCE(?, job_title),
                skills = COALESCE(?, skills),
                location = COALESCE(?, location)
            WHERE user_id = ?
        `, [department, batch, company, job_title, skills, location, req.user.id]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// @desc    Search and list Alumni
// @route   GET /api/users/alumni
const getAlumni = async (req, res) => {
    const { department, batch, company, location, search } = req.query;

    let query = `
        SELECT u.id, u.name, u.email, p.department, p.batch, p.company, p.job_title, p.skills, p.location
        FROM Users u
        JOIN Profiles p ON u.id = p.user_id
        WHERE u.role = 'Alumni'
    `;
    const queryParams = [];

    if (department) {
        query += ` AND p.department = ?`;
        queryParams.push(department);
    }
    if (batch) {
        query += ` AND p.batch = ?`;
        queryParams.push(batch);
    }
    if (company) {
        query += ` AND p.company LIKE ?`;
        queryParams.push(`%${company}%`);
    }
    if (location) {
        query += ` AND p.location LIKE ?`;
        queryParams.push(`%${location}%`);
    }
    if (search) {
        query += ` AND (u.name LIKE ? OR p.skills LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    try {
        const [alumni] = await db.query(query, queryParams);
        res.json(alumni);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error searching alumni' });
    }
};

// @desc    Get alumni recommendations based on user profile
// @route   GET /api/users/recommendations
const getRecommendations = async (req, res) => {
    try {
        const [userProfile] = await db.query('SELECT department, skills FROM Profiles WHERE user_id = ?', [req.user.id]);
        
        let department = null;
        let userSkills = [];
        if (userProfile.length > 0) {
            department = userProfile[0].department;
            userSkills = userProfile[0].skills ? userProfile[0].skills.split(',').map(s => s.trim()) : [];
        }

        let query = `
            SELECT u.id, u.name, u.email, p.department, p.company, p.job_title, p.skills, p.location, p.batch
            FROM Users u
            JOIN Profiles p ON u.id = p.user_id
            WHERE u.role = 'Alumni' AND u.id != ?
        `;
        const params = [req.user.id];

        if (department) {
            query += ` AND (p.department = ?`;
            params.push(department);
            
            if (userSkills.length > 0) {
                const skillConditions = userSkills.map(() => `p.skills LIKE ?`).join(' OR ');
                query += ` OR ${skillConditions})`;
                userSkills.forEach(skill => params.push(`%${skill}%`));
            } else {
                query += `)`;
            }
        }

        query += ` ORDER BY RAND() LIMIT 4`; // Fetch 4 random recommended alumni
        
        const [alumni] = await db.query(query, params);
        res.json(alumni);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching recommendations' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAlumni,
    getRecommendations
};
