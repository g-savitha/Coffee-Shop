# Railway Microservices Deployment Guide

This guide explains how to deploy your Coffee Shop application as separate microservices on Railway.com.

## Architecture

We'll be deploying 3 separate services on Railway:

1. **Backend Service** - Node.js API server
2. **Frontend Service** - React application served by Nginx
3. **Proxy Service** - Nginx gateway that routes traffic between frontend and backend

## Prerequisites

1. A [Railway.com](https://railway.com) account
2. Railway CLI installed (optional but recommended)
   ```
   npm install -g @railway/cli
   ```
3. Git and Docker installed on your local machine

## Deployment Steps

### Step 1: Create Backend Service

1. In your Railway project, create a new service:
   ```bash
   railway add
   ```
   - Select "Docker Image"
   - Name it "coffee-shop-backend"
   - Configure to use `backend.Dockerfile`

2. Set up environment variables:
   - Through the Railway Dashboard, add:
     - `JWT_SECRET=1a4ecab4992e0a9f9f34c171906a614efe30c1916c55edc818d9a534a61141c7`
     - `NODE_ENV=production`
     - `PORT=3000`
     - Connect the PostgreSQL database to this service through the Railway UI

### Step 2: Create Frontend Service

1. In your Railway project, create a new service:
   ```bash
   railway add
   ```
   - Select "Docker Image"
   - Name it "coffee-shop-frontend"
   - Configure to use `frontend.Dockerfile`

2. No additional environment variables required for the frontend

### Step 3: Create Proxy Service

1. In your Railway project, create a new service:
   ```bash
   railway add
   ```
   - Select "Docker Image"
   - Name it "coffee-shop-proxy"
   - Configure to use `proxy.Dockerfile`

2. Set up a custom domain in Railway:
   ```bash
   railway domain
   ```
   - Choose to either add a custom domain or generate a Railway provided domain

### Step 4: Deploy All Services

Deploy all services:

```bash
railway up
```

## About Nginx as a Proxy

Nginx is being used as a reverse proxy in this architecture for several reasons:

**Advantages of Nginx:**
- Very high performance and battle-tested
- Widely used in production environments with a large community
- Excellent for routing traffic between microservices
- Extremely lightweight (Alpine image is only ~7MB)
- Highly configurable for complex routing needs
- Efficient static file serving capability

In our setup, Nginx serves two key purposes:
1. The frontend service uses Nginx to serve static React files
2. The proxy service uses Nginx to route traffic between services:
   - `/api/*` requests are forwarded to the backend service
   - All other requests are forwarded to the frontend service

## Troubleshooting

If you encounter issues:

1. **Check Railway logs** for each service
2. **Verify environment variables** are correctly set
3. **Check service connectivity** using Railway's internal domains
4. **Test the health endpoints** at `/health` for each service

## Internal Networking

Railway provides internal DNS for services to communicate with each other. Your services can reach each other at:

- Backend: `coffee-shop-backend.railway.internal:3000`
- Frontend: `coffee-shop-frontend.railway.internal:80`
- Proxy: `coffee-shop-proxy.railway.internal:80`

The public internet will only access your application through the proxy service. 