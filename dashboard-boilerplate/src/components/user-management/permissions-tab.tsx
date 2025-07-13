"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schemas
const permissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  resource: z.string().min(1, "Resource is required"),
  action: z.string().min(1, "Action is required"),
  isActive: z.boolean().optional(),
});
type PermissionFormData = z.infer<typeof permissionSchema>;

// Interfaces
interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

interface PermissionsTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function PermissionsTab({ onSuccess, onError }: PermissionsTabProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [editPermission, setEditPermission] = useState<Permission | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form hooks
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
  });

  // Fetch permissions
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/permissions");
      const data = await res.json();
      if (data.error) setError(data.error);
      else setPermissions(data.permissions);
    } catch {
      setError("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form population
  useEffect(() => {
    if (showEdit && editPermission) {
      setEditValue("name", editPermission.name);
      setEditValue("description", editPermission.description || "");
      setEditValue("resource", editPermission.resource);
      setEditValue("action", editPermission.action);
      setEditValue("isActive", editPermission.isActive);
    }
  }, [showEdit, editPermission, setEditValue]);

  // Load permissions on mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  // Create permission
  const onCreatePermission = async (data: PermissionFormData) => {
    setFormLoading(true);
    try {
      const res = await fetch("/api/v1/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to create permission");
      } else {
        onSuccess("Permission created successfully");
        setShowCreate(false);
        resetCreate();
        fetchPermissions();
      }
    } catch {
      onError("Failed to create permission");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit permission
  const onEditPermission = async (data: PermissionFormData) => {
    setEditLoading(true);
    try {
      const res = await fetch("/api/v1/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissionId: showEdit,
          ...data,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to update permission");
      } else {
        onSuccess("Permission updated successfully");
        setShowEdit(null);
        resetEdit();
        fetchPermissions();
      }
    } catch {
      onError("Failed to update permission");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete permission
  const onDeletePermission = async (permissionId: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/v1/permissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissionId }),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to delete permission");
      } else {
        onSuccess("Permission deleted successfully");
        setShowDelete(null);
        fetchPermissions();
      }
    } catch {
      onError("Failed to delete permission");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Permission Management</h2>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          onClick={() => setShowCreate(true)}
        >
          + Create Permission
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading permissions...</div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Resource</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Action</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td className="px-4 py-2">{permission.name}</td>
                  <td className="px-4 py-2">{permission.resource}</td>
                  <td className="px-4 py-2">{permission.action}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${permission.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-muted text-muted-foreground'}`}>
                      {permission.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      className="text-primary hover:underline mr-2"
                      onClick={() => {
                        setEditPermission(permission);
                        setShowEdit(permission.id);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-destructive hover:underline"
                      onClick={() => setShowDelete(permission.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Permission Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Create Permission</h2>
            <form onSubmit={handleCreateSubmit(onCreatePermission)} className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Resource</label>
                <input {...registerCreate("resource")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {createErrors.resource && <p className="text-red-600 text-sm">{createErrors.resource.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Action</label>
                <input {...registerCreate("action")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {createErrors.action && <p className="text-red-600 text-sm">{createErrors.action.message}</p>}
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

      {/* Edit Permission Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Edit Permission</h2>
            <form onSubmit={handleEditSubmit(onEditPermission)} className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Resource</label>
                <input {...registerEdit("resource")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {editErrors.resource && <p className="text-red-600 text-sm">{editErrors.resource.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Action</label>
                <input {...registerEdit("action")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {editErrors.action && <p className="text-red-600 text-sm">{editErrors.action.message}</p>}
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

      {/* Delete Permission Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Delete Permission</h2>
            <p className="text-muted-foreground mb-4">Are you sure you want to delete this permission? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => setShowDelete(null)}>Cancel</button>
              <button className="px-4 py-2 bg-destructive text-white rounded" onClick={() => onDeletePermission(showDelete)} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 