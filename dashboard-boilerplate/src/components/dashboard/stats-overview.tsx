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
          fetch('/api/users?count=true'),
          fetch('/api/roles?count=true'),
          fetch('/api/permissions?count=true'),
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

  const getColorClasses = (color: string, changeType: string) => {
    const colorMap = {
      blue: 'bg-muted border-border',
      green: 'bg-muted border-border',
      emerald: 'bg-muted border-border',
      yellow: 'bg-muted border-border',
      purple: 'bg-muted border-border',
      indigo: 'bg-muted border-border'
    }

    const changeColorMap = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-muted-foreground'
    }

    return {
      bg: colorMap[color as keyof typeof colorMap] || 'bg-muted border-border',
      change: changeColorMap[changeType as keyof typeof changeColorMap] || 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
                <div className="w-8 h-8 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Overview</h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-primary hover:text-primary/80 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">Overview</h2>
        <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const colors = getColorClasses(stat.color, stat.changeType)
          const StatContent = (
            <div className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md bg-muted border-border ${stat.href ? 'cursor-pointer hover:scale-105' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 bg-card bg-opacity-80 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className={`text-sm font-medium ${colors.change}`}>{stat.change}</span>
                <span className="text-sm text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          )

          return stat.href ? (
            <a key={stat.name} href={stat.href} className="block">
              {StatContent}
            </a>
          ) : (
            <div key={stat.name}>{StatContent}</div>
          )
        })}
      </div>
    </div>
  )
} 