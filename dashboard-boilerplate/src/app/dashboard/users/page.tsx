"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UsersTab, RolesTab, PermissionsTab } from "@/components/user-management";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Handle success and error messages
  const handleSuccess = (message: string) => {
    setFormSuccess(message);
    // Clear success message after 3 seconds
    setTimeout(() => setFormSuccess(""), 3000);
  };

  const handleError = (message: string) => {
    setFormError(message);
    // Clear error message after 5 seconds
    setTimeout(() => setFormError(""), 5000);
  };

  // Check authentication
  if (status === "loading") return null;
  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <UsersTab onSuccess={handleSuccess} onError={handleError} />
          </TabsContent>
          
          <TabsContent value="roles" className="mt-6">
            <RolesTab onSuccess={handleSuccess} onError={handleError} />
          </TabsContent>
          
          <TabsContent value="permissions" className="mt-6">
            <PermissionsTab onSuccess={handleSuccess} onError={handleError} />
          </TabsContent>
        </Tabs>

        {/* Success/Error Messages */}
        {formSuccess && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            {formSuccess}
          </div>
        )}
        {formError && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            {formError}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 