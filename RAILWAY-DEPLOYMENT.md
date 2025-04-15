# Railway Deployment Guide

## Backend Service Deployment

1. Create a new Railway project
2. Add a PostgreSQL database from the Railway dashboard
3. Deploy the backend service:
   - Create a new service
   - Connect your Git repository
   - Select Docker deployment
   - Configure environment variables (see below)

### Environment Variables

Required environment variables:
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `8080`
- `JWT_SECRET`: Your JWT secret key
- `DATABASE_URL`: Automatically set by Railway

## Frontend Service Deployment

The frontend application should be deployed separately. We recommend using Netlify or Vercel for optimal performance.

### Frontend Configuration

When deploying the frontend, set the following environment variables:
- `VITE_API_URL`: Your Railway backend service URL

## Accessing Your Application

After deployment:
1. Backend API will be available at: `https://your-service-name.railway.app`
2. Frontend will be available at your chosen hosting provider's URL

For security and monitoring:
- Enable HTTPS
- Set up proper CORS configuration
- Monitor application logs through Railway dashboard
