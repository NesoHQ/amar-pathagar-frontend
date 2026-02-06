# Quick Start Guide - Frontend

## Development (Local)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

## Production (Docker)

```bash
# Build Docker image
make build

# Start production container
make prod

# Stop production
make prod-down
```

## Environment Variables

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production, set environment variables in `docker-compose.yml` or your deployment platform.

## Development Workflow

1. Run backend: `cd ../amar-pathagar-backend && make dev`
2. Run frontend: `npm run dev`
3. Open browser: http://localhost:3000

## Building for Production

```bash
# Build Next.js app
npm run build

# Start production server
npm start
```

Or use Docker:

```bash
make build
make prod
```

## Troubleshooting

**API connection failed:**
- Ensure backend is running on port 8080
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Build errors:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
