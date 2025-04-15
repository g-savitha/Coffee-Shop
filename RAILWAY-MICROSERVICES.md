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

## Deployment Methods

Railway supports two main approaches for deploying custom Docker-based applications:

### Approach 1: Using Subdirectories

This approach requires reorganizing your repository to have separate directories with standard `Dockerfile` names.

1. **Repository Structure:**
   ```
   /
   ├── backend/
   │   ├── Dockerfile       # Renamed from backend.Dockerfile
   │   └── ... (backend files)
   ├── frontend/
   │   ├── Dockerfile       # Renamed from frontend.Dockerfile
   │   └── ... (frontend files)
   └── proxy/
       ├── Dockerfile       # Renamed from proxy.Dockerfile
       ├── nginx.conf
       └── ... (proxy files)
   ```

2. **When creating a service** in Railway, specify the source directory for each service.

### Approach 2: Using Docker Build Configuration

This approach allows you to keep the current file structure and specify custom Dockerfile paths.

1. **Keep current repository structure** with separate Dockerfiles.

2. **Configure the Docker builder** in Railway's service settings to use your specific Dockerfile.

## Deployment Steps

### Step 1: Backend Service

1. In your Railway project dashboard:
   - Click "New Service" > "Deploy Empty Service" (or from GitHub)
   - Name it "coffee-shop-backend"

2. Configure the Docker builder:
   - Go to the "Settings" tab
   - Under "Service Settings" > "Build & Deploy"
   - Click "Edit" in the "Builder" section
   - Select "Docker"
   - In "Docker Build Options" add:
     - Dockerfile path: `backend.Dockerfile` (or use `/backend/Dockerfile` if using Approach 1)

3. Set environment variables:
   - `JWT_SECRET=1a4ecab4992e0a9f9f34c171906a614efe30c1916c55edc818d9a534a61141c7`
   - `NODE_ENV=production`
   - `PORT=3000`

4. Link the PostgreSQL database:
   - Go to "Variables" tab
   - Click "Add from service" to link your database connection string

### Step 2: Frontend Service

1. Create a new service:
   - Click "New Service" > "Deploy Empty Service" (or from GitHub)
   - Name it "coffee-shop-frontend"

2. Configure the Docker builder:
   - Go to the "Settings" tab
   - Under "Service Settings" > "Build & Deploy"
   - Click "Edit" in the "Builder" section
   - Select "Docker"
   - In "Docker Build Options" add:
     - Dockerfile path: `frontend.Dockerfile` (or use `/frontend/Dockerfile` if using Approach 1)

### Step 3: Proxy Service

1. Create a new service:
   - Click "New Service" > "Deploy Empty Service" (or from GitHub)
   - Name it "coffee-shop-proxy"

2. Configure the Docker builder:
   - Go to the "Settings" tab
   - Under "Service Settings" > "Build & Deploy"
   - Click "Edit" in the "Builder" section
   - Select "Docker"
   - In "Docker Build Options" add:
     - Dockerfile path: `proxy.Dockerfile` (or use `/proxy/Dockerfile` if using Approach 1)

3. Set up a custom domain:
   - Go to the "Settings" tab
   - Under "Domains", generate a Railway domain or add your custom domain

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