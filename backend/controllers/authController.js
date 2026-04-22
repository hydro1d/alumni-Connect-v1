const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['Student', 'Alumni', 'Admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
        // Check if user exists
        const [existingUsers] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await db.query(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        const userId = result.insertId;

        // Create empty profile
        await db.query('INSERT INTO Profiles (user_id) VALUES (?)', [userId]);

        // Generate token
        const token = jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            id: userId,
            name,
            email,
            role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
