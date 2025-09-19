"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";

const UserTable = ({ 
  users, 
  onEditUser, 
  onDeleteUser, 
  onWorkerClick 
}) => {
  const router = useRouter();

  const handleEditUser = (user) => {
    router.push(`/users/edit/${user.id}`);
  };
  return (
    <div className="overflow-auto h-full max-h-[calc(100vh-300px)]">
      <Table className="w-full min-w-[800px]">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-muted/50">
            <TableHead className="w-[150px] px-4 py-3 text-left font-semibold">Name</TableHead>
            <TableHead className="w-[200px] px-4 py-3 text-left font-semibold">Email</TableHead>
            <TableHead className="w-[80px] px-4 py-3 text-center font-semibold">Role</TableHead>
            <TableHead className="w-[120px] px-4 py-3 text-center font-semibold">Worker Type</TableHead>
            <TableHead className="w-[150px] px-4 py-3 text-left font-semibold">Default Tasker</TableHead>
            <TableHead className="w-[100px] px-4 py-3 text-center font-semibold">Status</TableHead>
            <TableHead className="w-[80px] px-4 py-3 text-center font-semibold">Locked</TableHead>
            <TableHead className="w-[60px] px-4 py-3 text-center font-semibold">Links</TableHead>
            <TableHead className="w-[120px] px-4 py-3 text-left font-semibold">Created</TableHead>
            <TableHead className="w-[100px] px-4 py-3 text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50 border-b">
              <TableCell className="w-[150px] px-4 py-3 font-medium text-left">
                <span 
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => onWorkerClick(user.id)}
                >
                  {user.name}
                </span>
              </TableCell>
              <TableCell className="w-[200px] px-4 py-3 text-left text-sm">
                {user.email}
              </TableCell>
              <TableCell className="w-[80px] px-4 py-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                  {user.role === "manager" && user.assignedUsers && user.assignedUsers.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{user.assignedUsers.length} team</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-[120px] px-4 py-3 text-center">
                <Badge variant="outline" className="text-xs">
                  {user.workerType === "task-clicker" ? "Task Clicker" : "Task Viewer"}
                </Badge>
              </TableCell>
              <TableCell className="w-[150px] px-4 py-3 text-left text-sm">
                {user.defaultTasker}
              </TableCell>
              <TableCell className="w-[100px] px-4 py-3 text-center">
                <Badge 
                  variant={user.status === "permanent" ? "default" : 
                         user.status === "trainee" ? "secondary" : 
                         user.status === "terminated" ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="w-[80px] px-4 py-3 text-center">
                <Badge variant={user.locked === "unlocked" ? "outline" : "destructive"} className="text-xs">
                  {user.locked}
                </Badge>
              </TableCell>
              <TableCell className="w-[60px] px-4 py-3 text-center font-medium">
                {user.links}
              </TableCell>
              <TableCell className="w-[120px] px-4 py-3 text-left text-sm text-muted-foreground">
                {user.created}
              </TableCell>
              <TableCell className="w-[100px] px-4 py-3 text-center">
                <div className="flex gap-1 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteUser(user)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
