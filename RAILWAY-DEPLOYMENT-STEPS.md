# Quick Start: Railway Microservices Deployment

## Approach 1: Deploy Using Subdirectories

### Step 1: Prepare Repository Structure

Reorganize your repository into subdirectories:

```
/
├── backend/
│   ├── Dockerfile       # Rename from backend.Dockerfile
│   └── ... (backend files)
├── frontend/
│   ├── Dockerfile       # Rename from frontend.Dockerfile
│   └── ... (frontend files)
└── proxy/
    ├── Dockerfile       # Rename from proxy.Dockerfile
    ├── nginx.conf
    └── ... (proxy files)
```

### Step 2: Deploy Backend Service

1. Navigate to your Railway project in the dashboard
2. Click "New Service" > "Deploy from GitHub" 
3. Name it "coffee-shop-backend"
4. Configure:
   - Source Directory: `/backend`
   - Select "Docker" as the deployment method
5. Set variables:
   - `JWT_SECRET=1a4ecab4992e0a9f9f34c171906a614efe30c1916c55edc818d9a534a61141c7`
   - `NODE_ENV=production`
   - `PORT=3000`
6. Link to your PostgreSQL database service

### Step 3: Deploy Frontend Service

1. Click "New Service" > "Deploy from GitHub"
2. Name it "coffee-shop-frontend"
3. Configure:
   - Source Directory: `/frontend`
   - Select "Docker" as the deployment method

### Step 4: Deploy Nginx Proxy Service

1. Click "New Service" > "Deploy from GitHub"
2. Name it "coffee-shop-proxy"
3. Configure:
   - Source Directory: `/proxy`
   - Select "Docker" as the deployment method
4. Generate a domain for the proxy service:
   - Go to the "Settings" tab
   - Under "Domains", generate a Railway domain or add your custom domain

## Approach 2: Deploy Using Docker Build Configuration

### Step 1: Keep Files as They Are

Maintain the current repository structure with separate Dockerfiles.

### Step 2: Deploy Backend Service

1. Navigate to your Railway project
2. Click "New Service" > "Deploy Empty Service"
3. In the service settings:
   - Go to "Settings" tab
   - Under "Service Settings" find "Build & Deploy"
   - Click "Edit" in the "Builder" section
   - Select "Docker"
   - In "Docker Build Options" add:
     - Dockerfile path: `backend.Dockerfile`
4. Set environment variables:
   - `JWT_SECRET=1a4ecab4992e0a9f9f34c171906a614efe30c1916c55edc818d9a534a61141c7`
   - `NODE_ENV=production`
   - `PORT=3000`
5. Link to your PostgreSQL database service

### Step 3: Deploy Frontend Service

1. Click "New Service" > "Deploy Empty Service"
2. In the service settings:
   - Go to "Settings" tab
   - Under "Service Settings" find "Build & Deploy"
   - Click "Edit" in the "Builder" section
   - Select "Docker" 
   - In "Docker Build Options" add:
     - Dockerfile path: `frontend.Dockerfile`

### Step 4: Deploy Nginx Proxy Service

1. Click "New Service" > "Deploy Empty Service"
2. In the service settings:
   - Go to "Settings" tab
   - Under "Service Settings" find "Build & Deploy"
   - Click "Edit" in the "Builder" section
   - Select "Docker"
   - In "Docker Build Options" add:
     - Dockerfile path: `proxy.Dockerfile`
3. Generate a domain for the proxy service in the "Settings" tab

## Testing Your Deployment

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