# Coffee Shop Proxy Service

This directory contains the Dockerfile for deploying the Coffee Shop Nginx proxy service on Railway.

## Deployment

1. In Railway, create a new service and point to this directory
2. Select Docker as the deployment method
3. No specific environment variables are required
4. Configure a domain for public access:
   - Go to Settings > Domains
   - Generate a Railway domain or add a custom domain

## Purpose

This proxy routes traffic between services:
- `/api/*` requests go to the backend service
- All other requests go to the frontend service

## Public URL

This is the only service that needs a public URL. When deployed, users will access your application through this service's domain. 