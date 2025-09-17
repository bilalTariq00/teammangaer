"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserFilters from "./UserFilters";
import UserDialogs from "./UserDialogs";

const UserHeader = ({
  searchTerm,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  statusFilter,
  onStatusFilterChange,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  newUser,
  setNewUser,
  editingUser,
  setEditingUser,
  userToDelete,
  onCreateUser,
  onUpdateUser,
  onConfirmDelete
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions.
          </p>
        </div>
        <UserDialogs
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
          onCreateUser={onCreateUser}
          onUpdateUser={onUpdateUser}
          onConfirmDelete={onConfirmDelete}
        />
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-6">
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default UserHeader;
