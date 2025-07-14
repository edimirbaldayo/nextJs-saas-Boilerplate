'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const hasRole = (role: string) => {
    return session?.user?.roles?.includes(role) || false
  }

  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => hasRole(role))
  }

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    roles: session?.user?.roles || [],
    hasRole,
    hasAnyRole,
    signIn,
    signOut,
  }
} 