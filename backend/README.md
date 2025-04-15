# Coffee Shop Backend Service

This directory contains the Dockerfile for deploying the Coffee Shop backend service on Railway.

## Deployment

1. In Railway, create a new service and point to this directory
2. Select Docker as the deployment method
3. Configure environment variables:
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=3000`
4. Link your PostgreSQL database

## Internal URL

When deployed, this service will be available to other Railway services at:

```
coffee-shop-backend.railway.internal:3000
``` 