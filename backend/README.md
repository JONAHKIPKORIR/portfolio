# Portfolio API Backend

A production-ready REST API for my personal portfolio website. Built with **Node.js**, **Express**, **MongoDB Atlas**, and **JWT authentication**.

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **Projects API** | CRUD operations for portfolio projects |
| **Blog API** | Manage blog posts with view counting |
| **Contact API** | Save messages and send email notifications |
| **Admin Dashboard API** | Protected CMS endpoints with JWT authentication |
| **MongoDB Atlas** | Cloud database (same as TaskFlow project) |
| **Security** | Password hashing with bcrypt, JWT validation |

## 📋 API Endpoints

### Public Routes (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/featured` | Get featured projects (limit 3) |
| GET | `/api/projects/:id` | Get single project by ID |
| GET | `/api/blog` | Get all published blog posts |
| GET | `/api/blog/:id` | Get single blog post (increments views) |
| POST | `/api/contact` | Send contact message |

### Admin Routes (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login (returns JWT) |
| GET | `/api/admin/me` | Get current admin info |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/projects` | Get all projects (admin view) |
| POST | `/api/admin/projects` | Create new project |
| PUT | `/api/admin/projects/:id` | Update project |
| DELETE | `/api/admin/projects/:id` | Delete project |
| GET | `/api/admin/blog` | Get all blog posts (admin view) |
| POST | `/api/admin/blog` | Create new blog post |
| PUT | `/api/admin/blog/:id` | Update blog post |
| DELETE | `/api/admin/blog/:id` | Delete blog post |
| GET | `/api/admin/messages` | Get all contact messages |
| PUT | `/api/admin/messages/:id/read` | Mark message as read |
| DELETE | `/api/admin/messages/:id` | Delete message |

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Cloud database (replica set) |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email sending |
| **CORS** | Cross-origin requests |
| **dotenv** | Environment variables |

## 📁 Project Structure

backend/
├── models/
│ ├── Project.js # Project schema
│ ├── BlogPost.js # Blog post schema
│ ├── Message.js # Contact message schema
│ └── Admin.js # Admin user schema
├── routes/
│ ├── projects.js # Public project routes
│ ├── blog.js # Public blog routes
│ ├── contact.js # Contact form route
│ └── admin.js # Protected admin routes
├── middleware/
│ └── auth.js # JWT verification middleware
├── .env # Environment variables
├── server.js # Entry point
├── seed.js # Admin user seeder
├── package.json
└── README.md



## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository (or navigate to backend folder)
cd portfolio/backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your credentials
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: A strong secret key
# - EMAIL_USER: Your Gmail address
# - EMAIL_PASS: Your Gmail app password

# Seed the admin user
npm run seed

# Start development server
npm run dev


