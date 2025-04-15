FROM nginx:alpine

# Install bash and gettext for environment variable substitution
RUN apk add --no-cache bash

# Create a custom entrypoint script
RUN echo '#!/bin/sh\n\
# Export environment variables with ENV_ prefix for Nginx\n\
env | while IFS= read -r line; do\n\
  if [[ $line == BACKEND_* ]] || [[ $line == FRONTEND_* ]]; then\n\
    name=$(echo $line | cut -d= -f1)\n\
    value=$(echo $line | cut -d= -f2-)\n\
    export "ENV_$name=$value"\n\
  fi\n\
done\n\
\n\
# Start Nginx\n\
exec nginx -g "daemon off;"\n\
' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start the custom entrypoint
CMD ["/docker-entrypoint.sh"] 