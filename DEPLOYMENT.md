# Nestro Backend - Render Deployment Guide

## Environment Variables Required on Render

Configure these environment variables in your Render dashboard:

### Required
- `MONGODB_URI` - Your MongoDB connection string (Atlas or other cloud MongoDB)
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/nestro`

### Optional (for full functionality)
- `PORT` - Automatically set by Render (usually 10000)
- `NODE_ENV` - Set to `production` for production environment
- `BREVO_API_KEY` - For email functionality
- `BREVO_SENDER_EMAIL` - Sender email address
- `BREVO_SENDER_NAME` - Sender name
- `CLOUD_NAME` - Cloudinary cloud name
- `API_KEY` - Cloudinary API key  
- `API_SECRET` - Cloudinary API secret
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

## Deployment Settings

### Render Service Configuration
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node.js`
- **Node Version**: `18.x` or later

### Health Check
The application provides a health check endpoint at `/health` that returns:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ"
}
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get the connection string from Atlas dashboard
6. Set `MONGODB_URI` in Render environment variables

### Local Development
For local development, you can use:
```
MONGODB_URI=mongodb://localhost:27017/nestro
```

## Security Features Enabled
- Helmet.js for security headers
- CORS with configurable origins
- Rate limiting (100 requests per 15 minutes globally, 5 per 15 minutes for auth)
- Request size limits (10MB)
- Cookie parsing with security
- Proxy trust for accurate client IPs

## Troubleshooting

### Database Connection Issues
- Ensure `MONGODB_URI` is set correctly
- Check if your IP is whitelisted in Atlas
- Verify database user credentials
- Check network connectivity

### Build Issues
- Ensure all dependencies are listed in `package.json`
- Check Node.js version compatibility
- Verify start command is `npm start`

### CORS Issues
- Add your frontend domain to the allowed origins in `src/app.js`
- For production, update the `allowedOrigins` array