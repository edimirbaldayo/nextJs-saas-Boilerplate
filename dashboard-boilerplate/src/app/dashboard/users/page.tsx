"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface User {
  id: string;
  email: string;
  name?: string;
  userRoles: { role: { name: string } }[];
  userProfile?: { firstName?: string; lastName?: string };
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // TODO: Add create, update, delete, assign role actions

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
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
                      {/* TODO: Add edit, delete, assign role buttons */}
                      <button className="text-blue-600 hover:underline mr-2" disabled>Edit</button>
                      <button className="text-red-600 hover:underline mr-2" disabled>Delete</button>
                      <button className="text-green-600 hover:underline" disabled>Assign Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 