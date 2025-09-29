# TaskFlow - Complete Task Management System

A modern, full-stack task management application built with **Next.js**, **Express.js**, and **MongoDB**. Features role-based access control, real-time task management, and a beautiful admin dashboard.

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Task%20Management%20System-blue?style=for-the-badge)

## Features

### Authentication & Authorization
- User Registration & Login with JWT authentication
- Role-Based Access Control (Admin vs Regular Users)
- Admin Account Creation with secure secret key
- Protected Routes with automatic redirects
- Session Management with localStorage

### Task Management
- Complete CRUD Operations (Create, Read, Update, Delete)
- Task Status Tracking (Pending, In Progress, Completed)
- Priority Levels (Low, Medium, High)
- Due Date Management with overdue indicators
- Task Assignment (Admin can assign to any user)
- Rich Task Details with descriptions and metadata

### Admin Dashboard
- User-Grouped Task View - Click users to see their tasks
- Task Statistics per user (pending, completed, overdue)
- Global Task Management - Edit/delete any task
- User Management - View all registered users
- Task Assignment Control - Assign tasks to specific users

### Modern UI/UX
- Professional Design with shadcn/ui components
- Responsive Layout for all screen sizes
- Dark/Light Mode support
- Toast Notifications for user feedback
- Modal Confirmations for destructive actions
- Loading States and progress indicators

## Tech Stack

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

## Quick Start

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

## Usage Guide

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

## Configuration

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
- **Admin Secret Key**: `admin123` *(Demo purposes only - MUST be changed in production)*
- **Production Security**: Set `ADMIN_SECRET` environment variable to a strong, unique value
- **First Admin**: Use the `/admin-setup` page with your production admin secret
- **Security**: The demo secret `admin123` should never be used in production environments

## API Documentation

### Swagger / API Docs
- **Local Development**: http://localhost:5000/api-docs
- **Production**: https://taskflow-production.up.railway.app/api-docs *(Replace with your actual Railway URL)*

### Exporting Swagger as Postman Collection
1. **Access Swagger UI**: Visit `/api-docs` endpoint
2. **Export OpenAPI Spec**: 
   - Click the `/api-docs` link or visit `https://your-backend-url/api-docs`
   - Copy the JSON from the raw OpenAPI spec (usually available at `/api-docs.json`)
3. **Import to Postman**:
   - Open Postman → Click "Import"
   - Select "Raw text" and paste the OpenAPI JSON
   - Or use "Link" and enter: `https://your-backend-url/api-docs.json`
   - Postman will generate a complete collection with all endpoints
4. **Configure Authentication**:
   - In Postman collection, set up Bearer Token authentication
   - Use the JWT token obtained from the login endpoint

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

## Project Structure

```
task-management-system/
├── app/                            # Next.js app directory
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   ├── login/                      # Login page
│   ├── register/                   # Registration page
│   ├── admin-setup/                # Admin creation page
│   └── dashboard/                  # Main dashboard
├── components/                     # React components
│   ├── auth/                       # Authentication components
│   ├── tasks/                      # Task management components
│   ├── admin/                      # Admin-specific components
│   └── ui/                         # shadcn/ui components
├── 📁 lib/                         # Utility libraries
│   ├── 📄 api.ts                   # API client
│   └── 📄 utils.ts                 # Helper functions
├── backend/                        # Express.js backend
│   ├── models/                     # MongoDB schemas
│   ├── routes/                     # API routes
│   ├── middleware/                 # Custom middleware
│   ├── server.js                   # Express server
│   └── API_DOCUMENTATION.md        # API docs
├── package.json                    # Frontend dependencies
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
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

### **Live Demo**
- **Frontend**: [https://taskflow-frontend.vercel.app](https://taskflow-frontend.vercel.app) *(Replace with your actual Vercel URL)*
- **Backend API**: [https://taskflow-production.up.railway.app](https://taskflow-production.up.railway.app) *(Replace with your actual Railway URL)*
- **API Documentation**: [https://taskflow-production.up.railway.app/api-docs](https://taskflow-production.up.railway.app/api-docs) *(Replace with your actual Railway URL)*

### **Backend Deployment (Railway)**

#### Prerequisites
- Railway CLI installed
- Git repository initialized
- MongoDB Atlas cluster ready

#### Step 1: Install Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Verify installation
railway --version
```

#### Step 2: Deploy to Railway
```bash
# Navigate to backend directory
cd backend

# Login to Railway
railway login

# Initialize Railway project
railway init

# Set environment variables
railway variables set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/taskflow"
railway variables set JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
railway variables set ADMIN_SECRET="your-production-admin-secret"
railway variables set NODE_ENV="production"

# Deploy to Railway
railway up

# Get deployment status and URL
railway status
```

#### Step 3: Test Backend Deployment
```bash
# Test health endpoint (replace with your Railway URL)
curl https://taskflow-production.up.railway.app/api/v1/health

# Test Swagger docs
# Visit: https://taskflow-production.up.railway.app/api-docs
```

### **Frontend Deployment (Vercel)**

#### Step 1: Update Environment Variables
Update your local `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://taskflow-production.up.railway.app
```

#### Step 2: Deploy to Vercel
1. **Import GitHub Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_BASE_URL` = `https://taskflow-production.up.railway.app`

3. **Deploy**:
   - Vercel will automatically build and deploy
   - Get your deployment URL (e.g., `https://taskflow-frontend.vercel.app`)

#### Step 3: Test Frontend Deployment
1. **Registration Flow**: Create a new user account
2. **Login Flow**: Sign in with created credentials
3. **Task CRUD**: Create, edit, update, and delete tasks
4. **Admin Setup**: Use `/admin-setup` with your production admin secret
5. **Admin Dashboard**: Test user management and task assignment

### **Database (MongoDB Atlas)**
- Create MongoDB Atlas cluster
- Configure network access (allow all IPs: `0.0.0.0/0` for Heroku)
- Create database user with read/write permissions
- Update `MONGODB_URI` in Heroku config vars

## 🚀 Optional Enhancements

### **Docker Setup**
For containerized deployment, consider adding:
```dockerfile
# Dockerfile example for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### **Redis Caching**
Enhance performance with Redis caching for:
- User session management
- Frequently accessed task lists
- API response caching
- Real-time notifications

```bash
# Add Redis to your stack
npm install redis
# Implement caching middleware for task-related APIs
```

### **Automated Setup Scripts**
Create npm scripts for easier development setup:
```json
{
  "scripts": {
    "setup": "npm install && cd backend && npm install",
    "dev:all": "concurrently \"npm run dev\" \"cd backend && npm run dev\"",
    "build:all": "npm run build && cd backend && npm install --production"
  }
}
```

### **Scalability Considerations**
- **Microservices**: Split auth, tasks, and notifications into separate services
- **Load Balancing**: Use Nginx or cloud load balancers for multiple instances
- **Database Optimization**: Implement MongoDB indexing and sharding strategies
- **Monitoring**: Add logging with Winston, monitoring with Prometheus/Grafana
- **CI/CD**: Implement automated testing and deployment pipelines

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