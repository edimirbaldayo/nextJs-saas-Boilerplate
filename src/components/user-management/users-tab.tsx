"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schemas
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Role is required"),
  isActive: z.boolean().optional(),
});
type CreateUserFormData = z.infer<typeof createUserSchema>;

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(0), // Optional, only update if provided
  roleId: z.string().min(1, "Role is required"),
  isActive: z.boolean().optional(),
});
type EditUserFormData = z.infer<typeof editUserSchema>;

// Interfaces
interface User {
  id: string;
  email: string;
  name?: string;
  userRoles: { role: { name: string } }[];
  userProfile?: { firstName?: string; lastName?: string };
  isActive: boolean;
}

interface UsersTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function UsersTab({ onSuccess, onError }: UsersTabProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<{ id: string; name: string }[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form hooks
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/users");
      const data = await res.json();
      if (data.error) setError(data.error);
      else setUsers(data.users);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles for user creation
  useEffect(() => {
    if (!showCreate) return;
    const fetchUserRoles = async () => {
      try {
        const res = await fetch("/api/v1/roles");
        const data = await res.json();
        setUserRoles(data.roles || []);
      } catch {
        setUserRoles([]);
      }
    };
    fetchUserRoles();
  }, [showCreate]);

  // Handle edit form population
  useEffect(() => {
    if (showEdit && editUser) {
      setEditValue("name", editUser.name || "");
      setEditValue("email", editUser.email);
      setEditValue("password", "");
      setEditValue("isActive", editUser.isActive);
      const firstRoleName = editUser.userRoles.length > 0 ? editUser.userRoles[0]?.role?.name : "";
      setEditValue("roleId", firstRoleName ? (userRoles.find(r => r.name === firstRoleName)?.id || "") : "");
    }
  }, [showEdit, editUser, setEditValue, userRoles]);

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const onCreateUser = async (data: CreateUserFormData) => {
    setFormLoading(true);
    try {
      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to create user");
      } else {
        onSuccess("User created successfully");
        setShowCreate(false);
        resetCreate();
        fetchUsers();
      }
    } catch {
      onError("Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit user
  const onEditUser = async (data: EditUserFormData) => {
    setEditLoading(true);
    try {
      const res = await fetch("/api/v1/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: showEdit,
          ...data,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to update user");
      } else {
        onSuccess("User updated successfully");
        setShowEdit(null);
        resetEdit();
        fetchUsers();
      }
    } catch {
      onError("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete user
  const onDeleteUser = async (userId: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/v1/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const err = await res.json();
        onError(err.error || "Failed to delete user");
      } else {
        onSuccess("User deleted successfully");
        setShowDelete(null);
        fetchUsers();
      }
    } catch {
      onError("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          onClick={() => setShowCreate(true)}
        >
          + Create User
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.name || user.userProfile?.firstName || "-"}</td>
                  <td className="px-4 py-2">{user.userRoles.map((ur) => ur.role.name).join(", ")}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-muted text-muted-foreground'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      className="text-primary hover:underline mr-2"
                      onClick={() => {
                        setEditUser(user);
                        setShowEdit(user.id);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-destructive hover:underline mr-2"
                      onClick={() => setShowDelete(user.id)}
                    >
                      Delete
                    </button>
                    <button className="text-success hover:underline">Assign Role</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Create User</h2>
            <form onSubmit={handleCreateSubmit(onCreateUser)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Name</label>
                <input {...registerCreate("name")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {createErrors.name && <p className="text-red-600 text-sm">{createErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                <input {...registerCreate("email")} type="email" className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {createErrors.email && <p className="text-red-600 text-sm">{createErrors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Password</label>
                <input {...registerCreate("password")} type="password" className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {createErrors.password && <p className="text-red-600 text-sm">{createErrors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Role</label>
                <select {...registerCreate("roleId")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2">
                  <option value="">Select a role</option>
                  {userRoles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                {createErrors.roleId && <p className="text-red-600 text-sm">{createErrors.roleId.message}</p>}
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

      {/* Edit User Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Edit User</h2>
            <form onSubmit={handleEditSubmit(onEditUser)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Name</label>
                <input {...registerEdit("name")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {editErrors.name && <p className="text-red-600 text-sm">{editErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                <input {...registerEdit("email")} type="email" className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {editErrors.email && <p className="text-red-600 text-sm">{editErrors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Password (leave blank to keep current)</label>
                <input {...registerEdit("password")} type="password" className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2" />
                {editErrors.password && <p className="text-red-600 text-sm">{editErrors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Role</label>
                <select {...registerEdit("roleId")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground px-3 py-2">
                  <option value="">Select a role</option>
                  {userRoles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                {editErrors.roleId && <p className="text-red-600 text-sm">{editErrors.roleId.message}</p>}
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

      {/* Delete User Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Delete User</h2>
            <p className="text-muted-foreground mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => setShowDelete(null)}>Cancel</button>
              <button className="px-4 py-2 bg-destructive text-white rounded" onClick={() => onDeleteUser(showDelete)} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 