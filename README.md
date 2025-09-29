# 📋 TaskFlow - Complete Task Management System

A modern, full-stack task management application built with **Next.js**, **Express.js**, and **MongoDB**. Features role-based access control, real-time task management, and a beautiful admin dashboard.

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Task%20Management%20System-blue?style=for-the-badge)

## 🌟 Features

### 🔐 **Authentication & Authorization**
- ✅ **User Registration & Login** with JWT authentication
- ✅ **Role-Based Access Control** (Admin vs Regular Users)
- ✅ **Admin Account Creation** with secure secret key
- ✅ **Protected Routes** with automatic redirects
- ✅ **Session Management** with localStorage

### 📊 **Task Management**
- ✅ **Complete CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Task Status Tracking** (Pending, In Progress, Completed)
- ✅ **Priority Levels** (Low, Medium, High)
- ✅ **Due Date Management** with overdue indicators
- ✅ **Task Assignment** (Admin can assign to any user)
- ✅ **Rich Task Details** with descriptions and metadata

### 👑 **Admin Dashboard**
- ✅ **User-Grouped Task View** - Click users to see their tasks
- ✅ **Task Statistics** per user (pending, completed, overdue)
- ✅ **Global Task Management** - Edit/delete any task
- ✅ **User Management** - View all registered users
- ✅ **Task Assignment Control** - Assign tasks to specific users

### 🎨 **Modern UI/UX**
- ✅ **Professional Design** with shadcn/ui components
- ✅ **Responsive Layout** for all screen sizes
- ✅ **Dark/Light Mode** support
- ✅ **Toast Notifications** for user feedback
- ✅ **Modal Confirmations** for destructive actions
- ✅ **Loading States** and progress indicators

## 🏗️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: CORS, input validation

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management-system
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your MongoDB connection string
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key
PORT=5000

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to project root (from backend directory)
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update .env.local with backend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Start the frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 📱 Usage Guide

### **Getting Started**

1. **Register Account**: Create a new user account at `/register`
2. **Login**: Sign in at `/login` to access the dashboard
3. **Create Tasks**: Add new tasks with titles, descriptions, and priorities
4. **Manage Tasks**: Edit, update status, and delete tasks as needed

### **Admin Features**

1. **Create Admin Account**:
   - Go to `/admin-setup`
   - Use admin secret: `admin123`
   - Fill in admin details and create account

2. **Admin Dashboard**:
   - **Users & Tasks Tab**: See all users, click to expand their tasks
   - **All Tasks Tab**: View and manage all tasks in the system
   - **Create Task Tab**: Create and assign tasks to any user

3. **Task Assignment**:
   - Admins can assign tasks to any registered user
   - View task statistics per user
   - Manage overdue tasks across the organization

## 🔧 Configuration

### **Environment Variables**

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

#### Backend (`.env`)
```env
# Never commit real secrets. Use placeholders and keep .env out of Git
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<generate-a-strong-random-secret>
PORT=5000
```

### **Admin Setup**
- **Admin Secret Key**: `admin123` (change in production)
- **First Admin**: Use the `/admin-setup` page
- **Security**: Update the admin secret in `backend/routes/auth.js`

## 📚 API Documentation

### **Interactive Documentation**
Access the full API documentation at: `http://localhost:5000/api-docs`

### **Key Endpoints**

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/create-admin` - Create admin account

#### Tasks
- `GET /api/v1/tasks` - Get tasks (role-based)
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

#### Admin
- `GET /api/v1/tasks/users` - Get all users (admin only)

### **Authentication**
All protected endpoints require JWT token:
```
Authorization: Bearer <your-jwt-token>
```

## 🗂️ Project Structure

```
task-management-system/
├── 📁 app/                          # Next.js app directory
│   ├── 📄 layout.tsx               # Root layout
│   ├── 📄 page.tsx                 # Landing page
│   ├── 📁 login/                   # Login page
│   ├── 📁 register/                # Registration page
│   ├── 📁 admin-setup/             # Admin creation page
│   └── 📁 dashboard/               # Main dashboard
├── 📁 components/                   # React components
│   ├── 📁 auth/                    # Authentication components
│   ├── 📁 tasks/                   # Task management components
│   ├── 📁 admin/                   # Admin-specific components
│   └── 📁 ui/                      # shadcn/ui components
├── 📁 lib/                         # Utility libraries
│   ├── 📄 api.ts                   # API client
│   └── 📄 utils.ts                 # Helper functions
├── 📁 backend/                     # Express.js backend
│   ├── 📁 models/                  # MongoDB schemas
│   ├── 📁 routes/                  # API routes
│   ├── 📁 middleware/              # Custom middleware
│   ├── 📄 server.js                # Express server
│   └── 📄 API_DOCUMENTATION.md     # API docs
├── 📄 package.json                 # Frontend dependencies
├── 📄 tailwind.config.js           # Tailwind configuration
├── 📄 tsconfig.json                # TypeScript configuration
└── 📄 README.md                    # This file
```

## 🎯 User Roles & Permissions

### **Regular Users**
- ✅ Create tasks for themselves
- ✅ View assigned tasks
- ✅ Edit their own tasks
- ✅ Update task status and priority
- ✅ Set due dates

### **Administrators**
- ✅ All regular user permissions
- ✅ View all users and their tasks
- ✅ Assign tasks to any user
- ✅ Edit/delete any task
- ✅ View system-wide task statistics
- ✅ Manage user assignments

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Admin vs User permissions
- **Input Validation**: Request validation and sanitization
- **CORS Protection**: Cross-origin resource sharing configured
- **Environment Variables**: Sensitive data in environment files

## 🎨 UI/UX Features

### **Design System**
- **Modern Cards**: Clean, professional task cards
- **Color Coding**: Priority and status indicators
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation
- **Smooth Animations**: Hover effects and transitions

### **User Experience**
- **Toast Notifications**: Real-time feedback
- **Modal Confirmations**: Safe destructive actions
- **Loading States**: Progress indicators
- **Error Handling**: User-friendly error messages
- **Intuitive Navigation**: Clear information hierarchy

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

### **Backend (Railway/Heroku)**
```bash
# Set environment variables
# Deploy using your preferred platform
```

### **Database (MongoDB Atlas)**
- Create MongoDB Atlas cluster
- Update connection string in environment variables
- Configure network access and database users

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - NoSQL database
- **Express.js** - Web framework for Node.js
- **Lucide React** - Beautiful icons

## 📞 Support

For support, email support@taskflow.com or create an issue in the repository.

---

<div align="center">

**Built with ❤️ by [Your Name]**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)

</div>