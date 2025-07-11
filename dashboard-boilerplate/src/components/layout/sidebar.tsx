'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`bg-sidebar shadow-lg ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-xl font-bold text-sidebar-foreground">aiTynkers</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted"
        >
          <svg className="w-5 h-5 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-md ${
                isActive
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {!collapsed && item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 