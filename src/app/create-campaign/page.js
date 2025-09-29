"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, Plus, Target, Search, X, Users, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock worker data for selection
const mockWorkers = [
  { id: 1, name: "Muhammad Shahood", email: "muhammad.shahood@joyapps.net", type: "permanent", role: "viewer" },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "permanent", role: "viewer" },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "permanent", role: "viewer" },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "permanent", role: "clicker" },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "permanent", role: "clicker" },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "permanent", role: "clicker" },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "trainee", role: "viewer" },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "trainee", role: "clicker" },
  { id: 9, name: "Mike Chen", email: "mike.chen@joyapps.net", type: "trainee", role: "clicker" },
  { id: 10, name: "David Kim", email: "david.kim@joyapps.net", type: "trainee", role: "clicker" },
];

// Mock manager data
const mockManagers = [
  { id: 101, name: "John Manager", email: "john.manager@joyapps.net", type: "manager", role: "manager" },
  { id: 102, name: "Jane Supervisor", email: "jane.supervisor@joyapps.net", type: "manager", role: "manager" },
  { id: 103, name: "Mike Director", email: "mike.director@joyapps.net", type: "manager", role: "manager" },
  { id: 104, name: "Sarah Lead", email: "sarah.lead@joyapps.net", type: "manager", role: "manager" },
];

// Combined users data
const allUsers = [...mockWorkers, ...mockManagers];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    destinationLink: "",
    status: "active",
    assignedUsers: []
  });

  // Assignment state
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all"); // "all", "workers", "managers"

  const handleInputChange = (field, value) => {
    setNewCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter users based on search and type
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = userTypeFilter === "all" || 
                       (userTypeFilter === "workers" && user.type !== "manager") ||
                       (userTypeFilter === "managers" && user.type === "manager");
    
    return matchesSearch && matchesType;
  });

  // Handle user assignment
  const handleUserAssignment = (userId, assigned) => {
    setNewCampaign(prev => ({
      ...prev,
      assignedUsers: assigned
        ? [...prev.assignedUsers, userId]
        : prev.assignedUsers.filter(id => id !== userId)
    }));
  };

  // Remove user from assignment
  const handleRemoveUser = (userId) => {
    setNewCampaign(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.filter(id => id !== userId)
    }));
  };

  // Get assigned users data
  const getAssignedUsers = () => {
    return allUsers.filter(user => newCampaign.assignedUsers.includes(user.id));
  };

  const handleCreateCampaign = () => {
    // Here you would typically send the data to your API
    console.log("Creating campaign:", newCampaign);
    
    // For now, just redirect back to campaigns
    router.push("/campaigns");
  };

  const handleBackToCampaigns = () => {
    router.push("/campaigns");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Button and Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToCampaigns}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Campaign</h1>
            <p className="text-muted-foreground">Set up a new marketing campaign</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Enter the basic information for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="Enter campaign name"
                  value={newCampaign.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter campaign description"
                  value={newCampaign.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination-link">Destination Link</Label>
                <Input
                  id="destination-link"
                  type="url"
                  placeholder="https://example.com"
                  value={newCampaign.destinationLink}
                  onChange={(e) => handleInputChange("destinationLink", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The URL where users will be redirected when they click on the campaign
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newCampaign.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* User Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assign Users</CardTitle>
              <CardDescription>Assign workers and managers to this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assigned Users Badges */}
              {getAssignedUsers().length > 0 && (
                <div className="space-y-2">
                  <Label>Assigned Users</Label>
                  <div className="flex flex-wrap gap-2">
                    {getAssignedUsers().map((user) => (
                      <Badge
                        key={user.id}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <span className="text-xs">
                          {user.type === "manager" ? "👔" : "👷"} {user.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                  ))}
                </div>
              </div>
              )}

              {/* User Type Filter */}
                <div className="space-y-2">
                <Label>Filter by User Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={userTypeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserTypeFilter("all")}
                  >
                    All Users
                  </Button>
                  <Button
                    variant={userTypeFilter === "workers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserTypeFilter("workers")}
                  >
                    Workers
                  </Button>
                  <Button
                    variant={userTypeFilter === "managers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserTypeFilter("managers")}
                  >
                    Managers
                  </Button>
                </div>
              </div>

              {/* Search and User List */}
                <div className="space-y-2">
                <Label>Search Users</Label>
                <Command className="border rounded-md">
                  <CommandInput
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList className="max-h-64">
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {filteredUsers.map((user) => {
                        const isAssigned = newCampaign.assignedUsers.includes(user.id);
                        return (
                          <CommandItem
                            key={user.id}
                            onSelect={() => handleUserAssignment(user.id, !isAssigned)}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                {user.type === "manager" ? "👔" : "👷"}
                    </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {user.type} {user.role && `• ${user.role}`}
                </div>
              </div>
                    </div>
                            <div className="flex items-center gap-2">
                              {isAssigned ? (
                                <Badge variant="default" className="text-xs">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Assigned
                                </Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUserAssignment(user.id, true);
                                  }}
                                >
                                  Assign
                                </Button>
                              )}
                </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
          <Button variant="outline" onClick={handleBackToCampaigns}>
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
