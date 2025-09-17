"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const UserFilters = ({ 
  searchTerm, 
  onSearchChange, 
  pageSize, 
  onPageSizeChange,
  statusFilter,
  onStatusFilterChange
}) => {
  // Helper function to ensure Select values are never empty strings
  const getSafeSelectValue = (value, fallback) => {
    if (!value || value === "") {
      return fallback;
    }
    return value;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="status-filter">Status</Label>
        <Select 
          value={getSafeSelectValue(statusFilter, "all")} 
          onValueChange={(value) => onStatusFilterChange(getSafeSelectValue(value, "all"))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
            <SelectItem value="trainee">Trainee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="page-size">Show</Label>
        <Select 
          value={getSafeSelectValue(pageSize, "100")} 
          onValueChange={(value) => onPageSizeChange(getSafeSelectValue(value, "100"))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserFilters;
