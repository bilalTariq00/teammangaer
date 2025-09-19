"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Save, X } from "lucide-react";
import UserForm from "../../components/UserForm";
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "sonner";
import UserManagementLayout from "@/components/layout/UserManagementLayout";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id);
  const { getUserById, updateUser } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the user to edit
  const [user, setUser] = useState(null);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundUser = getUserById(userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          toast.error("User not found");
          router.push("/users");
        }
      } catch (error) {
        console.error("Error loading user:", error);
        toast.error("Failed to load user data");
        router.push("/users");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId, router, getUserById]);

  // Handle user data changes
  const handleUserChange = (updatedUser) => {
    setUser(updatedUser);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!user.name.trim()) {
      toast.error("Please enter a full name");
      return;
    }
    
    if (!user.email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in the context
      updateUser(userId, user);
      
      console.log("User updated:", user);
      
      toast.success("User updated successfully!");
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/users");
  };

  if (isLoading) {
    return (
      <UserManagementLayout>
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      </UserManagementLayout>
    );
  }

  if (!user) {
    return (
      <UserManagementLayout>
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">User not found</p>
            <Button onClick={() => router.push("/users")} className="mt-4">
              Back to Users
            </Button>
          </div>
        </div>
      </UserManagementLayout>
    );
  }

  return (
    <UserManagementLayout>
      <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/users")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600 mt-1">
                Update user information and permissions
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
                <CardDescription>
                  Update the details for this user account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm
                  user={user}
                  onUserChange={handleUserChange}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isEdit={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Updating..." : "Update User"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* User Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Details</CardTitle>
                <CardDescription>
                  Review the current user information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900">{user.name || "—"}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{user.email || "—"}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600">Role:</span>
                    <p className="text-gray-900 capitalize">{user.role || "—"}</p>
                  </div>
                  
                  {user.workerType && (
                    <div>
                      <span className="font-medium text-gray-600">Worker Type:</span>
                      <p className="text-gray-900 capitalize">
                        {user.workerType.replace('-', ' ')}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <p className="text-gray-900 capitalize">{user.status || "—"}</p>
                  </div>

                  {user.role === "manager" && user.assignedUsers?.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">Team Members:</span>
                      <p className="text-gray-900">{user.assignedUsers.length} assigned</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• <strong>Admin:</strong> Full system access</p>
                  <p>• <strong>Manager:</strong> Can assign team members</p>
                  <p>• <strong>Worker:</strong> Basic user access</p>
                  <p>• <strong>QC/HR:</strong> Specialized roles</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </UserManagementLayout>
  );
}
