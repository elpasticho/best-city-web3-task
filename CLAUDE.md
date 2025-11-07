# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BestCity is a modern real estate investment platform that combines traditional property investing with cryptocurrency payments. Built with React 18, Vite, Tailwind CSS, and Express.js, with MongoDB for data persistence.

## Common Development Commands

### Development
```bash
# Start both frontend (port 3000) and backend (port 4000)
npm start
# or
npm run dev

# Frontend only: Uses Vite dev server at localhost:3000
# Backend only: Run `node server/server.js` at localhost:4000
```

### Testing
```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI dashboard
npm run test:ui
```

### Code Quality
```bash
# Lint all JavaScript/JSX files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run all quality checks (lint + tests + deps + circular deps + security)
npm run quality:check

# Comprehensive quality check with coverage
npm run quality:full
```

### Building
```bash
# Build frontend for production (outputs to /build directory)
npm run build

# Preview production build locally
npm preview
```

### Docker & DevOps
```bash
# Start all services (app + MongoDB + Prometheus)
docker-compose up -d

# View logs for all services
docker-compose logs -f

# Stop all services
docker-compose down

# Check health status
curl http://localhost:4000/health
```

### Useful Utilities
```bash
# Check for unused dependencies
npm run deps:unused

# Find circular dependencies
npm run circular:check

# Security audit
npm run audit:security
```

## Architecture

### Application Structure

**Frontend (React + Vite)**
- **Entry Point**: `src/main.jsx` → `src/App.jsx`
- **Routing**: React Router v6 with routes defined in `App.jsx`
- **State Management**:
  - React Context API for theme (`src/context/ThemeContext.jsx`)
  - Jotai for 3D viewer state
  - Local component state with hooks
- **Styling**: Tailwind CSS with utility classes defined in `src/index.css`

**Backend (Express.js)**
- **Entry Point**: `server/server.js` → `server/app.js`
- **Database**: MongoDB with Mongoose ODM (configuration in `server/config/database.js`)
- **Logging**: Winston logger with daily rotation (`server/config/logger.js`)
- **Metrics**: Prometheus metrics exposed at `/metrics` endpoint (`server/config/metrics.js`)
- **Routes**: RESTful APIs in `server/routes/` with controllers in `server/controllers/`

### Key Architectural Patterns

**MVC Pattern (Backend)**
```
Routes → Controllers → Models → Database
  ↓
Response
```

**Component Hierarchy (Frontend)**
```
App (ThemeProvider + Router)
├── Navbar (with ThemeToggle)
├── Routes (Page components)
└── Footer
```

**Notes API Architecture** (Fully Implemented Example)
- Routes: `server/routes/notesRoute.js`
- Controller: `server/controllers/notesController.js`
- Model: `server/models/Note.js`
- Tests: `server/controllers/notesController.test.js` and `server/routes/notesRoute.test.js`
- Frontend: `src/pages/Notes.jsx`

This is the reference implementation for adding new features.

### Theme System

The application uses a centralized dark/light theme system:

1. **ThemeContext** (`src/context/ThemeContext.jsx`): Manages global theme state, persists to localStorage
2. **Utility Classes** (`src/index.css`): Semantic classes like `.text-heading`, `.section-white`, `.card` that automatically adapt to theme
3. **Tailwind Dark Mode**: Uses class-based dark mode (`.dark` class on root element)

**When creating new components**: Use the existing utility classes instead of inline Tailwind dark mode variants to maintain consistency.

### Database Strategy

- **Development**: MongoDB connection with optional fallback (auto-handled by `server/config/database.js`)
- **Models**: Mongoose schemas in `server/models/` directory
- **Connection Logging**: All database operations are logged via Winston
- **Metrics**: Database connection status exposed to Prometheus

### 3D Visualization Stack

**Three.js Integration** (`src/pages/Property3D.jsx` and `src/components/property/`)
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components (OrbitControls, Environment, etc.)
- **Leva**: 3D scene controls and debug UI
- **GLB Models**: Loaded from `/public/models/` directory

## Testing Guidelines

- **Framework**: Vitest with jsdom environment
- **Setup**: `src/test/setup.js` configures test environment
- **Coverage Threshold**: 60% for lines, functions, branches, statements (see `vitest.config.js`)
- **Pattern**: Co-locate tests with source files using `.test.js` or `.spec.js` suffix
- **Example**: See Notes API tests for reference implementation (38 tests, 85%+ coverage)

**When adding new API endpoints:**
1. Write controller tests (test business logic)
2. Write route tests (test HTTP integration)
3. Aim for >80% coverage for new code

## Environment Variables

**Backend** (`.env` file, not committed):
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bestcity
JWT_SECRET=your_jwt_secret_here
LOG_LEVEL=info
METRICS_ENABLED=true
```

**Frontend** (Vite prefix: `VITE_*`):
```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## API Conventions

**All API routes** follow `/api/v1/` prefix and are defined in `server/app.js`:
- `/api/v1/notes` - Notes CRUD API
- `/api/v1/users` - User management
- `/api/v1/products` - Product management
- `/api/v1/orders` - Order management
- `/api/v1/payment` - Payment processing

**Standard Response Format**:
```javascript
// Success
{
  success: true,
  message: "Operation successful",
  data: { ... }
}

// Error
{
  success: false,
  message: "Error description",
  error: "Detailed error message"
}
```

**When creating new endpoints**:
1. Create Mongoose model in `server/models/`
2. Create controller in `server/controllers/`
3. Create routes in `server/routes/`
4. Add route to `server/app.js`
5. Add metrics tracking (see `server/config/metrics.js`)
6. Write comprehensive tests

## Monitoring & Observability

**Health Check**: `GET /health` returns application status and uptime

**Metrics**: `GET /metrics` exposes Prometheus metrics including:
- HTTP request counts and duration
- Database connection status
- Custom business metrics (notes created/updated/deleted)
- Node.js process metrics

**Logging**: Winston logger outputs to console and files (`logs/` directory):
- `app-*.log` - Application logs
- `error-*.log` - Error logs only
- `combined-*.log` - All logs
- Automatic daily rotation with 14-day retention

**When adding new features**: Add custom Prometheus metrics for business-critical operations (see Notes API controller for examples).

## Deployment

**Docker** (Recommended):
- Multi-stage Dockerfile for optimized production images
- `docker-compose.yml` orchestrates app + MongoDB + Prometheus
- Health checks configured for container orchestration

**Terraform** (AWS):
- Infrastructure as Code in `terraform/` directory
- Provisions EC2, VPC, Security Groups, Elastic IP
- Auto-deployment script in `terraform/user-data.sh`

See `DEVOPS_README.md` for comprehensive deployment guide.

## File Conventions

**Component Files**: Use `.jsx` extension for React components
**JavaScript Files**: Use `.js` for non-React code
**Naming**:
- Components: PascalCase (e.g., `PropertyCard.jsx`)
- Utilities: camelCase (e.g., `sendEmail.js`)
- Models: PascalCase (e.g., `Note.js`)

## Common Gotchas

1. **Port Conflicts**: Frontend (3000) and backend (4000) must both be free. Use `lsof -i :3000` and `lsof -i :4000` to check.

2. **MongoDB Connection**: If MongoDB is not running, the server will start but log warnings. The Notes API requires MongoDB to be running.

3. **Environment Variables**: Backend uses standard `.env` file. Frontend requires `VITE_` prefix for environment variables to be accessible in browser.

4. **Vite Alias**: `@/` is aliased to `src/` directory (see `vite.config.js`). Use `@/components/...` for cleaner imports.

5. **Test Coverage**: The coverage excludes `server/data/**`, `public/**`, and config files. See `vitest.config.js` for full exclusion list.

6. **Dark Mode**: The theme system uses class-based dark mode. The `dark` class is toggled on the document root, NOT per-component.

## Documentation

For more detailed information, see:
- `docs/API.md` - Complete API documentation
- `docs/ARCHITECTURE.md` - Detailed architecture guide
- `docs/DEPLOYMENT.md` - Deployment instructions
- `docs/NOTES_API_TESTS.md` - Testing documentation and examples
- `docs/QUALITY_TOOLS_GUIDE.md` - Quality assurance tools guide
- `DEVOPS_README.md` - Docker, Terraform, and DevOps setup

---

**Last Updated**: 2025-11-07
