# Coffee Shop Backend Service

A secure and scalable backend service for managing a coffee shop, featuring role-based access control (RBAC) and attribute-based access control (ABAC).

## Features

- User Authentication & Authorization
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- PostgreSQL Database Integration
- RESTful API Design
- Docker Support

## Prerequisites

- Node.js 20 or higher
- PostgreSQL
- Docker (optional)

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This service is configured for deployment on Railway. For detailed deployment instructions, refer to the [deployment guide](RAILWAY-DEPLOYMENT.md).

## API Documentation

API documentation is available at `/api-docs` when running the server.

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.