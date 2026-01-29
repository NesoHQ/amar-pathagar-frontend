# Amar Pathagar Frontend

A classic, old-school styled Next.js frontend for the Amar Pathagar community library platform.

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **HTTP Client** | Axios |
| **Date Handling** | date-fns |

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env.local

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel
│   │   ├── books/          # Book browsing & details
│   │   ├── dashboard/      # User dashboard
│   │   ├── donations/      # Donations page
│   │   ├── leaderboard/    # Top contributors
│   │   ├── login/          # Login page
│   │   ├── my-library/     # User's library
│   │   ├── register/       # Registration page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   │   └── Layout.tsx      # Main layout component
│   ├── lib/                # Utilities
│   │   └── api.ts          # API client
│   └── store/              # State management
│       └── authStore.ts    # Auth state
├── public/                 # Static assets
├── .env.example            # Environment template
├── docker-compose.yml      # Production Docker
├── docker-compose.dev.yml  # Development Docker
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── Makefile                # Commands
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Development Commands

```bash
# Local development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter

# Docker development
make dev-docker      # Start with Docker + hot reload
make logs            # View logs
make restart         # Restart container
make down            # Stop containers

# Utilities
make install         # Install dependencies
make clean           # Clean up everything
make help            # Show all commands
```

## Pages

### Public Pages
- `/` - Home (redirects to dashboard or login)
- `/login` - User login
- `/register` - User registration
- `/books` - Browse all books
- `/books/[id]` - Book details
- `/leaderboard` - Top contributors

### Protected Pages (Require Login)
- `/dashboard` - User dashboard
- `/my-library` - User's bookmarks and history
- `/donations` - Make and view donations

### Admin Pages (Admin Only)
- `/admin` - Admin panel

## Design Philosophy

### Classic Old-School Aesthetic

- **Typography** - Serif fonts, uppercase headings
- **Colors** - Black, grey, off-white palette
- **Borders** - Bold 2-4px borders throughout
- **Texture** - Subtle old paper background
- **Elements** - Stamp-like badges, typewriter feel

### Custom Tailwind Classes

```css
.classic-card              /* Standard card with border */
.classic-button            /* Primary button */
.classic-button-secondary  /* Secondary button */
.classic-input             /* Form input */
.classic-heading           /* Section heading */
.stamp                     /* Rotated badge */
.vintage-badge             /* Inline badge */
```

## API Integration

All API calls go through `src/lib/api.ts`:

```typescript
import api from '@/lib/api';

// GET request
const books = await api.get('/books');

// POST request
const user = await api.post('/auth/register', data);

// Authenticated request (auto-includes token)
const profile = await api.get('/me');
```

Features:
- Automatic token injection
- Request/response interceptors
- Error handling
- Auto-logout on 401

## State Management

Uses Zustand for global state:

```typescript
import { useAuthStore } from '@/store/authStore';

function Component() {
  const { user, token, login, logout } = useAuthStore();
  
  // Use state...
}
```

State includes:
- User profile
- Authentication token
- Login/logout functions
- Persistent storage (localStorage)

## Docker Deployment

### Development (with hot reload)

```bash
# Start
make dev-docker

# View logs
make logs

# Stop
make down
```

### Production

```bash
# Build and start
make up

# Check status
docker ps

# View logs
docker logs amar-pathagar-frontend
```

## Standalone Deployment

The frontend can run completely independently:

```bash
# 1. Install dependencies
npm install

# 2. Configure API URL
echo "NEXT_PUBLIC_API_URL=https://your-api.com" > .env.local

# 3. Build
npm run build

# 4. Start
npm start
```

## Features

### Authentication
- JWT-based authentication
- Persistent login (localStorage)
- Auto-redirect on unauthorized
- Protected routes

### Book Management
- Browse all books
- View book details
- Search and filter
- Bookmark books

### User Features
- Personal dashboard
- Reading history
- Success score tracking
- Leaderboard

### Donations
- Book donations
- Money donations
- Public donation feed

### Admin Panel
- User management
- Book management
- System statistics

## Development Notes

- All pages use `'use client'` directive for client-side rendering
- Authentication state loads from localStorage on mount
- Protected routes redirect to login if not authenticated
- Admin routes check user role before rendering
- API URL is configured via environment variable

## Troubleshooting

### Port already in use
```bash
# Stop existing containers
make down

# Or check what's using port 3000
lsof -i :3000
```

### API connection failed
```bash
# Check .env.local file
cat .env.local

# Verify API is running
curl http://localhost:8080/health
```

### Hot reload not working
```bash
# Restart container
make restart

# Or rebuild
make down && make dev-docker
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License

---

**Built with Next.js 14 and classic design principles** 📚
