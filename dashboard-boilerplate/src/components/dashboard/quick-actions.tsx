import Link from 'next/link'

const actions = [
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
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl mr-3">{action.icon}</span>
            <div>
              <div className="font-medium text-gray-900">{action.name}</div>
              <div className="text-sm text-gray-500">{action.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 