'use client'

import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function TopNavbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-card-foreground">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block text-muted-foreground">{user?.name || 'User'}</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg py-1 z-50 border border-border">
                <div className="px-4 py-2 text-sm text-popover-foreground border-b border-border">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-muted-foreground">{user?.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 