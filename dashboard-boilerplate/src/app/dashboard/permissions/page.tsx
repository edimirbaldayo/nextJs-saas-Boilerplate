"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export default function PermissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null); // permissionId
  const [showDelete, setShowDelete] = useState<string | null>(null); // permissionId
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [editPermission, setEditPermission] = useState<Permission | null>(null);

  const permissionSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    resource: z.string().min(1, "Resource is required"),
    action: z.string().min(1, "Action is required"),
    isActive: z.boolean().optional(),
  });
  type PermissionFormData = z.infer<typeof permissionSchema>;

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

  // Prefill edit form
  useEffect(() => {
    if (editPermission) {
      setEditValue("name", editPermission.name);
      setEditValue("description", editPermission.description || "");
      setEditValue("resource", editPermission.resource);
      setEditValue("action", editPermission.action);
      setEditValue("isActive", editPermission.isActive);
    }
  }, [editPermission, setEditValue]);

  const onCreatePermission = async (data: PermissionFormData) => {
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const res = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Failed to create permission");
      } else {
        setFormSuccess("Permission created successfully");
        setShowCreate(false);
        resetCreate();
        setLoading(true);
        const res = await fetch("/api/permissions");
        const data = await res.json();
        setPermissions(data.permissions);
        setLoading(false);
      }
    } catch {
      setFormError("Failed to create permission");
    } finally {
      setFormLoading(false);
    }
  };

  const onEditPermission = async (data: PermissionFormData) => {
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const res = await fetch("/api/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissionId: showEdit,
          ...data,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Failed to update permission");
      } else {
        setFormSuccess("Permission updated successfully");
        setShowEdit(null);
        resetEdit();
        setLoading(true);
        const res = await fetch("/api/permissions");
        const data = await res.json();
        setPermissions(data.permissions);
        setLoading(false);
      }
    } catch {
      setFormError("Failed to update permission");
    } finally {
      setFormLoading(false);
    }
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const onDeletePermission = async (permissionId: string) => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/permissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissionId }),
      });
      if (!res.ok) {
        const err = await res.json();
        setDeleteError(err.error || "Failed to delete permission");
      } else {
        setShowDelete(null);
        setLoading(true);
        const res = await fetch("/api/permissions");
        const data = await res.json();
        setPermissions(data.permissions);
        setLoading(false);
      }
    } catch {
      setDeleteError("Failed to delete permission");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    // Fetch permissions
    const fetchPermissions = async () => {
      try {
        const res = await fetch("/api/permissions");
        const data = await res.json();
        if (data.error) setError(data.error);
        else setPermissions(data.permissions);
      } catch {
        setError("Failed to load permissions");
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [session, status, router]);

  // Modal skeletons
  const CreatePermissionModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Permission</h2>
        <form onSubmit={handleCreateSubmit(onCreatePermission)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...registerCreate("name")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {createErrors.name && <p className="text-red-600 text-sm">{createErrors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input {...registerCreate("description")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {createErrors.description && <p className="text-red-600 text-sm">{createErrors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resource</label>
            <input {...registerCreate("resource")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {createErrors.resource && <p className="text-red-600 text-sm">{createErrors.resource.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Action</label>
            <input {...registerCreate("action")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {createErrors.action && <p className="text-red-600 text-sm">{createErrors.action.message}</p>}
          </div>
          <div className="flex items-center">
            <input type="checkbox" {...registerCreate("isActive")} defaultChecked className="mr-2" />
            <label className="text-sm">Active</label>
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-sm">{formSuccess}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowCreate(false); resetCreate(); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={formLoading}>{formLoading ? "Creating..." : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditPermissionModal = ({ permissionId }: { permissionId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Permission</h2>
        <form onSubmit={handleEditSubmit(onEditPermission)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...registerEdit("name")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {editErrors.name && <p className="text-red-600 text-sm">{editErrors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input {...registerEdit("description")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {editErrors.description && <p className="text-red-600 text-sm">{editErrors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resource</label>
            <input {...registerEdit("resource")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {editErrors.resource && <p className="text-red-600 text-sm">{editErrors.resource.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Action</label>
            <input {...registerEdit("action")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {editErrors.action && <p className="text-red-600 text-sm">{editErrors.action.message}</p>}
          </div>
          <div className="flex items-center">
            <input type="checkbox" {...registerEdit("isActive")} className="mr-2" />
            <label className="text-sm">Active</label>
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-sm">{formSuccess}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowEdit(null); resetEdit(); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={formLoading}>{formLoading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeletePermissionModal = ({ permissionId }: { permissionId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Delete Permission</h2>
        <p>Are you sure you want to delete this permission?</p>
        {deleteError && <p className="text-red-600 text-sm mt-2">{deleteError}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowDelete(null)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => onDeletePermission(permissionId)} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Permissions Management</h1>
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowCreate(true)}>
          + Create Permission
        </button>
        {loading ? (
          <div>Loading permissions...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="px-4 py-2">{permission.name}</td>
                    <td className="px-4 py-2">{permission.description || "-"}</td>
                    <td className="px-4 py-2">{permission.resource}</td>
                    <td className="px-4 py-2">{permission.action}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${permission.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{permission.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => setShowEdit(permission.id)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => setShowDelete(permission.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showCreate && <CreatePermissionModal />}
        {showEdit && <EditPermissionModal permissionId={showEdit} />}
        {showDelete && <DeletePermissionModal permissionId={showDelete} />}
      </div>
    </ProtectedRoute>
  );
} 