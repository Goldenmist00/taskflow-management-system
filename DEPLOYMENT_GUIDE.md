# TaskFlow Deployment Guide

Complete step-by-step instructions for deploying TaskFlow to production.

## Prerequisites

- [x] Node.js 18+ installed
- [x] Git repository with TaskFlow code
- [x] Heroku CLI installed
- [x] Vercel account
- [x] MongoDB Atlas cluster ready

## Backend Deployment (Heroku)

### Step 1: Prepare Your Environment

1. **MongoDB Atlas Setup**:
   ```bash
   # Create cluster and get connection string
   # Format: mongodb+srv://username:password@cluster.mongodb.net/taskflow
   ```

2. **Generate Secure Secrets**:
   ```bash
   # JWT Secret (minimum 32 characters)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Admin Secret (strong password)
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

### Step 2: Deploy Backend to Heroku

```bash
# 1. Login to Heroku
heroku login

# 2. Navigate to backend directory
cd backend

# 3. Initialize git if not already done
git init
git add .
git commit -m "Initial backend commit"

# 4. Create Heroku app (replace with your preferred name)
heroku create taskflow-backend-[your-name]

# 5. Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/taskflow"
heroku config:set JWT_SECRET="your-generated-jwt-secret-32-chars-minimum"
heroku config:set ADMIN_SECRET="your-secure-admin-secret"
heroku config:set NODE_ENV="production"

# 6. Deploy to Heroku
git push heroku main

# 7. Open your deployed backend
heroku open
```

### Step 3: Test Backend Deployment

```bash
# Test health endpoint
curl https://your-app-name.herokuapp.com/api/v1/health

# Expected response:
# {"message":"Server is running!"}

# Test Swagger documentation
# Visit: https://your-app-name.herokuapp.com/api-docs
```

## Frontend Deployment (Vercel)

### Step 1: Update Environment Variables

1. **Update local `.env.local`**:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-app.herokuapp.com
   ```

2. **Test locally with production backend**:
   ```bash
   npm run dev
   # Test login/register with your deployed backend
   ```

### Step 2: Deploy to Vercel

1. **Via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the root directory (not backend)

2. **Configure Environment Variables in Vercel**:
   - Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_BASE_URL` = `https://your-backend-app.herokuapp.com`

3. **Deploy**:
   - Vercel automatically builds and deploys
   - Get your URL: `https://your-project.vercel.app`

### Step 3: Test Full Application

1. **Registration**: Create new user account
2. **Login**: Sign in with credentials
3. **Tasks**: Create, edit, delete tasks
4. **Admin Setup**: 
   - Visit `/admin-setup`
   - Use your production `ADMIN_SECRET`
5. **Admin Features**: Test user management

## Post-Deployment Configuration

### Update CORS (if needed)

If you encounter CORS issues, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

### Update Swagger Server URL

In `backend/server.js`, update the Swagger configuration:

```javascript
servers: [
  {
    url: 'https://your-backend-app.herokuapp.com',
    description: 'Production server'
  },
  {
    url: 'http://localhost:5000',
    description: 'Development server'
  }
]
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**:
   - Check MongoDB Atlas network access (allow 0.0.0.0/0)
   - Verify connection string format
   - Ensure database user has proper permissions

2. **Heroku Build Failed**:
   ```bash
   # Check logs
   heroku logs --tail
   
   # Common fixes
   heroku config:set NODE_ENV=production
   ```

3. **CORS Errors**:
   - Add your Vercel domain to CORS origins
   - Redeploy backend after CORS update

4. **Environment Variables**:
   ```bash
   # Check Heroku config
   heroku config
   
   # Check Vercel config in dashboard
   ```

### Useful Commands

```bash
# Heroku
heroku logs --tail                    # View live logs
heroku restart                        # Restart app
heroku config                         # View environment variables
heroku run node                       # Run Node.js console

# Vercel
vercel --prod                         # Deploy from CLI
vercel logs                           # View deployment logs
vercel env ls                         # List environment variables
```

## Security Checklist

- [x] Changed default admin secret from `admin123`
- [x] Used strong JWT secret (32+ characters)
- [x] MongoDB Atlas network access configured
- [x] Environment variables set in production
- [x] HTTPS enabled (automatic with Heroku/Vercel)
- [x] CORS configured for production domains

## Final URLs

After successful deployment, update these in your README:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend-app.herokuapp.com`
- **API Docs**: `https://your-backend-app.herokuapp.com/api-docs`

## Next Steps

1. Set up monitoring (Heroku metrics, Vercel analytics)
2. Configure custom domains
3. Set up CI/CD pipelines
4. Implement logging and error tracking
5. Add performance monitoring