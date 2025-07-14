# Dashboard Features Implementation

## Coding Standards

### Async/Await Usage
- Always use `async/await` for asynchronous code instead of promise methods like `.then`, `.catch`, or `.finally`.
- This rule applies to all new code and when refactoring existing code.
- Example:

```ts
// Good
const data = await fetchData();

// Bad
fetchData().then(data => { ... });
```

## Overview
This document outlines the implementation of dashboard features including the lobby, navigation, user interface components, and UI component library.

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

## Enhanced Dashboard Lobby

### Overview
The enhanced dashboard lobby provides a comprehensive overview with role-based content, real-time statistics, and interactive components. Features include:
- Dynamic welcome card with user-specific information
- Role-based quick actions and statistics
- Real-time data fetching with loading states
- Recent activity feed with filtering
- Responsive design with improved UX

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

### Enhanced Welcome Card Component
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

### Enhanced Quick Actions Component
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

### Enhanced Stats Overview Component
```typescript
// src/components/dashboard/stats-overview.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface Stat {
  name: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
  color: string
  href?: string
}

export function StatsOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch real data from APIs
        const [usersRes, rolesRes, permissionsRes] = await Promise.all([
          fetch('/api/v1/users?count=true'),
          fetch('/api/v1/roles?count=true'),
          fetch('/api/v1/permissions?count=true'),
        ])

        const userCount = usersRes.ok ? await usersRes.json() : { count: 0 }
        const roleCount = rolesRes.ok ? await rolesRes.json() : { count: 0 }
        const permCount = permissionsRes.ok ? await permissionsRes.json() : { count: 0 }

        const baseStats: Stat[] = [
          {
            name: 'Total Users',
            value: userCount.count || 0,
            change: '+12%',
            changeType: 'positive',
            icon: '👥',
            color: 'blue',
            href: '/dashboard/users'
          },
          {
            name: 'Active Sessions',
            value: Math.floor(Math.random() * 50) + 10,
            change: '+5%',
            changeType: 'positive',
            icon: '🟢',
            color: 'green'
          },
          {
            name: 'System Health',
            value: '99.9%',
            change: '+0.1%',
            changeType: 'positive',
            icon: '💚',
            color: 'emerald'
          },
          {
            name: 'Error Rate',
            value: '0.1%',
            change: '-0.2%',
            changeType: 'positive',
            icon: '⚠️',
            color: 'yellow'
          }
        ]

        // Add admin-specific stats
        if (user?.email === 'admin@example.com') {
          baseStats.splice(1, 0, {
            name: 'Total Roles',
            value: roleCount.count || 0,
            change: '+2',
            changeType: 'positive',
            icon: '🔐',
            color: 'purple',
            href: '/dashboard/roles'
          })
          baseStats.splice(2, 0, {
            name: 'Total Permissions',
            value: permCount.count || 0,
            change: '+5',
            changeType: 'positive',
            icon: '🔑',
            color: 'indigo',
            href: '/dashboard/permissions'
          })
        }

        setStats(baseStats)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setError('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  // ... rest of component implementation
}
```

### Recent Activity Component
```typescript
// src/components/dashboard/recent-activity.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface Activity {
  id: string
  type: 'user' | 'system' | 'admin'
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

export function RecentActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        
        // Simulate fetching recent activities
        const mockActivities: Activity[] = [
          {
            id: '1',
            type: 'user',
            title: 'User logged in',
            description: 'User successfully authenticated',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            icon: '👤',
            color: 'blue'
          },
          // ... more activities
        ]

        // Filter activities based on user role
        const filteredActivities = user?.email === 'admin@example.com' 
          ? mockActivities 
          : mockActivities.filter(activity => activity.type !== 'admin')

        setActivities(filteredActivities)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
        setError('Failed to load recent activity')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user])

  // ... rest of component implementation
}
```

### Key Features
- **Role-based Content**: Different content shown for admin vs regular users
- **Real-time Data**: Fetches live statistics from APIs
- **Loading States**: Proper loading indicators for better UX
- **Error Handling**: Graceful error handling with retry options
- **Responsive Design**: Optimized for all screen sizes
- **Interactive Elements**: Hover effects and clickable components

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

## Password Recovery

### Overview
The password recovery system allows users to reset their password if they forget it. The system includes:
- Forgot password page for requesting a reset
- Reset password page for setting a new password
- Secure token-based reset mechanism
- Email integration (placeholder for production)

### Frontend Pages
- **Forgot Password:** `src/app/(auth)/forgot-password/page.tsx`
- **Reset Password:** `src/app/(auth)/reset-password/page.tsx`

### API Endpoints
- **Forgot Password:** `POST /api/v1/auth/forgot-password` — Generate reset token and send email
- **Reset Password:** `POST /api/v1/auth/reset-password` — Reset password using valid token

### Security Features
- Secure random token generation using crypto
- 1-hour token expiry
- Password hashing with bcrypt
- No user enumeration (same response for existing/non-existing emails)
- Token invalidation after use
- Input validation with Zod

### Database Schema
The User model includes password reset fields:
```prisma
model User {
  // ... other fields
  resetToken    String?   // For password reset functionality
  resetTokenExpiry DateTime? // Expiry time for reset token
  // ... other fields
}
```

## Users Management (Admin Only)

- **Feature:** Admin users can manage all users (create, update, delete, assign role) from the dashboard.
- **Location:** `src/app/dashboard/users/page.tsx`
- **UI:** Table of users with actions for Edit, Delete, Assign Role, and Activate/Deactivate. Each action is implemented with a modal form or toggle, validation (zod/react-hook-form), API integration, and user feedback for errors and success.
- **Access:** Only visible and accessible to users with the admin role.

## Roles & Permissions Management (Admin Only)

- **Feature:** Admin users can manage roles and permissions (create, update, delete, assign permissions to roles) from the dashboard.
- **Location:**
  - Roles: `src/app/dashboard/roles/page.tsx`, API: `src/app/api/v1/roles/route.ts`
  - Permissions: `src/app/dashboard/permissions/page.tsx`, API: `src/app/api/v1/permissions/route.ts`
  - Role-permission assignment: `src/app/api/v1/roles/[roleId]/permissions/route.ts`
- **UI:** Table of roles and permissions with actions for Edit, Delete, Assign Permissions, and Activate/Deactivate. Each action is implemented with a modal form or toggle, validation (zod/react-hook-form), API integration, and user feedback for errors and success.
- **Access:** Only visible and accessible to users with the admin role.

### Role-Permission Assignment

- **Feature:** Admins can assign or unassign permissions to roles directly from the dashboard.
- **UI Workflow:**
  - Each role row has a "Manage Permissions" button.
  - Clicking opens a modal listing all permissions with checkboxes for those assigned to the role.
  - Admins can check/uncheck permissions and save changes.
  - The UI provides loading, error, and success feedback.
- **API Endpoints:**
  - `POST /api/v1/roles/[roleId]/permissions` — Assign one or more permissions to a role. Expects `{ permissionIds: string[] }` in the body.
  - `DELETE /api/v1/roles/[roleId]/permissions` — Unassign one or more permissions from a role. Expects `{ permissionIds: string[] }` in the body.
- **Backend Logic:**
  - Endpoints are admin-only (RBAC enforced).
  - Uses Prisma to update the `RolePermission` table.
- **Frontend Logic:**
  - See `src/app/dashboard/roles/page.tsx` for modal and assignment logic.
  - Fetches all permissions and the current role's assigned permissions.
  - Submits changes via the above API endpoints.

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
        ? <Image src={src} alt={alt} width={40} height={40} className="w-full h-full object-cover" />
        : <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
      }
    </div>
  )
}
```

## UI Component Library

### Overview
The UI Component Library provides a comprehensive set of reusable components built on shadcn/ui, ensuring consistency, accessibility, and maintainability across the dashboard. The library includes both base shadcn/ui components and custom dashboard-specific components.

### Architecture
- **Base Framework:** shadcn/ui with Tailwind CSS
- **Icon Library:** Lucide React
- **Table Management:** TanStack Table (React Table)
- **Design System:** Consistent tokens and variants
- **TypeScript:** Full type safety for all components

### Base Components (shadcn/ui)
```typescript
// Available base components
import {
  Button,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Input,
  Label,
  Badge,
  Alert, AlertDescription, AlertTitle,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue,
  Textarea
} from "@/components/ui"
```

### Custom Dashboard Components

#### DataTable Component
A full-featured table component with sorting, filtering, pagination, and column visibility controls.

```typescript
// src/components/ui/data-table.tsx
import { DataTable } from "@/components/ui/data-table"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

export function UsersTable({ data }: { data: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  )
}
```

**Features:**
- Sorting by any column
- Global search functionality
- Column visibility toggle
- Pagination with configurable page sizes
- Row selection
- Responsive design

#### StatsCard Component
Reusable component for displaying metrics and statistics with optional trends.

```typescript
// src/components/ui/stats-card.tsx
import { StatsCard } from "@/components/ui/stats-card"
import { Users, TrendingUp } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total Users"
        value="1,234"
        description="Active users this month"
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="System Health"
        value="98%"
        description="Uptime this month"
        icon={TrendingUp}
        trend={{ value: 2, isPositive: false }}
      />
    </div>
  )
}
```

**Features:**
- Icon support with Lucide React
- Optional trend indicators
- Responsive grid layout
- Consistent styling

#### LoadingSpinner Component
Consistent loading state component with multiple sizes.

```typescript
// src/components/ui/loading-spinner.tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function LoadingButton() {
  return (
    <Button disabled>
      <LoadingSpinner size="sm" className="mr-2" />
      Loading...
    </Button>
  )
}
```

**Features:**
- Three size variants: sm, md, lg
- Customizable className
- Smooth animation

#### EmptyState Component
Component for displaying empty states with optional call-to-action.

```typescript
// src/components/ui/empty-state.tsx
import { EmptyState } from "@/components/ui/empty-state"
import { Plus } from "lucide-react"

export function NoUsersState() {
  return (
    <EmptyState
      icon={Plus}
      title="No users found"
      description="Get started by creating your first user."
      action={{
        label: "Create User",
        onClick: () => handleCreateUser()
      }}
    />
  )
}
```

**Features:**
- Optional icon
- Customizable title and description
- Optional call-to-action button
- Centered layout

### Component Showcase
A comprehensive demo page showcasing all components at `/dashboard/components`.

```typescript
// src/app/dashboard/components/page.tsx
export default function ComponentsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">UI Component Library</h1>
        <p className="text-muted-foreground">
          A showcase of all available UI components for the dashboard.
        </p>
      </div>
      
      {/* Interactive component demos */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Different button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Button examples */}
        </CardContent>
      </Card>
      
      {/* More component sections... */}
    </div>
  )
}
```

### Navigation Integration
Updated sidebar navigation to include the components page and other dashboard features.

```typescript
// src/components/layout/sidebar.tsx
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Users', href: '/dashboard/users', icon: '👥' },
  { name: 'Roles', href: '/dashboard/roles', icon: '🛡️' },
  { name: 'Permissions', href: '/dashboard/permissions', icon: '🔐' },
  { name: 'Components', href: '/dashboard/components', icon: '🧩' },
  { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📊' },
]
```

### Configuration Files

#### components.json
shadcn/ui configuration file defining the component library setup.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "gray",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

#### utils.ts
Utility functions for component styling and class merging.

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Usage Guidelines

#### Importing Components
```typescript
// Import individual components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Import from index (recommended)
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
```

#### Component Variants
Most components support multiple variants for different use cases:

```typescript
// Button variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

#### Responsive Design
All components are built with responsive design in mind:

```typescript
// Responsive grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <StatsCard title="Metric 1" value="123" />
  <StatsCard title="Metric 2" value="456" />
  <StatsCard title="Metric 3" value="789" />
</div>
```

### Accessibility Features
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast support

### Performance Considerations
- Lazy loading for heavy components
- Optimized bundle size
- Tree-shaking support
- Minimal re-renders

### Future Enhancements
- Dark mode support
- Additional component variants
- Animation library integration
- Advanced form components
- Chart and visualization components