# Architecture Overview

## System Architecture

### Frontend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   Next.js App   │    │   API Routes    │
│                 │◄──►│   (App Router)  │◄──►│   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   Postgres      │
                       └─────────────────┘
```

### Component Architecture
```
App Layout
├── Authentication Provider
├── Navigation
│   ├── Sidebar
│   └── Top Navbar
├── Main Content
│   ├── Dashboard Pages
│   ├── Auth Pages
│   └── Error Boundaries
└── Footer
```

## Technology Stack

### Frontend Layer
- **Next.js 15.3.5**: React framework with App Router
- **React 19.0.0**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling

### Backend Layer
- **Next.js API Routes**: Server-side logic
- **NextAuth.js**: Authentication system
- **Prisma**: Database ORM
- **Email Service**: Password recovery

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Git**: Version control
- **Vercel**: Deployment platform

## Data Flow

### Authentication Flow
1. User enters credentials
2. NextAuth.js validates credentials
3. Session created and stored
4. User redirected to dashboard
5. Protected routes check session

### Dashboard Flow
1. User accesses dashboard
2. Session validation
3. User data fetched
4. Dashboard components rendered
5. Real-time updates (if needed)

## Security Architecture

### Authentication Security
- JWT tokens for session management
- Secure password hashing
- CSRF protection
- Rate limiting on auth endpoints

### Data Security
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- HTTPS enforcement

## Performance Architecture

### Optimization Strategies
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Bundle optimization

### Caching Strategy
- Browser caching
- CDN caching
- API response caching
- Static asset caching

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Database connection pooling
- Load balancer ready
- Microservices preparation

### Vertical Scaling
- Efficient database queries
- Optimized bundle sizes
- Memory usage optimization
- CPU usage optimization

## Deployment Architecture

### Development Environment
- Local development server
- Hot reloading
- Environment variables
- Debug tools

### Production Environment
- Vercel deployment
- Environment variables
- Monitoring and logging
- Error tracking

## Future Considerations

### Potential Enhancements
- Real-time features (WebSockets)
- Advanced analytics
- Multi-tenant support
- API rate limiting
- Advanced caching strategies

```plaintext:dashboard-boilerplate/Project/02-TECHNICAL-SPECIFICATIONS/dependencies.md
# Dependencies Management

## Current Dependencies

### Core Dependencies
- `next: 15.3.5` - React framework
- `react: ^19.0.0` - UI library
- `react-dom: ^19.0.0` - React DOM rendering

### Development Dependencies
- `typescript: ^5` - TypeScript compiler
- `@types/node: ^20` - Node.js type definitions
- `@types/react: ^19` - React type definitions
- `@types/react-dom: ^19` - React DOM type definitions
- `@tailwindcss/postcss: ^4` - Tailwind PostCSS plugin
- `tailwindcss: ^4` - CSS framework
- `eslint: ^9` - Code linting
- `eslint-config-next: 15.3.5` - Next.js ESLint config
- `@eslint/eslintrc: ^3` - ESLint configuration

## Planned Dependencies

### Authentication
```bash
npm install next-auth
npm install @next-auth/prisma-adapter
```

### Forms & Validation
```bash
npm install react-hook-form
npm install @hookform/resolvers
npm install zod
```

### UI Components
```bash
npm install @radix-ui/react-slot
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
```

### Icons
```bash
npm install lucide-react
```

### Database (Optional)
```bash
npm install prisma
npm install @prisma/client
```

### Email (Optional)
```bash
npm install resend
# or
npm install nodemailer
```

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

## Dependency Categories

### Production Dependencies
- Core framework and runtime
- UI libraries and components
- Authentication and security
- Data handling and validation

### Development Dependencies
- Build tools and compilers
- Type definitions
- Linting and formatting
- Testing frameworks

### Optional Dependencies
- Database integration
- Email services
- Analytics and monitoring
- Advanced features

## Update Strategy
1. **Security Updates**: Immediate
2. **Patch Updates**: Weekly review
3. **Minor Updates**: Monthly review
4. **Major Updates**: Quarterly review with testing

## Compatibility Matrix
- Next.js 15.3.5 → React 19.0.0
- TypeScript 5 → Node.js 18+
- Tailwind CSS 4 → PostCSS 8+
- ESLint 9 → Node.js 18+
```

```plaintext:dashboard-boilerplate/Project/02-TECHNICAL-SPECIFICATIONS/folder-structure.md
# Folder Structure

## Current Structure
```
dashboard-boilerplate/
├── .next/                    # Next.js build output
├── node_modules/             # Dependencies
├── public/                   # Static assets
├── src/                      # Source code
│   └── app/                  # App Router pages
│       ├── globals.css       # Global styles
│       ├── layout.tsx        # Root layout
│       └── page.tsx          # Home page
├── Project/                  # Project documentation
├── .gitignore               # Git ignore rules
├── eslint.config.mjs        # ESLint configuration
├── next-env.d.ts            # Next.js TypeScript definitions
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependencies
├── postcss.config.mjs       # PostCSS configuration
├── README.md                # Project readme
└── tsconfig.json            # TypeScript configuration
```

## Planned Structure
```
dashboard-boilerplate/
├── src/
│   ├── app/                  # App Router pages
│   │   ├── (auth)/           # Authentication routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── recovery/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── dashboard/        # Dashboard routes
│   │   │   ├── lobby/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/              # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── recovery/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # Reusable components
│   │   ├── ui/               # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts
│   │   ├── layout/           # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── auth/             # Authentication components
│   │   │   ├── login-form.tsx
│   │   │   └── recovery-form.tsx
│   │   └── dashboard/        # Dashboard components
│   │       ├── user-profile.tsx
│   │       └── quick-actions.tsx
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── db.ts             # Database utilities
│   │   ├── email.ts          # Email utilities
│   │   └── utils.ts          # General utilities
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth.ts
│   │   └── use-user.ts
│   └── styles/               # Additional styles
│       └── components.css
├── public/                   # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── prisma/                   # Database schema (if using)
│   └── schema.prisma
├── Project/                  # Project documentation
│   ├── 01-PROJECT-OVERVIEW/
│   ├── 02-TECHNICAL-SPECIFICATIONS/
│   ├── 03-DEVELOPMENT-GUIDE/
│   ├── 04-FEATURES-IMPLEMENTATION/
│   ├── 05-TASK-MANAGEMENT/
│   ├── 06-DECISIONS-LOG/
│   ├── 07-TOOLS-AND-RESOURCES/
│   ├── 08-LIMITATIONS-AND-CONSTRAINTS/
│   ├── 09-PROMPTS-AND-COMMUNICATION/
│   └── 10-PROJECT-MEMORY/
├── .env.local               # Environment variables
├── .env.example             # Environment variables template
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json
```

## File Naming Conventions

### Components
- Use PascalCase: `UserProfile.tsx`
- Group related components in folders
- Export from index files

### Pages
- Use kebab-case for routes: `user-settings/page.tsx`
- Use `page.tsx` for main page files
- Use `layout.tsx` for layout files

### Utilities
- Use camelCase: `authUtils.ts`
- Group by functionality
- Use descriptive names

### Types
- Use PascalCase: `UserProfile.ts`
- Suffix with `.ts` for type files
- Group related types together

## Import Organization
1. React and Next.js imports
2. Third-party library imports
3. Internal component imports
4. Utility and type imports
5. Style imports

## Component Structure
```typescript
// imports
import React from 'react'
import { ComponentProps } from './types'

// types
interface Props extends ComponentProps {
  // component props
}

// component
export function ComponentName({ prop1, prop2 }: Props) {
  // hooks
  // handlers
  // render
  return <div>Component</div>
}
```

```plaintext:dashboard-boilerplate/Project/02-TECHNICAL-SPECIFICATIONS/api-specifications.md
# API Specifications

## Authentication Endpoints

### POST /api/v1/auth/signin
**Purpose**: User login
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /api/v1/auth/signout
**Purpose**: User logout
**Response**:
```json
{
  "success": true
}
```

### POST /api/v1/auth/recovery
**Purpose**: Initiate password recovery
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Recovery email sent"
}
```

### POST /api/v1/auth/reset-password
**Purpose**: Reset password with token
**Request Body**:
```json
{
  "token": "reset_token",
  "password": "new_password"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## User Endpoints

### GET /api/v1/user/profile
**Purpose**: Get current user profile
**Headers**: Authorization: Bearer token
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "avatar_url",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/v1/user/profile
**Purpose**: Update user profile
**Headers**: Authorization: Bearer token
**Request Body**:
```json
{
  "name": "New Name",
  "avatar": "new_avatar_url"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "New Name",
    "avatar": "new_avatar_url"
  }
}
```

### PUT /api/v1/user/password
**Purpose**: Change password
**Headers**: Authorization: Bearer token
**Request Body**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## Dashboard Endpoints

### GET /api/v1/dashboard/stats
**Purpose**: Get dashboard statistics
**Headers**: Authorization: Bearer token
**Response**:
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1000,
    "activeUsers": 750,
    "recentActivity": [
      {
        "id": "activity_id",
        "type": "login",
        "timestamp": "2024-01-01T00:00:00Z",
        "description": "User logged in"
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Authentication

### JWT Token Format
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### Session Management
- JWT tokens stored in HTTP-only cookies
- Token expiration: 24 hours
- Refresh token mechanism for extended sessions
- Secure cookie settings in production

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- Recovery endpoints: 3 requests per hour

## CORS Configuration
```javascript
{
  origin: process.env.NEXTAUTH_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## Security Headers
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
```

```plaintext:dashboard-boilerplate/Project/04-FEATURES-IMPLEMENTATION/authentication-flow.md
# Authentication Flow Implementation

## Overview
This document outlines the implementation of the authentication system using NextAuth.js in the dashboard boilerplate.

## Architecture

### NextAuth.js Configuration
```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials
        // Return user object or null
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add custom claims to JWT
      return token
    },
    async session({ session, token }) {
      // Add user data to session
      return session
    }
  }
}
```

## Implementation Steps

### 1. Install Dependencies
```bash
npm install next-auth
npm install @next-auth/prisma-adapter # if using database
```

### 2. Create API Route
```typescript
// src/app/api/v1/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 3. Create Authentication Provider
```typescript
// src/components/providers/auth-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 4. Add Provider to Root Layout
```typescript
// src/app/layout.tsx
import { AuthProvider } from '@/components/providers/auth-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

## Authentication Pages

### Login Page
```typescript
// src/app/(auth)/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### Password Recovery
```typescript
// src/app/(auth)/recovery/page.tsx
'use client'

import { useState } from 'react'

export default function RecoveryPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch('/api/v1/auth/recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (response.ok) {
      // Show success message
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Route Protection

### Middleware
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Custom middleware logic
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/dashboard/:path*']
}
```

### Protected Route Component
```typescript
// src/components/auth/protected-route.tsx
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect('/auth/login')
  }

  return <>{children}</>
}
```

## Session Management

### Use Session Hook
```typescript
// src/hooks/use-auth.ts
import { useSession, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const logout = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    logout
  }
}
```

## Error Handling

### Authentication Errors
```typescript
// src/lib/auth-errors.ts
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Account is temporarily locked',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  TOO_MANY_ATTEMPTS: 'Too many login attempts'
} as const

export function getAuthErrorMessage(error: string): string {
  return AUTH_ERRORS[error as keyof typeof AUTH_ERRORS] || 'Authentication failed'
}
```

## Testing

### Unit Tests
```typescript
// __tests__/auth/login.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { signIn } from 'next-auth/react'
import LoginPage from '@/app/(auth)/login/page'

jest.mock('next-auth/react')

describe('LoginPage', () => {
  it('handles successful login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true })
    
    render(<LoginPage />)
    
    fireEvent.click(screen.getByText('Sign In'))
    
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password',
      redirect: false
    })
  })
})
```

## Security Considerations

### Password Security
- Use bcrypt for password hashing
- Implement password strength requirements
- Rate limiting on login attempts
- Account lockout after failed attempts

### Session Security
- Secure cookie settings
- JWT token expiration
- CSRF protection
- HTTPS enforcement

### Input Validation
- Email format validation
- Password strength validation
- SQL injection prevention
- XSS protection
```

```plaintext:dashboard-boilerplate/Project/04-FEATURES-IMPLEMENTATION/dashboard-features.md
# Dashboard Features Implementation

## Overview
This document outlines the implementation of dashboard features including the lobby, navigation, and user interface components.

## Dashboard Layout

### Main Dashboard Layout
```typescript
// src/app/dashboard/layout.tsx
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNavbar } from '@/components/layout/top-navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
```

### Sidebar Navigation
```typescript
// src/components/layout/sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UserIcon, 
  CogIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`bg-white shadow-lg ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-xl font-bold">Dashboard</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <nav className="mt-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {!collapsed && item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
```

### Top Navigation Bar
```typescript
// src/components/layout/top-navbar.tsx
'use client'

import { useAuth } from '@/hooks/use-auth'
import { UserMenu } from '@/components/ui/user-menu'

export function TopNavbar() {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
```

## Dashboard Lobby

### Lobby Page
```typescript
// src/app/dashboard/lobby/page.tsx
import { Suspense } from 'react'
import { WelcomeCard } from '@/components/dashboard/welcome-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { StatsOverview } from '@/components/dashboard/stats-overview'

export default function LobbyPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
      
      <StatsOverview />
    </div>
  )
}
```

### Welcome Card Component
```typescript
// src/components/dashboard/welcome-card.tsx
'use client'

import { useAuth } from '@/hooks/use-auth'

export function WelcomeCard() {
  const { user } = useAuth()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last login</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Quick Actions Component
```typescript
// src/components/dashboard/quick-actions.tsx
import Link from 'next/link'
import { 
  UserIcon, 
  CogIcon, 
  DocumentTextIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

const actions = [
  {
    name: 'View Profile',
    href: '/dashboard/profile',
    icon: UserIcon,
    description: 'Update your personal information'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: CogIcon,
    description: 'Manage your account settings'
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: DocumentTextIcon,
    description: 'View and download reports'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    description: 'View detailed analytics'
  }
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <action.icon className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">{action.name}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

## User Profile

### Profile Page
```typescript
// src/app/dashboard/profile/page.tsx
import { ProfileForm } from '@/components/dashboard/profile-form'
import { PasswordChangeForm } from '@/components/dashboard/password-change-form'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and settings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm />
        <PasswordChangeForm />
      </div>
    </div>
  )
}
```

### Profile Form Component
```typescript
// src/components/dashboard/profile-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid URL').optional()
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register('name')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}
```

## Responsive Design

### Mobile Navigation
```typescript
// src/components/layout/mobile-nav.tsx
'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { navigation } from './sidebar'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Dialog open={open} onClose={setOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50">
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="mt-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </Dialog>
    </>
  )
}
```

## Performance Optimization

### Lazy Loading
```typescript
// src/app/dashboard/lobby/page.tsx
import dynamic from 'next/dynamic'

const RecentActivity = dynamic(() => import('@/components/dashboard/recent-activity'), {
  loading: () => <div>Loading...</div>
})

const StatsOverview = dynamic(() => import('@/components/dashboard/stats-overview'), {
  loading: () => <div>Loading...</div>
})
```

### Image Optimization
```typescript
// src/components/ui/avatar.tsx
import Image from 'next/image'

interface AvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200`}>
      {src