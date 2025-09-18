"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { UserHeader, UserContent } from "./components";

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "Hasan Abbas",
    email: "abbas_hasan12@joysapps.com",
    role: "worker",
    workerType: "permanent-clicker",
    defaultTasker: "Tasker Click",
    defaultTaskerSlug: "tasker-click",
    status: "permanent",
    locked: "unlocked",
    links: 1,
    created: "2025-09-10 20:17:31"
  },
  {
    id: 2,
    name: "Muhammad Shahood",
    email: "Shahood1@joyapps.net",
    role: "worker",
    workerType: "permanent-viewer",
    defaultTasker: "Tasker Views",
    defaultTaskerSlug: "tasker-views",
    status: "permanent",
    locked: "unlocked",
    links: 1,
    created: "2025-09-10 16:46:31"
  },
  {
    id: 3,
    name: "Abid",
    email: "Abid1@joyapps.net",
    role: "worker",
    workerType: "permanent-clicker",
    defaultTasker: "Tasker Click",
    defaultTaskerSlug: "tasker-click",
    status: "trainee",
    locked: "unlocked",
    links: 0,
    created: "2025-09-10 15:30:15"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah.johnson@joyapps.net",
    role: "admin",
    workerType: "permanent-viewer",
    defaultTasker: "Tasker Views",
    defaultTaskerSlug: "tasker-views",
    status: "permanent",
    locked: "unlocked",
    links: 3,
    created: "2025-09-09 14:22:45"
  },
  {
    id: 5,
    name: "Mike Chen",
    email: "mike.chen@joyapps.net",
    role: "worker",
    workerType: "permanent-clicker",
    defaultTasker: "Tasker Click",
    defaultTaskerSlug: "tasker-click",
    status: "trainee",
    locked: "unlocked",
    links: 0,
    created: "2025-09-09 10:53:01"
  }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState("100");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "admin_test_a52fcb@example.com",
    role: "worker",
    workerType: "",
    status: "trainee",
    password: "",
    defaultTasker: "none",
    assignedUsers: []
  });
  const [isInitialized, setIsInitialized] = useState(false);

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

  const handleCreateUser = () => {
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const userToAdd = {
      ...newUser,
      id: newId,
      defaultTasker: newUser.defaultTasker === "none" ? "— none —" : 
                    newUser.defaultTasker === "tasker-click" ? "Tasker Click" : "Tasker Views",
      defaultTaskerSlug: newUser.defaultTasker === "none" ? "" : newUser.defaultTasker,
      locked: "unlocked",
      links: 0,
      created: new Date().toISOString().slice(0, 19).replace('T', ' '),
      assignedUsers: newUser.assignedUsers || []
    };
    
    setUsers([...users, userToAdd]);
    setNewUser({
      name: "",
      email: "admin_test_a52fcb@example.com",
      role: "worker",
      workerType: "",
      status: "trainee",
      password: "",
      defaultTasker: "none",
      assignedUsers: []
    });
    setIsCreateDialogOpen(false);
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

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      defaultTasker: editingUser.defaultTasker === "none" ? "— none —" : 
                    editingUser.defaultTasker === "tasker-click" ? "Tasker Click" : "Tasker Views",
      defaultTaskerSlug: editingUser.defaultTasker === "none" ? "" : editingUser.defaultTasker,
      assignedUsers: editingUser.assignedUsers || []
    };

    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === editingUser.id ? updatedUser : user
      )
    );
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Show loading state until initialized
  if (!isInitialized) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 h-full">
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
    </MainLayout>
  );
}