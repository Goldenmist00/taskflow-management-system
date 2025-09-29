# TaskFlow Railway Deployment Guide

Complete step-by-step instructions for deploying TaskFlow backend to Railway and frontend to Vercel.

## Prerequisites

- [x] Node.js 18+ installed
- [x] Git repository with TaskFlow code
- [x] Railway CLI installed
- [x] Vercel account
- [x] MongoDB Atlas cluster ready

## Backend Deployment (Railway)

### Step 1: Install Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Verify installation
railway --version
```

### Step 2: Prepare Environment Variables

1. **MongoDB Atlas Setup**:
   - Create cluster and get connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/taskflow`
   - Configure network access to allow all IPs (0.0.0.0/0)

2. **Generate Secure Secrets**:
   ```bash
   # JWT Secret (minimum 32 characters)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Admin Secret (strong password)
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

### Step 3: Deploy Backend to Railway

```bash
# 1. Navigate to backend directory
cd backend

# 2. Login to Railway
railway login

# 3. Initialize Railway project
railway init

# 4. Set environment variables
railway variables set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/taskflow"
railway variables set JWT_SECRET="your-generated-jwt-secret-32-chars-minimum"
railway variables set ADMIN_SECRET="your-secure-admin-secret"
railway variables set NODE_ENV="production"

# 5. Deploy to Railway
railway up

# 6. Get your deployment URL
railway status
```

### Step 4: Test Backend Deployment

```bash
# Test health endpoint (replace with your Railway URL)
curl https://taskflow-production.up.railway.app/api/v1/health

# Expected response:
# {"message":"Server is running!"}

# Test Swagger documentation
# Visit: https://taskflow-production.up.railway.app/api-docs
```

## Frontend Deployment (Vercel)

### Step 1: Update Environment Variables

1. **Update local `.env.local`**:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://taskflow-production.up.railway.app
   ```

2. **Test locally with production backend**:
   ```bash
   # Navigate to project root
   cd ..
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
   - Add: `NEXT_PUBLIC_API_BASE_URL` = `https://taskflow-production.up.railway.app`

3. **Deploy**:
   - Vercel automatically builds and deploys
   - Get your URL: `https://taskflow-frontend.vercel.app`

### Step 3: Update Backend CORS

After getting your Vercel URL, update the backend CORS configuration:

```bash
# Set frontend URL in Railway
railway variables set FRONTEND_URL="https://your-project.vercel.app"

# Redeploy backend
railway up
```

### Step 4: Test Full Application

1. **Registration**: Create new user account
2. **Login**: Sign in with credentials
3. **Tasks**: Create, edit, delete tasks
4. **Admin Setup**: 
   - Visit `/admin-setup`
   - Use your production `ADMIN_SECRET`
5. **Admin Features**: Test user management

## Railway CLI Commands Reference

```bash
# Project Management
railway login                          # Login to Railway
railway init                           # Initialize new project
railway link                           # Link to existing project
railway status                         # Show project status
railway open                           # Open project in browser

# Deployment
railway up                             # Deploy current directory
railway up --detach                    # Deploy without logs
railway redeploy                       # Redeploy last deployment

# Environment Variables
railway variables                      # List all variables
railway variables set KEY=value        # Set variable
railway variables delete KEY           # Delete variable

# Logs and Debugging
railway logs                           # View application logs
railway logs --follow                  # Follow logs in real-time
railway shell                          # Open shell in deployment

# Domains
railway domain                         # Show current domain
railway domain generate                # Generate new domain
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**:
   - Check MongoDB Atlas network access (allow 0.0.0.0/0)
   - Verify connection string format
   - Ensure database user has proper permissions

2. **Railway Build Failed**:
   ```bash
   # Check logs
   railway logs
   
   # Common fixes
   railway variables set NODE_ENV=production
   ```

3. **CORS Errors**:
   - Add your Vercel domain to FRONTEND_URL
   - Redeploy backend after CORS update

4. **Environment Variables**:
   ```bash
   # Check Railway variables
   railway variables
   
   # Check Vercel config in dashboard
   ```

## Security Checklist

- [x] Changed default admin secret from `admin123`
- [x] Used strong JWT secret (32+ characters)
- [x] MongoDB Atlas network access configured
- [x] Environment variables set in production
- [x] HTTPS enabled (automatic with Railway/Vercel)
- [x] CORS configured for production domains

## Final URLs

After successful deployment, you'll have:

- **Backend**: `https://taskflow-production.up.railway.app`
- **Frontend**: `https://taskflow-frontend.vercel.app`
- **API Docs**: `https://taskflow-production.up.railway.app/api-docs`

## Cost Considerations

### Railway Pricing
- **Starter Plan**: $5/month per service
- **Pro Plan**: $20/month per service
- **Free Trial**: Available for new users

### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for teams

## Next Steps

1. Set up custom domains
2. Configure monitoring and alerts
3. Set up CI/CD pipelines
4. Implement logging and error tracking
5. Add performance monitoring
6. Set up backup strategies