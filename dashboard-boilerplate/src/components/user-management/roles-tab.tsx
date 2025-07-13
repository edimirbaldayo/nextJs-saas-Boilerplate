"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schemas
const roleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
type RoleFormData = z.infer<typeof roleSchema>;

// Interfaces
interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

interface RolesTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function RolesTab({ onSuccess, onError }: RolesTabProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Permissions management state
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState<string[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsSaving, setPermissionsSaving] = useState(false);

  // Form hooks
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/roles");
      const data = await res.json();
      if (data.error) setError(data.error);
      else setRoles(data.roles);
    } catch {
      setError("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form population
  useEffect(() => {
    if (showEdit && editRole) {
      setEditValue("name", editRole.name);
      setEditValue("description", editRole.description || "");
      setEditValue("isActive", editRole.isActive);
    }
  }, [showEdit, editRole, setEditValue]);

  // Load roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Create role
  const onCreateRole = async (data: RoleFormData) => {
    setFormLoading(true);
    try {
      const res = await fetch("/api/v1/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to create role");
      } else {
        onSuccess("Role created successfully");
        setShowCreate(false);
        resetCreate();
        fetchRoles();
      }
    } catch {
      onError("Failed to create role");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit role
  const onEditRole = async (data: RoleFormData) => {
    setEditLoading(true);
    try {
      const res = await fetch("/api/v1/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: showEdit,
          ...data,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to update role");
      } else {
        onSuccess("Role updated successfully");
        setShowEdit(null);
        resetEdit();
        fetchRoles();
      }
    } catch {
      onError("Failed to update role");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete role
  const onDeleteRole = async (roleId: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/v1/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to delete role");
      } else {
        onSuccess("Role deleted successfully");
        setShowDelete(null);
        fetchRoles();
      }
    } catch {
      onError("Failed to delete role");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Fetch role permissions
  const fetchRolePermissions = async (roleId: string) => {
    setPermissionsLoading(true);
    try {
      const res = await fetch(`/api/v1/roles/${roleId}/permissions`);
      const data = await res.json();
      if (data.error) {
        onError(data.error);
      } else {
        setAllPermissions(data.allPermissions);
        setAssignedPermissionIds(data.assignedPermissionIds);
      }
    } catch {
      onError("Failed to load permissions");
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Handle permission changes
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setAssignedPermissionIds(prev => [...prev, permissionId]);
    } else {
      setAssignedPermissionIds(prev => prev.filter((id: string) => id !== permissionId));
    }
  };

  // Save permission changes
  const savePermissions = async () => {
    if (!showPermissions) return;
    
    setPermissionsSaving(true);
    try {
      // Get current assigned permissions from the API
      const currentRes = await fetch(`/api/v1/roles/${showPermissions}/permissions`);
      const currentData = await currentRes.json();
      const currentAssignedIds = currentData.assignedPermissionIds || [];

      // Calculate permissions to add and remove
      const permissionsToAdd = assignedPermissionIds.filter((id: string) => !currentAssignedIds.includes(id));
      const permissionsToRemove = currentAssignedIds.filter((id: string) => !assignedPermissionIds.includes(id));

      // Add new permissions
      if (permissionsToAdd.length > 0) {
        const addRes = await fetch(`/api/v1/roles/${showPermissions}/permissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissionIds: permissionsToAdd }),
        });
        if (!addRes.ok) {
          const err = await addRes.json();
          onError(err.error || "Failed to assign permissions");
          return;
        }
      }

      // Remove permissions
      if (permissionsToRemove.length > 0) {
        const removeRes = await fetch(`/api/v1/roles/${showPermissions}/permissions`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissionIds: permissionsToRemove }),
        });
        if (!removeRes.ok) {
          const err = await removeRes.json();
          onError(err.error || "Failed to unassign permissions");
          return;
        }
      }

      onSuccess("Permissions updated successfully");
      setShowPermissions(null);
    } catch {
      onError("Failed to update permissions");
    } finally {
      setPermissionsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Role Management</h2>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          onClick={() => setShowCreate(true)}
        >
          + Create Role
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading roles...</div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-4 py-2">{role.name}</td>
                  <td className="px-4 py-2">{role.description || "-"}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${role.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-muted text-muted-foreground'}`}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      className="text-primary hover:underline mr-2"
                      onClick={() => {
                        setEditRole(role);
                        setShowEdit(role.id);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-destructive hover:underline mr-2"
                      onClick={() => setShowDelete(role.id)}
                    >
                      Delete
                    </button>
                    <button 
                      className="text-success hover:underline"
                      onClick={() => {
                        setShowPermissions(role.id);
                        fetchRolePermissions(role.id);
                      }}
                    >
                      Manage Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Create Role</h2>
            <form onSubmit={handleCreateSubmit(onCreateRole)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Name</label>
                <input {...registerCreate("name")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {createErrors.name && <p className="text-red-600 text-sm">{createErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Description</label>
                <input {...registerCreate("description")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {createErrors.description && <p className="text-red-600 text-sm">{createErrors.description.message}</p>}
              </div>
              <div className="flex items-center">
                <input type="checkbox" {...registerCreate("isActive")} defaultChecked className="mr-2" />
                <label className="text-sm text-muted-foreground">Active</label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => { setShowCreate(false); resetCreate(); }}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded" disabled={formLoading}>{formLoading ? "Creating..." : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Edit Role</h2>
            <form onSubmit={handleEditSubmit(onEditRole)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Name</label>
                <input {...registerEdit("name")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {editErrors.name && <p className="text-red-600 text-sm">{editErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Description</label>
                <input {...registerEdit("description")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {editErrors.description && <p className="text-red-600 text-sm">{editErrors.description.message}</p>}
              </div>
              <div className="flex items-center">
                <input type="checkbox" {...registerEdit("isActive")} className="mr-2" />
                <label className="text-sm text-muted-foreground">Active</label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => { setShowEdit(null); resetEdit(); }}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Delete Role</h2>
            <p className="text-muted-foreground mb-4">Are you sure you want to delete this role? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => setShowDelete(null)}>Cancel</button>
              <button className="px-4 py-2 bg-destructive text-white rounded" onClick={() => onDeleteRole(showDelete)} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Permissions Modal */}
      {showPermissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Manage Permissions</h2>
            
            {permissionsLoading ? (
              <div className="text-center py-8">Loading permissions...</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={assignedPermissionIds.includes(permission.id)}
                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                        className="rounded border-border"
                      />
                      <div className="flex-1">
                        <label htmlFor={permission.id} className="text-sm font-medium text-card-foreground cursor-pointer">
                          {permission.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description || `${permission.resource}:${permission.action}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-muted text-muted-foreground rounded" 
                    onClick={() => setShowPermissions(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded" 
                    onClick={savePermissions}
                    disabled={permissionsSaving}
                  >
                    {permissionsSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 