# Deploying the Coffee Shop Application on Railway

This guide provides instructions on how to deploy this monorepo application on Railway.com using Dockerfiles.

## Prerequisites

1. A [Railway.com](https://railway.com) account
2. Railway CLI installed (optional but recommended)
   ```
   npm install -g @railway/cli
   ```
3. Git and Docker installed on your local machine

## Deployment Steps

### Option 1: Deploy from GitHub

1. **Fork or push this repository to GitHub**
   Make sure your repository is public or connected to your Railway account.

2. **Create a new project in Railway**
   - Visit [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" and select "Deploy from GitHub repo"
   - Select your GitHub repository
   - Railway will automatically detect the Dockerfile and deploy it

3. **Setup Database**
   - Click "New" > "Database" > "PostgreSQL"
   - Railway will automatically provision a PostgreSQL database and add the connection variables to your project

4. **Link your services**
   - Go to your project settings
   - Make sure the PostgreSQL environment variables are accessible to your application service

### Option 2: Deploy using Railway CLI

1. **Login to Railway CLI**
   ```bash
   railway login
   ```

2. **Initialize Railway project in your repository**
   ```bash
   railway init
   ```

3. **Link to an existing project or create a new one**
   Follow the CLI prompts to either create a new project or link to an existing one.

4. **Add a PostgreSQL database**
   ```bash
   railway add
   ```
   Select PostgreSQL from the options.

5. **Deploy the application**
   ```bash
   railway up
   ```

### Option 3: Manual Deployment

1. **Create a new project in Railway**
   - Visit [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" > "Deploy from Dockerfile"

2. **Add your GitHub Repository**
   - Enter your GitHub repository URL
   - Configure the service settings:
     - Root Directory: `/`
     - Dockerfile Path: `railway.Dockerfile`

3. **Add PostgreSQL Database**
   - Click "New" > "Database" > "PostgreSQL" within your project

4. **Configure Environment Variables**
   - Go to the "Variables" tab in your service
   - Make sure `NODE_ENV=production` is set
   - Railway automatically connects your service to the database by setting `DATABASE_URL`

5. **Deploy**
   - Railway will automatically deploy your application
   - Monitor the deployment in the "Deployments" tab

## Troubleshooting

If you encounter any issues during deployment:

1. **Check Logs**
   - Go to the "Logs" tab of your service to see if there are any errors

2. **Verify Environment Variables**
   - Make sure all required environment variables are set
   - Check that your service has access to the database connection string

3. **Redeploy**
   - Sometimes issues can be resolved by triggering a redeployment
   - Click "Deploy" in your service to trigger a new deployment

4. **Health Check**
   - The application exposes a `/health` endpoint that should return `ok`
   - If this endpoint is failing, check your server logs

## Accessing Your Application

Once deployed, Railway will provide you with a public URL for your application. You can find this URL in the "Settings" tab of your service.

Your application will be accessible at the provided URL. The backend API will be available at `/api` endpoints, and the frontend will be served at the root URL. 