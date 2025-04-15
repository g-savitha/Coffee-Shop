FROM nginx:alpine

# Copy nginx configuration directly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx directly (no custom entrypoint needed)
CMD ["nginx", "-g", "daemon off;"] 