# 📚 Task Management API Documentation

## 🚀 Quick Start

### Access Swagger UI
Once the server is running, access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

### Base URL
```
http://localhost:5000/api/v1
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Get your token by calling the `/auth/login` endpoint.

## 📋 API Endpoints Overview

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/create-admin` | Create admin account | No (requires secret) |

### Task Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | Get tasks (role-based) | Yes |
| POST | `/tasks` | Create new task | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |

### Admin Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks/users` | Get all users | Yes (Admin only) |

## 🔑 Admin Setup

To create an admin account, use the admin secret: `admin123`

```bash
curl -X POST http://localhost:5000/api/v1/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com", 
    "password": "adminpassword123",
    "adminSecret": "admin123"
  }'
```

## 📊 Data Models

### User Schema
```json
{
  "_id": "string",
  "name": "string",
  "email": "string (email format)",
  "role": "user | admin"
}
```

### Task Schema
```json
{
  "_id": "string",
  "title": "string",
  "description": "string", 
  "status": "pending | in-progress | completed",
  "priority": "low | medium | high",
  "dueDate": "string (ISO date)",
  "createdBy": "User object",
  "assignedTo": "User object",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

## 🎯 Usage Examples

### 1. Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### 2. Create and Manage Tasks
```bash
# Create task
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete documentation",
    "description": "Write API documentation",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59Z"
  }'

# Get tasks
curl -X GET http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update task
curl -X PUT http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "completed"}'
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage  
- **Role-Based Access**: Admin vs User permissions
- **Input Validation**: Request validation and sanitization
- **CORS Enabled**: Cross-origin resource sharing configured

## 📱 Frontend Integration

The API is designed to work with the Next.js frontend. Key integration points:

- **Authentication Flow**: Login → Store JWT → Use in requests
- **Role-Based UI**: Different interfaces for admin vs users
- **Real-time Updates**: Task CRUD operations with immediate UI updates
- **Error Handling**: Consistent error responses for UI feedback

## 🔧 Development

### Start Server
```bash
cd backend
npm install
npm run dev
```

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Testing with Swagger UI
1. Start the server: `npm run dev`
2. Open browser: `http://localhost:5000/api-docs`
3. Use "Authorize" button to add your JWT token
4. Test all endpoints interactively

## 📈 API Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🎉 Features

- ✅ Complete CRUD operations for tasks
- ✅ User authentication and authorization  
- ✅ Role-based access control
- ✅ Task assignment (admin feature)
- ✅ Priority and status management
- ✅ Due date tracking
- ✅ Interactive API documentation
- ✅ Comprehensive error handling
- ✅ Security best practices