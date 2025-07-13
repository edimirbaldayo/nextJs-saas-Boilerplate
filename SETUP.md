# Dashboard Boilerplate Setup Guide

This guide will help you set up the Dashboard Boilerplate project on your local machine.

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database (local or cloud)
- Git

## Quick Start

### 1. Clone and Install

```bash
# Navigate to the project directory
cd dashboard-boilerplate

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Run the setup script (creates .env.local from template)
npm run setup:init

# Or manually copy the environment template
cp env.template .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` and update the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dashboard_boilerplate"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# Optional: Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Optional: Seed database with initial data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with initial data
- `npm run setup` - Quick database setup
- `npm run setup:init` - Full project setup

## Project Structure

```
dashboard-boilerplate/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility libraries
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper functions
│   ├── hooks/               # Custom React hooks
│   └── styles/              # Global styles
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seed script
├── public/                  # Static assets
├── scripts/                 # Build and setup scripts
└── Project/                 # Project documentation
```

## Database Schema

The project includes a comprehensive database schema with:

- **Users** - Authentication and profile management
- **Accounts** - OAuth provider accounts
- **Sessions** - User sessions
- **Roles & Permissions** - Role-based access control
- **User Profiles** - Extended user information
- **Audit Logs** - User action tracking

## Authentication

The project supports multiple authentication methods:

- **Credentials** - Email/password login
- **Google OAuth** - Google account login
- **GitHub OAuth** - GitHub account login

## Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature-name
   # Make changes
   npm run lint:fix
   npm run type-check
   git commit -m "feat: add your feature"
   ```

2. **Database Changes**
   ```bash
   # Edit prisma/schema.prisma
   npm run db:push
   # Or for migrations
   npm run db:migrate
   ```

3. **Testing**
   ```bash
   npm run type-check
   npm run lint
   ```

## Troubleshooting

### Common Issues

1. **Prisma Client Not Generated**
   ```bash
   npm run db:generate
   ```

2. **Database Connection Issues**
   - Check your `DATABASE_URL` in `.env.local`
   - Ensure PostgreSQL is running
   - Verify database exists

3. **TypeScript Errors**
   ```bash
   npm run type-check
   npm run db:generate
   ```

4. **Environment Variables Not Loading**
   - Ensure `.env.local` exists
   - Restart the development server
   - Check variable names match exactly

### Getting Help

- Check the [Project Documentation](./Project/) for detailed guides
- Review [Technical Specifications](./Project/02-TECHNICAL-SPECIFICATIONS/)
- See [Development Guide](./Project/03-DEVELOPMENT-GUIDE/)

## Next Steps

After setup, you can:

1. **Customize the UI** - Modify components in `src/components/`
2. **Add Features** - Create new pages in `src/app/`
3. **Extend Database** - Add models to `prisma/schema.prisma`
4. **Configure Authentication** - Set up OAuth providers
5. **Deploy** - Deploy to Vercel, Railway, or your preferred platform

Happy coding! 🚀 