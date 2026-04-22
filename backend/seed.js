const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'alumniconnect',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log('Connecting to database...');

        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE MentorshipRequests');
        await pool.query('TRUNCATE TABLE Jobs');
        await pool.query('TRUNCATE TABLE Profiles');
        await pool.query('TRUNCATE TABLE Users');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Cleared existing data.');

        const passwordHash = await bcrypt.hash('password123', 10);

        // 1. Insert Users (6 Alumni, 6 Students)
        const users = [
            ['Alice Johnson', 'alice@alumni.com', passwordHash, 'Alumni'],
            ['Bob Smith', 'bob@alumni.com', passwordHash, 'Alumni'],
            ['Eva Green', 'eva@alumni.com', passwordHash, 'Alumni'],
            ['Frank Wright', 'frank@alumni.com', passwordHash, 'Alumni'],
            ['Grace Hopper', 'grace@alumni.com', passwordHash, 'Alumni'],
            ['Henry Ford', 'henry@alumni.com', passwordHash, 'Alumni'],
            
            ['Charlie Davis', 'charlie@student.com', passwordHash, 'Student'],
            ['Dana Lee', 'dana@student.com', passwordHash, 'Student'],
            ['Ivy Chen', 'ivy@student.com', passwordHash, 'Student'],
            ['Jack Taylor', 'jack@student.com', passwordHash, 'Student'],
            ['Karen Hill', 'karen@student.com', passwordHash, 'Student'],
            ['Leo Vance', 'leo@student.com', passwordHash, 'Student']
        ];

        let insertUsersQuery = 'INSERT INTO Users (name, email, password, role) VALUES ?';
        const [userResult] = await pool.query(insertUsersQuery, [users]);

        // Insert IDs starting from the first insertId
        const startId = userResult.insertId;
        const alumniIds = [startId, startId+1, startId+2, startId+3, startId+4, startId+5];
        const studentIds = [startId+6, startId+7, startId+8, startId+9, startId+10, startId+11];

        console.log('Inserted Users.');

        // 2. Insert Profiles
        const profiles = [
            [alumniIds[0], 'Computer Science', '2018', 'Google', 'Senior Software Engineer', 'React, Node.js, GraphQL', 'San Francisco, CA'],
            [alumniIds[1], 'Business Administration', '2015', 'Microsoft', 'Product Manager', 'Agile, Leadership, Strategy', 'Seattle, WA'],
            [alumniIds[2], 'Computer Science', '2019', 'Amazon', 'SDE II', 'Java, AWS, Distributed Systems', 'Seattle, WA'],
            [alumniIds[3], 'Business Administration', '2020', 'Tesla', 'Operations Manager', 'Supply Chain, Analytics', 'Austin, TX'],
            [alumniIds[4], 'Design', '2017', 'Apple', 'UX Content Designer', 'Figma, Prototyping, Research', 'Cupertino, CA'],
            [alumniIds[5], 'Mechanical Engineering', '2016', 'Boeing', 'Systems Engineer', 'AutoCAD, MATLAB', 'Chicago, IL'],
            
            [studentIds[0], 'Computer Science', '2025', null, 'Student', 'HTML, CSS, JavaScript', 'New York, NY'],
            [studentIds[1], 'Business Administration', '2026', null, 'Student', 'Marketing, Communication', 'Chicago, IL'],
            [studentIds[2], 'Computer Science', '2025', null, 'Student', 'Python, C++', 'Boston, MA'],
            [studentIds[3], 'Mechanical Engineering', '2026', null, 'Student', 'Thermodynamics, CAD', 'Detroit, MI'],
            [studentIds[4], 'Design', '2025', null, 'Student', 'Adobe Creative Suite, Figma', 'Los Angeles, CA'],
            [studentIds[5], 'Data Science', '2027', null, 'Student', 'SQL, Pandas, R', 'Austin, TX']
        ];

        let insertProfilesQuery = 'INSERT INTO Profiles (user_id, department, batch, company, job_title, skills, location) VALUES ?';
        await pool.query(insertProfilesQuery, [profiles]);

        console.log('Inserted Profiles.');

        // 3. Insert Jobs
        const jobs = [
            ['Frontend Developer', 'Google', 'We are looking for a skilled React developer. Apply today via our career portal!', 'San Francisco, CA', alumniIds[0]],
            ['Product Management Intern', 'Microsoft', 'Summer internship position for aspiring PMs. Please email me your resume.', 'Seattle, WA', alumniIds[1]],
            ['Backend Software Engineer', 'Amazon', 'Join our AWS core networking team. Required 2+ years of Java.', 'Seattle, WA', alumniIds[2]],
            ['Operations Analyst', 'Tesla', 'Looking for an energetic analyst to optimize supply chain flows in Austin.', 'Austin, TX', alumniIds[3]],
            ['Junior UX Designer', 'Apple', 'Help design the next generation of Apple software UI. Portfolio required.', 'Cupertino, CA', alumniIds[4]],
            ['Systems Engineering Co-op', 'Boeing', '6-month co-op program for mechanical engineering students.', 'Chicago, IL', alumniIds[5]],
            ['Full Stack Web Developer', 'Google', 'Work on internal tools using Node.js and React.', 'Remote', alumniIds[0]]
        ];

        let insertJobsQuery = 'INSERT INTO Jobs (title, company, description, location, posted_by) VALUES ?';
        await pool.query(insertJobsQuery, [jobs]);

        console.log('Inserted Jobs.');

        // 4. Insert Mentorship Requests
        const requests = [
            [studentIds[0], alumniIds[0], 'pending'],
            [studentIds[1], alumniIds[1], 'accepted'],
            [studentIds[2], alumniIds[2], 'pending'],
            [studentIds[3], alumniIds[5], 'pending'],
            [studentIds[4], alumniIds[4], 'accepted'],
            [studentIds[5], alumniIds[2], 'rejected'],
            [studentIds[0], alumniIds[2], 'accepted']
        ];

        let insertRequestsQuery = 'INSERT INTO MentorshipRequests (student_id, alumni_id, status) VALUES ?';
        await pool.query(insertRequestsQuery, [requests]);

        console.log('Inserted Mentorship Requests.');

        console.log('\\n==========================================');
        console.log('Database seeded with 10+ records successfully!');
        console.log('Every account uses the password: password123');
        console.log('Alumni: alice@, bob@, eva@, frank@, grace@, henry@ (-alumni.com)');
        console.log('Students: charlie@, dana@, ivy@, jack@, karen@, leo@ (-student.com)');
        console.log('==========================================\\n');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
