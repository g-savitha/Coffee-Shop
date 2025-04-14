# This is a simple wrapper for railway.Dockerfile
# Railway expects a file named "Dockerfile" in the root of the project

# Just include the railway.Dockerfile contents
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY packages/frontend/package*.json packages/frontend/
COPY packages/backend/package*.json packages/backend/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build frontend
WORKDIR /app/packages/frontend
RUN npm run build

# Create production image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy built frontend assets
COPY --from=builder /app/packages/frontend/dist /app/packages/frontend/dist

# Copy backend source
COPY --from=builder /app/packages/backend /app/packages/backend
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json /app/

# Set environment variables
ENV NODE_ENV=production

# Add health check endpoint
RUN echo "app.get('/health', (req, res) => res.status(200).send('ok'));" >> /app/packages/backend/src/server.js

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:backend"] 