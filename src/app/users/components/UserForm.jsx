"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const UserForm = ({ 
  user, 
  onUserChange, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}) => {
  // Helper function to ensure Select values are never empty strings
  const getSafeSelectValue = (value, fallback) => {
    if (!value || value === "") {
      return fallback;
    }
    return value;
  };

  return (
    <div className="space-y-4">
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
          </SelectContent>
        </Select>
      </div>
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
