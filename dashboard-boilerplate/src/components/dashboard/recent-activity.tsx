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
        // In a real app, this would come from an API
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
          {
            id: '2',
            type: 'admin',
            title: 'New user created',
            description: 'Admin created a new user account',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            icon: '➕',
            color: 'green'
          },
          {
            id: '3',
            type: 'system',
            title: 'System backup completed',
            description: 'Daily backup completed successfully',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            icon: '💾',
            color: 'purple'
          },
          {
            id: '4',
            type: 'admin',
            title: 'Role permissions updated',
            description: 'Admin updated role permissions',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: '🔐',
            color: 'orange'
          },
          {
            id: '5',
            type: 'system',
            title: 'Database maintenance',
            description: 'Scheduled database maintenance completed',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            icon: '🔧',
            color: 'gray'
          }
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

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800'
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <span className="text-sm text-gray-500">{activities.length} activities</span>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📝</div>
          <p className="text-gray-600">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getColorClasses(activity.color)}`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <span className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
          View all activity
        </button>
      </div>
    </div>
  )
} 