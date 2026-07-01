# BudgetWise Server

Backend API for BudgetWise - Professional Personal Finance Management Application

## Tech Stack

- **Node.js** + **Express** - REST API
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Zod** - Validation
- **Winston** - Logging

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL 16
- npm >= 9

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your database credentials
```

### Database Setup

```bash
# Generate Prisma Client
npm run generate

# Run migrations
npm run migrate

# Seed database with demo data
npm run seed
```

### Development

```bash
# Start development server
npm run dev

# The server will run on http://localhost:5000
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/change-password` - Change password
- `GET /api/v1/auth/me` - Get current user

### Demo Credentials

After seeding:
- Email: `demo@budgetwise.com`
- Password: `Password123`

## Database Schema

See `prisma/schema.prisma` for complete schema.

Key models:
- Users & Authentication
- Accounts (Bank, Cash, Mobile Money)
- Transactions
- Categories
- Budgets
- Saving Goals
- Notifications

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database
- `npm run studio` - Open Prisma Studio
- `npm run lint` - Lint code
- `npm run type-check` - Check TypeScript types

## Architecture

```
src/
├── config/          # Configuration
├── middlewares/     # Express middlewares
├── modules/         # Feature modules
│   └── auth/       # Authentication module
├── utils/          # Utilities
├── app.ts          # Express app
└── server.ts       # Server entry point
```

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Request validation with Zod
- Rate limiting
- CORS protection
- Helmet security headers
- SQL injection protection (Prisma)
- XSS protection

## License

MIT
