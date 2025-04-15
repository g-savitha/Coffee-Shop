FROM nginx:alpine

# Install bash and gettext for environment variable substitution
RUN apk add --no-cache bash gettext

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Create a script to replace variables and start nginx
RUN echo '#!/bin/sh\n\
# Create nginx.conf from template\n\
envsubst "$(env | sed -e "s/=.*//" | sed -e "s/^/\$/g" | tr "\\n" " ")" < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf\n\
\n\
# Print the generated configuration\n\
echo "Generated Nginx configuration:"\n\
cat /etc/nginx/conf.d/default.conf\n\
\n\
# Start nginx\n\
exec nginx -g "daemon off;"\n\
' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Start nginx with dynamic configuration
CMD ["/docker-entrypoint.sh"] 