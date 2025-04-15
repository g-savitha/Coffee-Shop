FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY packages/frontend/package*.json packages/frontend/

# Install dependencies
RUN npm install

# Copy frontend source
COPY packages/frontend /app/packages/frontend

# Build frontend
WORKDIR /app/packages/frontend
RUN npm run build

# Use nginx for serving the frontend
FROM nginx:alpine

# Copy built frontend assets to nginx
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 