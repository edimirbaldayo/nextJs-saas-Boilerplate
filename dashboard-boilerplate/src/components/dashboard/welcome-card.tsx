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