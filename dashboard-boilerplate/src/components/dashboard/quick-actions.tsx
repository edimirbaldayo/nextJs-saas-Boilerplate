'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

interface Action {
  name: string
  href: string
  icon: string
  description: string
  adminOnly?: boolean
  badge?: string
}

const actions: Action[] = [
  {
    name: 'Manage Users',
    href: '/dashboard/users',
    icon: '👥',
    description: 'View and manage user accounts',
    adminOnly: true,
    badge: 'Admin'
  },
  {
    name: 'Roles & Permissions',
    href: '/dashboard/roles',
    icon: '🔐',
    description: 'Manage roles and permissions',
    adminOnly: true,
    badge: 'Admin'
  },
  {
    name: 'View Profile',
    href: '/dashboard/profile',
    icon: '👤',
    description: 'Update your personal information'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
    description: 'Manage your account settings'
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: '📄',
    description: 'View and download reports'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: '📊',
    description: 'View detailed analytics'
  }
]

export function QuickActions() {
  const { user } = useAuth()
  const isAdmin = user?.email === 'admin@example.com'

  const filteredActions = actions.filter(action => 
    !action.adminOnly || isAdmin
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <span className="text-sm text-gray-500">{filteredActions.length} actions</span>
      </div>
      
      <div className="space-y-3">
        {filteredActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
              <span className="text-xl">{action.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                  {action.name}
                </div>
                {action.badge && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {action.badge}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                {action.description}
              </div>
            </div>
            <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-2">Admin Tools</div>
          <div className="flex space-x-2">
            <Link
              href="/dashboard/users"
              className="flex-1 text-center py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Users
            </Link>
            <Link
              href="/dashboard/roles"
              className="flex-1 text-center py-2 px-3 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Roles
            </Link>
            <Link
              href="/dashboard/permissions"
              className="flex-1 text-center py-2 px-3 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              Permissions
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 