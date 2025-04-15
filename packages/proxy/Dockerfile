FROM nginx:alpine

# Install bash and gettext for environment variable substitution
RUN apk add --no-cache bash gettext

# Copy nginx proxy configuration
# The .template files in this directory are automatically processed by the nginx image
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port
EXPOSE 80

# The standard nginx image CMD will start the server
CMD ["nginx", "-g", "daemon off;"] 