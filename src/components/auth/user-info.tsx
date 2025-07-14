'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function UserInfo() {
  const { user, roles, permissions, hasRole, hasPermission } = useAuth()

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Not authenticated</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Basic Info</h3>
          <div className="space-y-1 text-sm">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Roles</h3>
          <div className="flex flex-wrap gap-1">
            {roles.length > 0 ? (
              roles.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No roles assigned</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Permissions</h3>
          <div className="flex flex-wrap gap-1">
            {permissions.length > 0 ? (
              permissions.map((permission) => (
                <Badge key={permission} variant="outline">
                  {permission}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No permissions assigned</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Permission Checks</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Is Admin:</strong> {hasRole('admin') ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Can Access Dashboard:</strong> {hasPermission('dashboard:access') ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Can Read Users:</strong> {hasPermission('user:read') ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Can Create Users:</strong> {hasPermission('user:create') ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 