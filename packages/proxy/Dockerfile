FROM nginx:alpine

# Install envsubst for dynamic configuration
RUN apk add --no-cache bash gettext

# Copy nginx proxy configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Create startup script with proper line endings
RUN printf '#!/bin/sh\nenvsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf\nnginx -g "daemon off;"\n' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Start nginx with dynamic configuration
CMD ["/docker-entrypoint.sh"] 