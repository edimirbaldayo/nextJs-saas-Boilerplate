"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Role is required"),
});
type CreateUserFormData = z.infer<typeof createUserSchema>;

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(0), // Optional, only update if provided
  roleId: z.string().min(1, "Role is required"),
});
type EditUserFormData = z.infer<typeof editUserSchema>;

interface User {
  id: string;
  email: string;
  name?: string;
  userRoles: { role: { name: string } }[];
  userProfile?: { firstName?: string; lastName?: string };
  isActive: boolean;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null); // userId
  const [showDelete, setShowDelete] = useState<string | null>(null); // userId
  const [showAssignRole, setShowAssignRole] = useState<string | null>(null); // userId
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");
  const [assignRoleId, setAssignRoleId] = useState("");
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState("");

  // Fetch roles for the role select
  useEffect(() => {
    if (!showCreate) return;
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data.roles || []);
      } catch {
        setRoles([]);
      }
    };
    fetchRoles();
  }, [showCreate]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    // Fetch users with async/await
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.error) setError(data.error);
        else setUsers(data.users);
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [session, status, router]);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onCreateUser = async (data: CreateUserFormData) => {
    setCreateLoading(true);
    setCreateError("");
    setCreateSuccess("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setCreateError(err.error || "Failed to create user");
      } else {
        setCreateSuccess("User created successfully");
        setShowCreate(false);
        resetCreate();
        // Optionally refetch users
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
        setLoading(false);
      }
    } catch {
      setCreateError("Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  // Fetch roles for the role select (reuse roles state)
  useEffect(() => {
    if (!showEdit) return;
    // Find user to edit
    const user = users.find((u) => u.id === showEdit) || null;
    setEditUser(user);
    if (roles.length === 0) {
      const fetchRoles = async () => {
        try {
          const res = await fetch("/api/roles");
          const data = await res.json();
          setRoles(data.roles || []);
        } catch {
          setRoles([]);
        }
      };
      fetchRoles();
    }
  }, [showEdit, users, roles.length]);

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  // Prefill form when editUser changes
  useEffect(() => {
    if (editUser && editUser.userRoles) {
      setEditValue("name", editUser.name || "");
      setEditValue("email", editUser.email);
      setEditValue("password", "");
      const firstRoleName = editUser.userRoles.length > 0 ? editUser.userRoles[0].role.name : "";
      setEditValue("roleId", firstRoleName ? (roles.find(r => r.name === firstRoleName)?.id || "") : "");
    }
  }, [editUser, setEditValue, roles]);

  const onEditUser = async (data: EditUserFormData) => {
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: showEdit,
          name: data.name,
          email: data.email,
          password: data.password || undefined,
          roleId: data.roleId,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setEditError(err.error || "Failed to update user");
      } else {
        setEditSuccess("User updated successfully");
        setShowEdit(null);
        resetEdit();
        // Optionally refetch users
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
        setLoading(false);
      }
    } catch {
      setEditError("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const onDeleteUser = async (userId: string) => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const err = await res.json();
        setDeleteError(err.error || "Failed to delete user");
      } else {
        setShowDelete(null);
        // Refetch users
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
        setLoading(false);
      }
    } catch {
      setDeleteError("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const onAssignRole = async (userId: string) => {
    setAssignLoading(true);
    setAssignError("");
    setAssignSuccess("");
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId: assignRoleId }),
      });
      if (!res.ok) {
        const err = await res.json();
        setAssignError(err.error || "Failed to assign role");
      } else {
        setAssignSuccess("Role assigned successfully");
        setShowAssignRole(null);
        setAssignRoleId("");
        // Refetch users
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
        setLoading(false);
      }
    } catch {
      setAssignError("Failed to assign role");
    } finally {
      setAssignLoading(false);
    }
  };

  const onToggleActive = async (userId: string, isActive: boolean) => {
    setToggleLoading(userId);
    setToggleError("");
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !isActive }),
      });
      if (!res.ok) {
        const err = await res.json();
        setToggleError(err.error || "Failed to update user status");
      } else {
        // Refetch users
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
        setLoading(false);
      }
    } catch {
      setToggleError("Failed to update user status");
    } finally {
      setToggleLoading(null);
    }
  };

  // Modal skeletons
  const CreateUserModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create User</h2>
        <form onSubmit={handleCreateSubmit(onCreateUser)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...registerCreate("name")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {createErrors.name && <p className="text-red-600 text-sm">{createErrors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...registerCreate("email")} type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {createErrors.email && <p className="text-red-600 text-sm">{createErrors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input {...registerCreate("password")} type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {createErrors.password && <p className="text-red-600 text-sm">{createErrors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select {...registerCreate("roleId")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            {createErrors.roleId && <p className="text-red-600 text-sm">{createErrors.roleId.message}</p>}
          </div>
          {createError && <p className="text-red-600 text-sm">{createError}</p>}
          {createSuccess && <p className="text-green-600 text-sm">{createSuccess}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowCreate(false); resetCreate(); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={createLoading}>{createLoading ? "Creating..." : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditUserModal = ({ userId }: { userId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleEditSubmit(onEditUser)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...registerEdit("name")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {editErrors.name && <p className="text-red-600 text-sm">{editErrors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...registerEdit("email")} type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {editErrors.email && <p className="text-red-600 text-sm">{editErrors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
            <input {...registerEdit("password")} type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {editErrors.password && <p className="text-red-600 text-sm">{editErrors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select {...registerEdit("roleId")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            {editErrors.roleId && <p className="text-red-600 text-sm">{editErrors.roleId.message}</p>}
          </div>
          {editError && <p className="text-red-600 text-sm">{editError}</p>}
          {editSuccess && <p className="text-green-600 text-sm">{editSuccess}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowEdit(null); resetEdit(); }}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteUserModal = ({ userId }: { userId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Delete User</h2>
        <p>Are you sure you want to delete this user?</p>
        {deleteError && <p className="text-red-600 text-sm mt-2">{deleteError}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowDelete(null)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => onDeleteUser(userId)} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );

  const AssignRoleModal = ({ userId }: { userId: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Role</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={assignRoleId}
            onChange={e => setAssignRoleId(e.target.value)}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
        {assignError && <p className="text-red-600 text-sm">{assignError}</p>}
        {assignSuccess && <p className="text-green-600 text-sm">{assignSuccess}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowAssignRole(null); setAssignRoleId(""); }}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => onAssignRole(userId)} disabled={assignLoading || !assignRoleId}>{assignLoading ? "Assigning..." : "Assign"}</button>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowCreate(true)}>
          + Create User
        </button>
        {loading ? (
          <div>Loading users...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.name || user.userProfile?.firstName || "-"}</td>
                    <td className="px-4 py-2">{user.userRoles.map((ur) => ur.role.name).join(", ")}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className={`mr-2 px-2 py-1 rounded ${user.isActive ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}
                        onClick={() => onToggleActive(user.id, user.isActive)}
                        disabled={toggleLoading === user.id}
                      >
                        {toggleLoading === user.id ? 'Updating...' : user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      {toggleError && <span className="text-red-600 text-xs ml-2">{toggleError}</span>}
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => setShowEdit(user.id)}>Edit</button>
                      <button className="text-red-600 hover:underline mr-2" onClick={() => setShowDelete(user.id)}>Delete</button>
                      <button className="text-green-600 hover:underline" onClick={() => setShowAssignRole(user.id)}>Assign Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showCreate && <CreateUserModal />}
        {showEdit && <EditUserModal userId={showEdit} />}
        {showDelete && <DeleteUserModal userId={showDelete} />}
        {showAssignRole && <AssignRoleModal userId={showAssignRole} />}
      </div>
    </ProtectedRoute>
  );
} 