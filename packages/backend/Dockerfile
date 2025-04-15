FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend source
COPY . /app/backend

# Set environment variables
ENV NODE_ENV=production

# Add health check endpoint
RUN echo "app.get('/health', (req, res) => res.status(200).send('ok'));" >> /app/backend/src/server.js

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "/app/backend/src/server.js"] 