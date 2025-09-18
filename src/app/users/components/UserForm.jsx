"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, X } from "lucide-react";

const UserForm = ({ 
  user, 
  onUserChange, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}) => {
  // Available users for manager assignment (excluding admins and other managers)
  const availableUsers = [
    { id: 1, name: "Hasan Abbas", email: "abbas_hasan12@joysapps.com", role: "worker", workerType: "permanent-clicker" },
    { id: 2, name: "Muhammad Shahood", email: "Shahood1@joyapps.net", role: "worker", workerType: "permanent-viewer" },
    { id: 3, name: "Abid", email: "Abid1@joyapps.net", role: "worker", workerType: "permanent-clicker" },
    { id: 4, name: "Sarah Johnson", email: "sarah@joyapps.net", role: "worker", workerType: "trainee-viewer" },
    { id: 5, name: "John Doe", email: "john@joyapps.net", role: "worker", workerType: "trainee-clicker" },
    { id: 6, name: "Jane Smith", email: "jane@joyapps.net", role: "worker", workerType: "permanent-clicker" },
    { id: 7, name: "Mike Wilson", email: "mike@joyapps.net", role: "worker", workerType: "permanent-viewer" },
    { id: 8, name: "Lisa Brown", email: "lisa@joyapps.net", role: "worker", workerType: "trainee-viewer" },
    { id: 9, name: "David Lee", email: "david@joyapps.net", role: "worker", workerType: "trainee-clicker" },
    { id: 10, name: "Emma Davis", email: "emma@joyapps.net", role: "worker", workerType: "permanent-clicker" }
  ];

  const [selectedUsers, setSelectedUsers] = useState(user?.assignedUsers || []);

  // Helper function to ensure Select values are never empty strings
  const getSafeSelectValue = (value, fallback) => {
    if (!value || value === "") {
      return fallback;
    }
    return value;
  };

  // Update selected users when user prop changes
  useEffect(() => {
    setSelectedUsers(user?.assignedUsers || []);
  }, [user?.assignedUsers]);

  // Handle user selection for managers
  const handleUserSelection = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    let newSelectedUsers;
    if (isSelected) {
      newSelectedUsers = selectedUsers.filter(id => id !== userId);
    } else {
      newSelectedUsers = [...selectedUsers, userId];
    }
    setSelectedUsers(newSelectedUsers);
    onUserChange({...user, assignedUsers: newSelectedUsers});
  };

  // Handle removing a user from selection
  const handleRemoveUser = (userId) => {
    const newSelectedUsers = selectedUsers.filter(id => id !== userId);
    setSelectedUsers(newSelectedUsers);
    onUserChange({...user, assignedUsers: newSelectedUsers});
  };

  // Get selected user details
  const getSelectedUserDetails = () => {
    return availableUsers.filter(user => selectedUsers.includes(user.id));
  };

  return (
    <div className="space-y-3 max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-name" : "name"}>Full Name</Label>
          <Input
            id={isEdit ? "edit-name" : "name"}
            value={user.name}
            onChange={(e) => onUserChange({...user, name: e.target.value})}
            placeholder="Enter full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-email" : "email"}>Email</Label>
          <Input
            id={isEdit ? "edit-email" : "email"}
            type="email"
            value={user.email}
            onChange={(e) => onUserChange({...user, email: e.target.value})}
            placeholder="Enter email address"
          />
        </div>
      </div>
      
      {/* Role and Worker Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-role" : "role"}>Role</Label>
          <Select 
            value={getSafeSelectValue(user?.role, "worker")} 
            onValueChange={(value) => onUserChange({...user, role: getSafeSelectValue(value, "worker")})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="qc">QC (Quality Control)</SelectItem>
              <SelectItem value="hr">HR (Human Resources)</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-workerType" : "workerType"}>Worker Type</Label>
          <Select 
            value={getSafeSelectValue(user?.workerType, "")} 
            onValueChange={(value) => onUserChange({...user, workerType: getSafeSelectValue(value, "")})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select worker type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent-clicker">Permanent Clicker</SelectItem>
              <SelectItem value="permanent-viewer">Permanent Viewer</SelectItem>
              <SelectItem value="trainee-clicker">Trainee Clicker</SelectItem>
              <SelectItem value="trainee-viewer">Trainee Viewer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="qc">QC (Quality Control)</SelectItem>
              <SelectItem value="hr">HR (Human Resources)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Status and Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-status" : "status"}>Status</Label>
          <Select 
            value={getSafeSelectValue(user?.status, "trainee")} 
            onValueChange={(value) => onUserChange({...user, status: getSafeSelectValue(value, "trainee")})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trainee">Trainee</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => onUserChange({...user, password: e.target.value})}
              placeholder="Enter password"
            />
          </div>
        )}
      </div>

      {/* Manager Team Selection - Only show when role is manager */}
      {user?.role === "manager" && (
        <div className="border rounded-lg p-3 bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4" />
            <Label className="text-sm font-medium">Assign Team Members</Label>
          </div>
          
          {/* Selected Users as Badges */}
          {selectedUsers.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {getSelectedUserDetails().map((selectedUser) => (
                  <Badge key={selectedUser.id} variant="secondary" className="flex items-center gap-1 pr-1 text-xs">
                    <UserCheck className="h-3 w-3" />
                    <span>{selectedUser.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(selectedUser.id)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Simple Multi-Select Dropdown */}
          <div className="space-y-2">
            <Select onValueChange={(value) => {
              if (value && !selectedUsers.includes(parseInt(value))) {
                handleUserSelection(parseInt(value));
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add team members..." />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {availableUsers
                  .filter(user => !selectedUsers.includes(user.id))
                  .map((availableUser) => (
                    <SelectItem key={availableUser.id} value={availableUser.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{availableUser.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {availableUser.workerType.replace('-', ' ')}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            {selectedUsers.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                Select users from the dropdown above to assign them to this manager.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Default Tasker */}
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-defaultTasker" : "defaultTasker"}>Default Tasker (optional)</Label>
        <Select 
          value={getSafeSelectValue(user?.defaultTasker, "none")} 
          onValueChange={(value) => onUserChange({...user, defaultTasker: getSafeSelectValue(value, "none")})}
        >
          <SelectTrigger>
            <SelectValue placeholder="— none —" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">— none —</SelectItem>
            <SelectItem value="tasker-click">Tasker Click</SelectItem>
            <SelectItem value="tasker-views">Tasker Views</SelectItem>
          </SelectContent>
        </Select>
        {!isEdit && (
          <p className="text-xs text-muted-foreground">
            This can be overridden when creating a link for the worker.
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default UserForm;