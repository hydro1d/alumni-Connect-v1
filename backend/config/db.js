const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create tables if they don't exist
const initDb = async () => {
    try {
        const promisePool = pool.promise();
        
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Student', 'Alumni', 'Admin') NOT NULL DEFAULT 'Student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS Profiles (
                user_id INT PRIMARY KEY,
                department VARCHAR(255),
                batch VARCHAR(50),
                company VARCHAR(255),
                job_title VARCHAR(255),
                skills TEXT,
                location VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS Jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                location VARCHAR(255),
                posted_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (posted_by) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS MentorshipRequests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                alumni_id INT,
                status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (alumni_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS Messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        console.log('Database tables verified/created successfully.');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};

initDb();

module.exports = pool.promise();