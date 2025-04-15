# Coffee Shop Backend Service

This directory contains the backend service code and Dockerfile for deploying on Railway.

## Deployment

1. In Railway, create a new service and point to this directory (`packages/backend`)
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