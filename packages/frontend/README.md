# Coffee Shop Frontend Service

This directory contains the React frontend application and Caddy configuration for deploying on Railway.

## Development

To run the frontend in development mode:

```bash
npm install
npm run dev
```

## Building

To build the frontend:

```bash
npm run build
```

This creates a `dist` directory with the built static files.

## Deployment

1. In Railway, create a new service and point to this directory (`packages/frontend`)
2. Select Docker as the deployment method
3. No specific environment variables are required for production

## About Caddy for Static Files

The frontend uses Caddy to serve the static React application. Caddy was chosen for several reasons:

- **Simple configuration**: The Caddyfile is much simpler than equivalent Nginx configs
- **Automatic handling of SPA routing**: Properly routes all paths to index.html for client-side routing
- **Performance optimizations**: Includes compression and caching by default
- **Security**: Provides good security defaults out of the box

The Caddy configuration is in the `Caddyfile` and handles:
- Serving static files from the `/srv` directory
- SPA client-side routing support
- Gzip compression
- Health check endpoint

## Internal URL

When deployed, this service will be available to other Railway services at:

```
coffee-shop-frontend.railway.internal:80
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
