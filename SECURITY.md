# Security Notice

## ⚠️ Important Security Information

### Environment Variables
- **NEVER** commit `.env` files with real credentials to version control
- Always use `.env.example` files with placeholder values
- Rotate any exposed credentials immediately

### MongoDB Atlas Security
If you accidentally exposed MongoDB credentials:
1. **Immediately change your MongoDB Atlas password**
2. **Rotate your database user credentials**
3. **Update connection strings in your deployment platform**
4. **Review MongoDB Atlas access logs**

### JWT Secrets
- Use cryptographically secure random strings (minimum 32 characters)
- Generate new secrets for production: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never use default or example secrets in production

### Admin Secrets
- Change the default admin secret `admin123` immediately
- Use strong, unique passwords for admin accounts
- Consider implementing additional admin authentication layers

### Best Practices
1. Use environment variables for all sensitive data
2. Enable 2FA on all service accounts (MongoDB Atlas, Vercel, Render, etc.)
3. Regularly rotate credentials
4. Monitor for exposed secrets in your repositories
5. Use secret scanning tools in your CI/CD pipeline

### Incident Response
If you suspect a security breach:
1. Immediately rotate all credentials
2. Review access logs
3. Update all deployment configurations
4. Monitor for unusual activity

## Secure Configuration Examples

### Backend Environment Variables
```env
# Use strong, unique values - these are examples only!
MONGODB_URI=mongodb+srv://your-username:your-secure-password@your-cluster.mongodb.net/database
JWT_SECRET=your-cryptographically-secure-32-plus-character-secret
ADMIN_SECRET=your-strong-admin-secret
NODE_ENV=production
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

Remember: The `NEXT_PUBLIC_` prefix makes variables available to the browser, so never use it for sensitive data!