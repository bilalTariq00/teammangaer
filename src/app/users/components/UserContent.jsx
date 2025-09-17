"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserTable from "./UserTable";

const UserContent = ({
  filteredUsers,
  onEditUser,
  onDeleteUser,
  onWorkerClick
}) => {
  return (
    <Card className="flex-1 min-h-0">
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>Manage your team members and their permissions</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <UserTable
          users={filteredUsers}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
          onWorkerClick={onWorkerClick}
        />
      </CardContent>
    </Card>
  );
};

export default UserContent;
