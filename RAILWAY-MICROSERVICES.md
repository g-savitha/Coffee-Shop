# Railway Microservices Deployment Guide

This guide explains how to deploy your Coffee Shop application as separate microservices on Railway.com.

## Architecture

We'll be deploying 3 separate services on Railway:

1. **Backend Service** - Node.js API server (in `packages/backend`)
2. **Frontend Service** - React application served by Caddy (in `packages/frontend`)
3. **Proxy Service** - Caddy gateway that routes traffic between frontend and backend (in `packages/proxy`)

## Prerequisites

1. A [Railway.com](https://railway.com) account
2. Railway CLI installed (optional but recommended)
   ```
   npm install -g @railway/cli
   ```
3. Git and Docker installed on your local machine

## Monorepo Structure

Your monorepo is already organized in a way that works perfectly for microservices deployment:

```
/
└── packages/
    ├── backend/
    │   ├── Dockerfile
    │   └── ... (backend files)
    ├── frontend/
    │   ├── Dockerfile
    │   ├── Caddyfile
    │   └── ... (frontend files)
    └── proxy/
        ├── Dockerfile
        ├── Caddyfile
        └── ... (proxy files)
```

Each package can be deployed as a separate service on Railway.

## Deployment Methods

Railway supports two main approaches for deploying custom Docker-based applications:

### Approach 1: Using Package Directories (Recommended)

Deploy directly from the packages directory:

1. When creating each service in Railway, specify the source directory: 
   - `packages/backend` for backend
   - `packages/frontend` for frontend
   - `packages/proxy` for proxy

2. Railway will automatically detect and use the Dockerfile in each directory.

### Approach 2: Using Docker Build Configuration

If you prefer to deploy from the root of your repository:

1. Deploy each service as an "Empty Service" in Railway.

2. Configure the Docker builder in Railway's service settings to point to the specific Dockerfile in each package.

## Deployment Steps

### Step 1: Backend Service

1. In your Railway project dashboard:
   - Click "New Service" > "Deploy from GitHub"
   - Name it "coffee-shop-backend"
   - Specify source directory as `packages/backend`

2. Set environment variables:
   - `JWT_SECRET=1a4ecab4992e0a9f9f34c171906a614efe30c1916c55edc818d9a534a61141c7`
   - `NODE_ENV=production`
   - `PORT=3000`

3. Link the PostgreSQL database:
   - Go to "Variables" tab
   - Click "Add from service" to link your database connection string

### Step 2: Frontend Service

1. Create a new service:
   - Click "New Service" > "Deploy from GitHub"
   - Name it "coffee-shop-frontend"
   - Specify source directory as `packages/frontend`

### Step 3: Proxy Service

1. Create a new service:
   - Click "New Service" > "Deploy from GitHub"
   - Name it "coffee-shop-proxy"
   - Specify source directory as `packages/proxy`

2. Set up a custom domain:
   - Go to the "Settings" tab
   - Under "Domains", generate a Railway domain or add your custom domain

## About Caddy as a Proxy

Caddy is being used as a reverse proxy in this architecture for several reasons:

**Advantages of Caddy:**
- **Simple Configuration**: Caddy's configuration is much more straightforward than Nginx or other alternatives
- **Automatic HTTPS**: Caddy automatically obtains and renews SSL certificates
- **Modern defaults**: Sensible defaults for HTTP/2, security headers, and other best practices
- **Lightweight**: Small Docker image size with Alpine base
- **Zero-downtime reloads**: Configuration can be changed without dropping connections
- **WebSocket Support**: Built-in native WebSocket support without special configuration

In our setup, Caddy serves two key purposes:
1. The frontend service uses Caddy to serve static React files
2. The proxy service uses Caddy to route traffic between services:
   - `/api/*` requests are forwarded to the backend service
   - All other requests are forwarded to the frontend service

### WebSocket Handling

Caddy v2 handles WebSockets automatically without requiring any special configuration. When Caddy detects a WebSocket upgrade request, it:

1. Recognizes the WebSocket headers (`Connection: Upgrade`, `Upgrade: websocket`)
2. Properly manages the upgrade handshake
3. Transparently proxies the WebSocket connection

This simplifies configuration significantly compared to other web servers that require explicit WebSocket configuration blocks.

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