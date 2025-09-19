"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UserForm from "../components/UserForm";
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "sonner";

export default function CreateUserPage() {
  const router = useRouter();
  const { addUser } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initial user state
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "worker",
    workerType: "",
    status: "trainee",
    password: "",
    assignedUsers: [],
    defaultTasker: "none"
  });

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
    
    if (!user.password && !user.id) {
      toast.error("Please enter a password");
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
      
      // Add user to the context
      const newUser = addUser(user);
      
      console.log("User created:", newUser);
      
      toast.success("User created successfully!");
      router.push("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/users");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/users")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New User</h1>
            <p className="text-gray-600">
              Add a new user to the system with their role and permissions
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-8">
            <UserForm
              user={user}
              onUserChange={handleUserChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEdit={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
