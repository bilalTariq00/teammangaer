"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserManagementLayout from "@/components/layout/UserManagementLayout";
import { UserHeader, UserContent } from "./components";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, UserCheck, UserX, Building } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState("100");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    workerType: "permanent",
    status: "trainee",
    password: "",
    defaultTasker: "none",
    assignedUsers: []
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load users from backend
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view users");
        router.push("/login");
        return;
      }

      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.error || 'Failed to load users');
        toast.error(result.error || 'Failed to load users');
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Ensure state is properly initialized before rendering Select components
  React.useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleWorkerClick = (userId) => {
    // Navigate to worker detail page
    window.location.href = `/worker/${userId}`;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to create users");
        router.push("/login");
        return;
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("User created successfully!");
        setNewUser({
          name: "",
          email: "",
          role: "user",
          workerType: "permanent",
          status: "trainee",
          password: "",
          defaultTasker: "none",
          assignedUsers: []
        });
        setIsCreateDialogOpen(false);
        // Reload users to get the updated list
        loadUsers();
      } else {
        toast.error(result.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  const handleEditUser = (user) => {
    // Map the display values back to select values for the edit form
    const editUser = {
      ...user,
      defaultTasker: user.defaultTasker === "— none —" ? "none" : 
                    user.defaultTasker === "Tasker Click" ? "tasker-click" : 
                    user.defaultTasker === "Tasker Views" ? "tasker-views" : "none"
    };
    setEditingUser(editUser);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to update users");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingUser)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("User updated successfully!");
        setIsEditDialogOpen(false);
        setEditingUser(null);
        // Reload users to get the updated list
        loadUsers();
      } else {
        toast.error(result.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to delete users");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("User deleted successfully!");
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        // Reload users to get the updated list
        loadUsers();
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <UserManagementLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading users...</span>
          </div>
        </div>
      </UserManagementLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <UserManagementLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadUsers} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </UserManagementLayout>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const permanentUsers = users.filter(u => u.status === 'permanent').length;
  const traineeUsers = users.filter(u => u.status === 'trainee').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const managerUsers = users.filter(u => u.role === 'manager').length;
  const hrUsers = users.filter(u => u.role === 'hr').length;
  const qcUsers = users.filter(u => u.role === 'qc').length;
  const workerUsers = users.filter(u => u.role === 'user').length;

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <UserManagementLayout>
        <div className="space-y-6 h-full">
          {/* Header with Refresh Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage all users and their permissions</p>
            </div>
            <Button onClick={loadUsers} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Permanent</p>
                    <p className="text-2xl font-bold">{permanentUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Trainees</p>
                    <p className="text-2xl font-bold">{traineeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-2xl font-bold">{adminUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        

          <UserHeader
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            newUser={newUser}
            setNewUser={setNewUser}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            userToDelete={userToDelete}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onConfirmDelete={confirmDeleteUser}
          />

          <UserContent
            filteredUsers={filteredUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onWorkerClick={handleWorkerClick}
          />
        </div>
      </UserManagementLayout>
    </RoleProtectedRoute>
  );
}