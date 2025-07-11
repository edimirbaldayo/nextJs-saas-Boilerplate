'use client'

import { useAuth } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'

interface UserStats {
  totalUsers?: number
  totalRoles?: number
  totalPermissions?: number
  recentActivity?: number
}

export function WelcomeCard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({})
  const [loading, setLoading] = useState(true)
  const [lastLogin, setLastLogin] = useState<string>('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch dashboard stats if user is admin
        const [usersRes, rolesRes, permissionsRes] = await Promise.all([
          fetch('/api/users?count=true'),
          fetch('/api/roles?count=true'),
          fetch('/api/permissions?count=true'),
        ])

        const userCount = usersRes.ok ? await usersRes.json() : { count: 0 }
        const roleCount = rolesRes.ok ? await rolesRes.json() : { count: 0 }
        const permCount = permissionsRes.ok ? await permissionsRes.json() : { count: 0 }

        setStats({
          totalUsers: userCount.count || 0,
          totalRoles: roleCount.count || 0,
          totalPermissions: permCount.count || 0,
          recentActivity: Math.floor(Math.random() * 10) + 1, // Placeholder
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Set last login time (in real app, this would come from user session)
    setLastLogin(new Date().toLocaleString())
  }, [])

  const getUserRole = () => {
    // In a real app, this would come from user roles
    return user?.email === 'admin@example.com' ? 'Administrator' : 'User'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg text-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-card/80 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user?.name || 'User'}!
              </h1>
              <p className="text-blue-100 mt-1">
                {getUserRole()} • Welcome to your dashboard
              </p>
            </div>
          </div>
          
          {!loading && user?.email === 'admin@example.com' && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalRoles}</div>
                <div className="text-sm text-muted-foreground">Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalPermissions}</div>
                <div className="text-sm text-muted-foreground">Permissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.recentActivity}</div>
                <div className="text-sm text-muted-foreground">Recent Activity</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="hidden lg:block text-right">
          <div className="bg-card/60 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Last login</p>
            <p className="text-sm font-medium">{lastLogin}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 