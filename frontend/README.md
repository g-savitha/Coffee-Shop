# Coffee Shop Frontend Service

This directory contains the Dockerfile for deploying the Coffee Shop frontend service on Railway.

## Deployment

1. In Railway, create a new service and point to this directory
2. Select Docker as the deployment method
3. No specific environment variables are required

## Internal URL

When deployed, this service will be available to other Railway services at:

```
coffee-shop-frontend.railway.internal:80
``` 