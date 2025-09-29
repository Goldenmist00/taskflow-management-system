# Task Management Backend

Node.js/Express backend API for the task management application.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment variables:**
   Create a `.env` file from the provided example and fill in your secrets.
   ```bash
   cp .env.example .env
   ```
   Add your values for `MONGODB_URI` and `JWT_SECRET`. Never commit real secrets.
   
   **Important:** Use a strong random value for `JWT_SECRET` in production.

3. **Start the server:**
   ```bash
   # Development (with auto-restart)
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Tasks (requires JWT token)
- `GET /api/v1/tasks` - Get user's tasks
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Health Check
- `GET /api/v1/health` - Server status

## Database Schema

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- role (String, default: 'user')

### Task
- title (String, required)
- description (String, required)
- createdBy (ObjectId, ref: User)
- timestamps (createdAt, updatedAt)

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- CORS enabled
- User-specific task access (users can only see/modify their own tasks)