# AlumniConnect 🎓

AlumniConnect is a modern networking platform designed to bridge the gap between students and alumni. It facilitates mentorship, career guidance, job opportunities, and professional networking within a university or college community.

![Screenshot](https://via.placeholder.com/800x450?text=AlumniConnect+Dashboard)

##Features

- **User Authentication**: Secure login and registration for both students and alumni with role-based access.
- **Alumni Directory**: A searchable and filterable database of alumni, searchable by department, batch, company, and skills.
- **Dynamic Profiles**: Detailed user profiles showcasing education, career history, skills, and current location.
- **Job Portal**: A dedicated space for alumni to post job opportunities and for students/alumni to find new roles.
- **Mentorship System**: Streamlined process for students to request mentorship from industry-experienced alumni.
- **Real-time Messaging**: Built-in chat system for direct communication between mentors and mentees.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS and DaisyUI, ensuring a premium experience on all devices.

## 🛠️ Tech Stack

### Frontend
- **HTML5 & CSS3**: Semantic structure and modern styling.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **DaisyUI**: Premium component library for Tailwind CSS.
- **Vanilla JavaScript**: Lightweight and fast client-side logic.
- **Vite**: Ultra-fast frontend build tool.

### Backend
- **Node.js**: Scalable server-side runtime.
- **Express.js**: Robust web framework for APIs.
- **MySQL**: Relational database for structured data management.
- **JWT**: Secure authentication via JSON Web Tokens.
- **Bcrypt.js**: Industry-standard password hashing.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) server

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/alumniconnect.git
cd alumniconnect
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=alumniconnect
   JWT_SECRET=your_jwt_secret_key
   ```
4. Seed the database with sample data:
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The project includes an automatic database initialization system. When you first run the backend, it will create the following tables:
- `Users`: Stores account information and roles.
- `Profiles`: Detailed user professional information.
- `Jobs`: Job postings posted by alumni.
- `MentorshipRequests`: Tracking mentorship status between students and alumni.
- `Messages`: Individual chat logs.

## 🤝 Contributing

Contributions are welcome! If you have a feature request or bug report, please open an issue.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ by the AlumniConnect Team.
