# Quick Start: Railway Microservices Deployment

## Step 1: Deploy Backend Service

1. Navigate to your Railway project in the dashboard
2. Click "New Service" > "Deploy from GitHub" (or "Docker Image")
3. Name it "coffee-shop-backend"
4. Configure:
   - Root Directory: `/`
   - Dockerfile Path: `backend.Dockerfile`
5. Set variables:
   - `JWT_SECRET=1a4ecab4992e0a9f9f34c171906a614efe30c1916c55edc818d9a534a61141c7`
   - `NODE_ENV=production`
   - `PORT=3000`
6. Link to your PostgreSQL database service

## Step 2: Deploy Frontend Service

1. Click "New Service" > "Deploy from GitHub" (or "Docker Image")
2. Name it "coffee-shop-frontend"
3. Configure:
   - Root Directory: `/`
   - Dockerfile Path: `frontend.Dockerfile`

## Step 3: Deploy Nginx Proxy Service

1. Click "New Service" > "Deploy from GitHub" (or "Docker Image")
2. Name it "coffee-shop-proxy"
3. Configure:
   - Root Directory: `/`
   - Dockerfile Path: `proxy.Dockerfile`
4. Generate a domain for the proxy service:
   - Go to the "Settings" tab
   - Under "Domains", generate a Railway domain or add your custom domain

## Step 4: Test Your Deployment

1. Access your application via the proxy service domain
2. Verify that:
   - Frontend loads correctly
   - API requests work properly
   - Database connections are successful

## Troubleshooting

If you encounter issues:

1. Check logs for each service
2. Verify environment variables
3. Confirm service connectivity via the `/health` endpoints
4. Ensure database configuration is correct 