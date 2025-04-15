FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY packages/backend/package*.json packages/backend/

# Install dependencies
RUN npm install --production

# Copy backend source
COPY packages/backend /app/packages/backend

# Set environment variables
ENV NODE_ENV=production

# Add health check endpoint
RUN echo "app.get('/health', (req, res) => res.status(200).send('ok'));" >> /app/packages/backend/src/server.js

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:backend"] 