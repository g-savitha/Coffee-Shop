FROM nginx:alpine

# Copy nginx proxy configuration
COPY proxy.nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 