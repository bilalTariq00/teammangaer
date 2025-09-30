"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, UserCheck, X, Search, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const UserForm = ({ 
  user, 
  onUserChange, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}) => {
  const { user: currentUser } = useAuth();
  // State for available workers from database
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(user?.assignedUsers || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserList, setShowUserList] = useState(false);

  // Helper function to ensure Select values are never empty strings
  const getSafeSelectValue = (value, fallback) => {
    if (!value || value === "") {
      return fallback;
    }
    return value;
  };

  // Function to fetch workers from database
  const fetchWorkers = async () => {
    try {
      setIsLoadingWorkers(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to fetch workers");
        return;
      }

      // Use appropriate endpoint based on current user role
      const endpoint = currentUser?.role === 'admin' ? '/api/users' : '/api/hr/employees';
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Filter to only show workers (role: 'user') and exclude admins, managers, hr, qc
        const workers = result.data.filter(u => u.role === 'user');
        setAvailableUsers(workers);
      } else {
        toast.error(result.error || 'Failed to fetch workers');
        setAvailableUsers([]);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
      toast.error("Failed to fetch workers");
      setAvailableUsers([]);
    } finally {
      setIsLoadingWorkers(false);
    }
  };

  // Fetch workers when role changes to manager
  useEffect(() => {
    if (user?.role === 'manager') {
      fetchWorkers();
    } else {
      setAvailableUsers([]);
    }
  }, [user?.role]);

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

  // Filter users based on search term
  const getFilteredUsers = () => {
    return availableUsers.filter(user => 
      !selectedUsers.includes(user.id) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Handle adding multiple users at once
  const handleAddMultipleUsers = (userIds) => {
    const newSelectedUsers = [...selectedUsers, ...userIds];
    setSelectedUsers(newSelectedUsers);
    onUserChange({...user, assignedUsers: newSelectedUsers});
  };

  // Handle removing multiple users
  const handleRemoveMultipleUsers = (userIds) => {
    const newSelectedUsers = selectedUsers.filter(id => !userIds.includes(id));
    setSelectedUsers(newSelectedUsers);
    onUserChange({...user, assignedUsers: newSelectedUsers});
  };

  // Select all filtered users
  const handleSelectAll = () => {
    const filteredUserIds = getFilteredUsers().map(user => user.id);
    handleAddMultipleUsers(filteredUserIds);
  };

  // Deselect all filtered users
  const handleDeselectAll = () => {
    const filteredUserIds = getFilteredUsers().map(user => user.id);
    handleRemoveMultipleUsers(filteredUserIds);
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          {/* <div className="w-2 h-2 bg-blue-500 rounded-full"></div> */}
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={isEdit ? "edit-name" : "name"} className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={isEdit ? "edit-name" : "name"}
              value={user.name}
              onChange={(e) => onUserChange({...user, name: e.target.value})}
              placeholder="Enter full name"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={isEdit ? "edit-email" : "email"} className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id={isEdit ? "edit-email" : "email"}
              type="email"
              value={user.email}
              onChange={(e) => onUserChange({...user, email: e.target.value})}
              placeholder="Enter email address"
              className="h-10"
            />
          </div>
        </div>
      </div>
      
      {/* Role and Permissions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
          <h3 className="text-lg font-semibold text-gray-900">Role & Permissions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={isEdit ? "edit-role" : "role"} className="text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={getSafeSelectValue(user?.role, "user")} 
              onValueChange={(value) => {
                const newRole = getSafeSelectValue(value, "user");
                // Reset workerType when role changes
                let newWorkerType = "";
                if (newRole === "user") {
                  newWorkerType = "permanent"; // Default for workers
                } else if (newRole === "manager") {
                  newWorkerType = "manager";
                } else if (newRole === "qc") {
                  newWorkerType = "qc";
                } else if (newRole === "hr") {
                  newWorkerType = "hr";
                } else if (newRole === "admin") {
                  newWorkerType = "admin";
                }
                onUserChange({...user, role: newRole, workerType: newWorkerType});
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {currentUser?.role === 'admin' && (
                  <>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR (Human Resources)</SelectItem>
                  </>
                )}
                {(currentUser?.role === 'admin' || currentUser?.role === 'hr') && (
                  <>
                    <SelectItem value="qc">QC (Quality Control)</SelectItem>
                    <SelectItem value="user">Worker</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Worker Type - Show only for workers */}
          {user?.role === "user" && (
            <div className="space-y-2">
              <Label htmlFor={isEdit ? "edit-workerType" : "workerType"} className="text-sm font-medium text-gray-700">
                Worker Type <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={getSafeSelectValue(user?.workerType, "permanent")} 
                onValueChange={(value) => onUserChange({...user, workerType: getSafeSelectValue(value, "permanent")})}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select worker type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent Worker</SelectItem>
                  <SelectItem value="trainee">Trainee Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Role Type - Show for non-worker roles */}
          {user?.role && user?.role !== "user" && (
            <div className="space-y-2">
              <Label htmlFor={isEdit ? "edit-workerType" : "workerType"} className="text-sm font-medium text-gray-700">
                Role Type
              </Label>
              <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                <span className="text-sm text-gray-600 capitalize">
                  {user?.role === "admin" && "Admin"}
                  {user?.role === "manager" && "Manager"}
                  {user?.role === "qc" && "Quality Control"}
                  {user?.role === "hr" && "Human Resources"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Task Role (Viewer/Clicker/Both) - only for Worker role */}
        {user?.role === "user" && (
          <div className="space-y-2">
            <Label htmlFor={isEdit ? "edit-taskRole" : "taskRole"} className="text-sm font-medium text-gray-700">
              Task Role
            </Label>
            <Select 
              value={getSafeSelectValue(user?.taskRole, "viewer")} 
              onValueChange={(value) => onUserChange({...user, taskRole: getSafeSelectValue(value, "viewer")})}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select task role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="clicker">Clicker</SelectItem>
                <SelectItem value="both">Both (Viewer + Clicker)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {/* Account Status Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          {/* <div className="w-2 h-2 bg-orange-500 rounded-full"></div> */}
          <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={isEdit ? "edit-status" : "status"} className="text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={getSafeSelectValue(user?.status, "trainee")} 
              onValueChange={(value) => onUserChange({...user, status: getSafeSelectValue(value, "trainee")})}
            >
              <SelectTrigger className="h-10">
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
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => onUserChange({...user, password: e.target.value})}
                placeholder="Enter password"
                className="h-10"
              />
            </div>
          )}
        </div>
      </div>

      {/* Manager Team Selection - Only show when role is manager */}
      {user?.role === "manager" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            {/* <div className="w-2 h-2 bg-purple-500 rounded-full"></div> */}
            <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-purple-600" />
              <Label className="text-sm font-medium text-gray-700">Assign Team Members</Label>
            </div>
          
            {/* Selected Users as Badges */}
            {selectedUsers.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Selected ({selectedUsers.length})
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUsers([]);
                      onUserChange({...user, assignedUsers: []});
                    }}
                    className="text-xs"
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </div>
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

            {/* Search and Add Users */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search workers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                    disabled={isLoadingWorkers}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUserList(!showUserList)}
                  className="h-10"
                  disabled={isLoadingWorkers}
                >
                  {isLoadingWorkers ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `${showUserList ? "Hide" : "Show"} List`
                  )}
                </Button>
              </div>

              {/* User List with Checkboxes */}
              {showUserList && (
                <div className="border rounded-lg bg-white max-h-64 overflow-y-auto">
                  <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {isLoadingWorkers ? (
                        "Loading workers..."
                      ) : (
                        `Available Workers (${getFilteredUsers().length})`
                      )}
                    </span>
                    {!isLoadingWorkers && (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAll}
                          disabled={getFilteredUsers().length === 0}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDeselectAll}
                          disabled={getFilteredUsers().length === 0}
                          className="text-xs"
                        >
                          <Minus className="h-3 w-3 mr-1" />
                          Deselect All
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isLoadingWorkers ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Loading workers from database...</p>
                    </div>
                  ) : getFilteredUsers().length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      {searchTerm ? "No workers found matching your search." : "No workers available to assign."}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {getFilteredUsers().map((availableUser) => (
                        <div key={availableUser.id} className="p-3 hover:bg-gray-50 flex items-center space-x-3">
                          <Checkbox
                            id={`user-${availableUser.id}`}
                            checked={selectedUsers.includes(availableUser.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleUserSelection(availableUser.id);
                              } else {
                                handleRemoveUser(availableUser.id);
                              }
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {availableUser.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {availableUser.workerType || 'permanent'}
                              </Badge>
                              <Badge 
                                variant={availableUser.status === 'permanent' ? 'default' : 'secondary'} 
                                className="text-xs"
                              >
                                {availableUser.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{availableUser.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedUsers.length === 0 && !showUserList && !isLoadingWorkers && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Click "Show List" to view available workers from the database.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Default Tasker Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          {/* <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> */}
          <h3 className="text-lg font-semibold text-gray-900">Task Assignment</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-defaultTasker" : "defaultTasker"} className="text-sm font-medium text-gray-700">
            Default Tasker
          </Label>
          <Select 
            value={getSafeSelectValue(user?.defaultTasker, "none")} 
            onValueChange={(value) => onUserChange({...user, defaultTasker: getSafeSelectValue(value, "none")})}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="— none —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— none —</SelectItem>
              {/* Align with taskRole semantics */}
              <SelectItem value="tasker-click">Tasker Click</SelectItem>
              <SelectItem value="tasker-views">Tasker Views</SelectItem>
            </SelectContent>
          </Select>
          {!isEdit && (
            <p className="text-xs text-gray-500">
              This can be overridden when creating a link for the worker.
            </p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel} className="px-8">
          Cancel
        </Button>
        <Button onClick={onSubmit} className="px-8">
          {isEdit ? "Update User" : "Create User"}
        </Button>
      </div>
    </div>
  );
};

export default UserForm;