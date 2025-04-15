# Coffee Shop Proxy Service

This directory contains the Caddy proxy configuration and Dockerfile for deploying on Railway.

## Deployment

1. In Railway, create a new service and point to this directory (`packages/proxy`)
2. Select Docker as the deployment method
3. No specific environment variables are required
4. Configure a domain for public access:
   - Go to Settings > Domains
   - Generate a Railway domain or add a custom domain

## Purpose

This proxy routes traffic between services:
- `/api/*` requests go to the backend service
- All other requests go to the frontend service

## Benefits of Using Caddy

- **Simpler Configuration**: Caddy's configuration is more straightforward than Nginx
- **Automatic HTTPS**: Caddy automatically obtains and renews SSL certificates
- **Modern defaults**: Sensible defaults for HTTP/2, security headers, etc.
- **Lightweight**: Small Docker image size (Alpine-based)

## WebSocket Support

Caddy v2 has built-in WebSocket support without requiring any special configuration. 
WebSocket connections are automatically detected and proxied correctly. Caddy will:

1. Detect the WebSocket upgrade request (`Connection: Upgrade`, `Upgrade: websocket`)
2. Handle the upgrade handshake properly
3. Proxy the WebSocket connection transparently

This makes Caddy an excellent choice for applications that use WebSockets.

## Timeout Configuration

In Caddy v2, transport-related timeout settings must be placed within a `transport` block:

```
reverse_proxy example.com {
    transport http {
        dial_timeout 60s
        read_timeout 30s
        write_timeout 30s
    }
}
```

This is different from other web servers like Nginx, where timeout settings are often placed at the location level.

## Public URL

This is the only service that needs a public URL. When deployed, users will access your application through this service's domain. 