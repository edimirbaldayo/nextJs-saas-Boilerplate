"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Add Permission type
interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export default function RolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null); // roleId
  const [showDelete, setShowDelete] = useState<string | null>(null); // roleId
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [showPermissions, setShowPermissions] = useState<string | null>(null); // roleId
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]); // permissionIds
  const [permLoading, setPermLoading] = useState(false);
  const [permError, setPermError] = useState("");
  const [permSuccess, setPermSuccess] = useState("");

  const roleSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  });
  type RoleFormData = z.infer<typeof roleSchema>;

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

  // Prefill edit form
  useEffect(() => {
    if (editRole) {
      setEditValue("name", editRole.name);
      setEditValue("description", editRole.description || "");
      setEditValue("isActive", editRole.isActive);
    }
  }, [editRole, setEditValue]);

  const onCreateRole = async (data: RoleFormData) => {
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Failed to create role");
      } else {
        setFormSuccess("Role created successfully");
        setShowCreate(false);
        resetCreate();
        setLoading(true);
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data.roles);
        setLoading(false);
      }
    } catch {
      setFormError("Failed to create role");
    } finally {
      setFormLoading(false);
    }
  };

  const onEditRole = async (data: RoleFormData) => {
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const res = await fetch("/api/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: showEdit,
          ...data,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Failed to update role");
      } else {
        setFormSuccess("Role updated successfully");
        setShowEdit(null);
        resetEdit();
        setLoading(true);
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data.roles);
        setLoading(false);
      }
    } catch {
      setFormError("Failed to update role");
    } finally {
      setFormLoading(false);
    }
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const onDeleteRole = async (roleId: string) => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      if (!res.ok) {
        const err = await res.json();
        setDeleteError(err.error || "Failed to delete role");
      } else {
        setShowDelete(null);
        setLoading(true);
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data.roles);
        setLoading(false);
      }
    } catch {
      setDeleteError("Failed to delete role");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Fetch all permissions and role's assigned permissions when modal opens
  useEffect(() => {
    if (!showPermissions) return;
    setPermLoading(true);
    setPermError("");
    setPermSuccess("");
    const fetchPerms = async () => {
      try {
        const [allRes, roleRes] = await Promise.all([
          fetch("/api/permissions"),
          fetch(`/api/roles?roleId=${showPermissions}`),
        ]);
        const allData = await allRes.json();
        const roleData = await roleRes.json();
        setPermissions(allData.permissions || []);
        setRolePermissions(roleData.role?.permissions?.map((p: Permission) => p.id) || []);
      } catch {
        setPermError("Failed to load permissions");
      } finally {
        setPermLoading(false);
      }
    };
    fetchPerms();
  }, [showPermissions]);

  const handlePermissionToggle = (permId: string) => {
    setRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSavePermissions = async () => {
    setPermLoading(true);
    setPermError("");
    setPermSuccess("");
    try {
      // Fetch current permissions for the role
      const roleRes = await fetch(`/api/roles?roleId=${showPermissions}`);
      const roleData = await roleRes.json();
      const currentPerms: string[] = roleData.role?.permissions?.map((p: Permission) => p.id) || [];
      const toAssign = rolePermissions.filter((id) => !currentPerms.includes(id));
      const toUnassign = currentPerms.filter((id) => !rolePermissions.includes(id));
      if (toAssign.length > 0) {
        await fetch(`/api/roles/${showPermissions}/permissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissionIds: toAssign }),
        });
      }
      if (toUnassign.length > 0) {
        await fetch(`/api/roles/${showPermissions}/permissions`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissionIds: toUnassign }),
        });
      }
      setPermSuccess("Permissions updated successfully");
      setShowPermissions(null);
      setLoading(true);
      const res = await fetch("/api/roles");
      const data = await res.json();
      setRoles(data.roles);
      setLoading(false);
    } catch {
      setPermError("Failed to update permissions");
    } finally {
      setPermLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    // Fetch roles
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        if (data.error) setError(data.error);
        else setRoles(data.roles);
      } catch {
        setError("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [session, status, router]);

  // Modal skeletons
  const CreateRoleModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Create Role</h2>
        <form onSubmit={handleCreateSubmit(onCreateRole)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <input {...registerCreate("name")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground" />
            {createErrors.name && <p className="text-red-600 text-sm">{createErrors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Description</label>
            <input {...registerCreate("description")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground" />
            {createErrors.description && <p className="text-red-600 text-sm">{createErrors.description.message}</p>}
          </div>
          <div className="flex items-center">
            <input type="checkbox" {...registerCreate("isActive")} defaultChecked className="mr-2" />
            <label className="text-sm text-muted-foreground">Active</label>
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-sm">{formSuccess}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => { setShowCreate(false); resetCreate(); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded" disabled={formLoading}>{formLoading ? "Creating..." : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditRoleModal = ({ roleId }: { roleId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Edit Role</h2>
        <form onSubmit={handleEditSubmit(onEditRole)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <input {...registerEdit("name")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground" />
            {editErrors.name && <p className="text-red-600 text-sm">{editErrors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Description</label>
            <input {...registerEdit("description")} className="mt-1 block w-full rounded-md border border-border shadow-sm bg-background text-card-foreground" />
            {editErrors.description && <p className="text-red-600 text-sm">{editErrors.description.message}</p>}
          </div>
          <div className="flex items-center">
            <input type="checkbox" {...registerEdit("isActive")} className="mr-2" />
            <label className="text-sm text-muted-foreground">Active</label>
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-sm">{formSuccess}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => { setShowEdit(null); resetEdit(); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded" disabled={formLoading}>{formLoading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteRoleModal = ({ roleId }: { roleId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Delete Role</h2>
        <p className="text-muted-foreground">Are you sure you want to delete this role?</p>
        {deleteError && <p className="text-red-600 text-sm mt-2">{deleteError}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded" onClick={() => setShowDelete(null)}>Cancel</button>
          <button className="px-4 py-2 bg-destructive text-white rounded" onClick={() => onDeleteRole(roleId)} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );

  // Add ManagePermissionsModal
  const ManagePermissionsModal = ({ roleId }: { roleId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-lg border border-border">
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Manage Permissions</h2>
        {permLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : permError ? (
          <p className="text-red-600 text-sm">{permError}</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSavePermissions();
            }}
            className="space-y-4"
          >
            <div className="max-h-64 overflow-y-auto border rounded p-2 border-border bg-background">
              {permissions.map((perm) => (
                <div key={perm.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={rolePermissions.includes(perm.id)}
                    onChange={() => handlePermissionToggle(perm.id)}
                    id={`perm-${perm.id}`}
                    className="mr-2"
                  />
                  <label htmlFor={`perm-${perm.id}`}>{perm.name} <span className="text-xs text-muted-foreground">({perm.resource}:{perm.action})</span></label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowPermissions(null)} className="px-4 py-2 bg-muted text-muted-foreground rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded" disabled={permLoading}>Save</button>
            </div>
            {permSuccess && <p className="text-green-600 text-sm">{permSuccess}</p>}
          </form>
        )}
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Roles Management</h1>
        <button className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded" onClick={() => setShowCreate(true)}>
          + Create Role
        </button>
        {loading ? (
          <div>Loading roles...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
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
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${role.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-muted text-muted-foreground'}`}>{role.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-primary hover:underline mr-2" onClick={() => setShowEdit(role.id)}>Edit</button>
                      <button className="text-destructive hover:underline" onClick={() => setShowDelete(role.id)}>Delete</button>
                      <button onClick={() => setShowPermissions(role.id)} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs ml-2 dark:bg-indigo-700 dark:hover:bg-indigo-800">Manage Permissions</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showCreate && <CreateRoleModal />}
        {showEdit && <EditRoleModal roleId={showEdit} />}
        {showDelete && <DeleteRoleModal roleId={showDelete} />}
        {showPermissions && <ManagePermissionsModal roleId={showPermissions} />}
      </div>
    </ProtectedRoute>
  );
} 