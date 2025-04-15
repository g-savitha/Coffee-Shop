FROM nginx:alpine

# Install envsubst for dynamic configuration
RUN apk add --no-cache bash gettext

# Copy nginx proxy configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Create startup script
RUN echo '#!/bin/bash\n\
envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Start nginx with dynamic configuration
CMD ["/docker-entrypoint.sh"] 