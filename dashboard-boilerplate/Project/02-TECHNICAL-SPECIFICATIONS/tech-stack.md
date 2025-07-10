gic# Technology Stack

## Frontend Framework
- **Next.js 15.3.5** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type-safe JavaScript

## Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Geist Font** - Typography (Next.js default)

## Backend & Database
- **Next.js API Routes** - Server-side logic
- **Prisma ORM** - Database management and migrations
- **PostgreSQL** - Primary database (Docker container)
- **NextAuth.js** - Authentication system

## Development Tools
- **ESLint 9** - Code linting
- **Next.js ESLint Config** - Framework-specific rules
- **Turbopack** - Fast bundler (development)
- **Docker** - Database containerization

## Current Dependencies (as of project creation)
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.3.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.3.5",
    "@eslint/eslintrc": "^3"
  }
}
```

## Required Dependencies
- **Prisma** - Database ORM
- **@prisma/client** - Prisma client
- **NextAuth.js** - Authentication
- **@next-auth/prisma-adapter** - Prisma adapter for NextAuth
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **clsx** - Conditional classes
- **tailwind-merge** - Tailwind class merging

## Database Architecture
- **PostgreSQL 15** - Primary database
- **Docker Container** - Isolated database environment
- **Data Persistence** - Local volume mounting
- **Prisma Migrations** - Schema versioning

## Build & Deployment
- **Vercel** - Recommended deployment platform
- **Node.js** - Runtime environment
- **npm/yarn/pnpm** - Package manager
- **Docker Compose** - Local development environment

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Progressive enhancement approach

## Version Management
- Use exact versions for critical dependencies
- Use caret ranges for minor updates
- Regular dependency updates for security
- Lock file for reproducible builds

## Security Considerations
- Regular security audits with `npm audit`
- Keep dependencies updated
- Use trusted packages only
- Monitor for vulnerabilities
- Database connection encryption
- Environment variable protection 