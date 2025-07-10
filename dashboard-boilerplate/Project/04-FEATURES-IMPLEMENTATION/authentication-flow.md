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
// src/app/api/auth/[...nextauth]/route.ts
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
    
    const response = await fetch('/api/auth/recovery', {
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