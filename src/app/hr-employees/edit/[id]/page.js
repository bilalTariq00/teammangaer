"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Save, X, Building, DollarSign, Calendar, Phone, Mail, MapPin, Shield, Award } from "lucide-react";
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "sonner";
import HRLayout from "@/components/layout/HRLayout";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id ? parseInt(params.id) : null;
  
  // Always call hooks unconditionally
  const usersContext = useUsers();
  const getUserById = usersContext?.getUserById;
  const updateUser = usersContext?.updateUser;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Comprehensive employee state with all HR fields
  const [employee, setEmployee] = useState({
    // Basic Information
    name: "",
    email: "",
    role: "worker",
    workerType: "",
    status: "trainee",
    
    // HR-specific fields
    employeeId: "",
    department: "Operations",
    position: "",
    salary: 0,
    joinDate: "",
    target: 0,
    attendance: 0,
    lastReview: "",
    
    // Contact Information
    phoneNumber: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    contactNumber: "",
    emergencyNumber: "",
    
    // Personal Information
    dateOfBirth: "",
    socialSecurityNumber: "",
    
    // Financial Information
    bankAccount: "",
    benefits: "",
    
    // Additional Information
    notes: "",
    assignedUsers: [],
    defaultTasker: "none"
  });

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load employee data
  useEffect(() => {
    if (!isClient) return;
    const loadEmployee = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Safety check for getUserById function
        if (!getUserById || typeof getUserById !== 'function') {
          console.error('getUserById function not available');
          toast.error("Unable to load employee data");
          router.push("/hr-employees");
          return;
        }
        
        const foundUser = getUserById(employeeId);
        if (foundUser) {
          // Convert user to employee with all HR fields
          const employeeData = {
            ...foundUser,
            // Ensure all HR fields exist
            employeeId: foundUser.employeeId || `EMP${foundUser.id.toString().padStart(4, '0')}`,
            department: foundUser.department || "Operations",
            position: foundUser.position || foundUser.workerType?.replace('-', ' ') || "Worker",
            workerType: foundUser.workerType?.includes('-') ? foundUser.workerType.split('-')[0] : foundUser.workerType,
            salary: foundUser.salary || 0,
            joinDate: foundUser.joinDate || foundUser.created || new Date().toISOString().split('T')[0],
            target: foundUser.target || 0,
            attendance: foundUser.attendance || 0,
            lastReview: foundUser.lastReview || "",
            phoneNumber: foundUser.phoneNumber || "",
            address: foundUser.address || "",
            emergencyContact: foundUser.emergencyContact || "",
            emergencyPhone: foundUser.emergencyPhone || "",
            contactNumber: foundUser.contactNumber || "",
            emergencyNumber: foundUser.emergencyNumber || "",
            dateOfBirth: foundUser.dateOfBirth || "",
            socialSecurityNumber: foundUser.socialSecurityNumber || "",
            bankAccount: foundUser.bankAccount || "",
            benefits: foundUser.benefits || "",
            notes: foundUser.notes || "",
            assignedUsers: foundUser.assignedUsers || [],
            defaultTasker: foundUser.defaultTasker || "none"
          };
          setEmployee(employeeData);
        } else {
          toast.error("Employee not found");
          router.push("/hr-employees");
        }
      } catch (error) {
        console.error("Error loading employee:", error);
        toast.error("Failed to load employee data");
        router.push("/hr-employees");
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId && getUserById) {
      loadEmployee();
    } else if (!employeeId) {
      console.error('Invalid employee ID');
      toast.error("Invalid employee ID");
      router.push("/hr-employees");
    } else if (!getUserById) {
      console.error('Context not available');
      toast.error("Unable to access employee data");
      router.push("/hr-employees");
    }
  }, [employeeId, router, getUserById, isClient]);

  // Handle employee data changes
  const handleEmployeeChange = (field, value) => {
    setEmployee(prev => {
      const newEmployee = {
        ...prev,
        [field]: value
      };
      
      // If workerType changes, update status accordingly
      if (field === 'workerType') {
        newEmployee.status = value; // permanent or trainee
      }
      
      return newEmployee;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!employee.name.trim()) {
      toast.error("Please enter a full name");
      return;
    }
    
    if (!employee.email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set final worker type based on role and employment type
      let finalWorkerType = employee.workerType;
      if (employee.role === "worker") {
        finalWorkerType = `${employee.workerType}-worker`;
      }
      
      // Update employee in the context
      updateUser(employeeId, {
        ...employee,
        workerType: finalWorkerType
      });
      
      console.log("Employee updated:", employee);
      
      toast.success("Employee updated successfully!");
      router.push("/hr-employees");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/hr-employees");
  };

  if (!isClient || isLoading) {
    return (
      <HRLayout>
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{!isClient ? 'Loading...' : 'Loading employee data...'}</p>
          </div>
        </div>
      </HRLayout>
    );
  }

  if (!employee.name) {
    return (
      <HRLayout>
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Employee not found</p>
            <Button onClick={() => router.push("/hr-employees")} className="mt-4">
              Back to Employees
            </Button>
          </div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/hr-employees")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Employees
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Employee: {employee.name}</h1>
                <p className="text-gray-600 mt-1">
                  Update employee information and permissions
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Essential employee details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={employee.name}
                        onChange={(e) => handleEmployeeChange("name", e.target.value)}
                        placeholder="Enter full name"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={employee.email}
                        onChange={(e) => handleEmployeeChange("email", e.target.value)}
                        placeholder="Enter email address"
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                        Role <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.role} 
                        onValueChange={(value) => handleEmployeeChange("role", value)}
                      >
                        <SelectTrigger className="h-10">
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
                      <Label htmlFor="workerType" className="text-sm font-medium text-gray-700">
                        Employment Type <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.workerType} 
                        onValueChange={(value) => handleEmployeeChange("workerType", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="trainee">Trainee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.status} 
                        onValueChange={(value) => handleEmployeeChange("status", value)}
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
                  </div>
                </CardContent>
              </Card>

              {/* HR Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    HR Information
                  </CardTitle>
                  <CardDescription>Department, position, and employment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                        Employee ID
                      </Label>
                      <Input
                        id="employeeId"
                        value={employee.employeeId}
                        onChange={(e) => handleEmployeeChange("employeeId", e.target.value)}
                        placeholder="Employee ID"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                        Department
                      </Label>
                      <Select 
                        value={employee.department} 
                        onValueChange={(value) => handleEmployeeChange("department", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Human Resources">Human Resources</SelectItem>
                          <SelectItem value="Quality Control">Quality Control</SelectItem>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                        Position
                      </Label>
                      <Input
                        id="position"
                        value={employee.position}
                        onChange={(e) => handleEmployeeChange("position", e.target.value)}
                        placeholder="Enter position title"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate" className="text-sm font-medium text-gray-700">
                        Join Date
                      </Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={employee.joinDate}
                        onChange={(e) => handleEmployeeChange("joinDate", e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                        Salary
                      </Label>
                      <Input
                        id="salary"
                        type="number"
                        value={employee.salary}
                        onChange={(e) => handleEmployeeChange("salary", parseInt(e.target.value) || 0)}
                        placeholder="Enter salary"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target" className="text-sm font-medium text-gray-700">
                        Daily Target
                      </Label>
                      <Input
                        id="target"
                        type="number"
                        min="0"
                        value={employee.target}
                        onChange={(e) => handleEmployeeChange("target", parseInt(e.target.value) || 0)}
                        placeholder="Enter daily target"
                        className="h-10"
                      />
                      <p className="text-xs text-gray-500">Daily tasks or goals to achieve</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>Phone numbers and address details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        value={employee.phoneNumber}
                        onChange={(e) => handleEmployeeChange("phoneNumber", e.target.value)}
                        placeholder="Enter phone number"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                        Contact Number (Personal)
                      </Label>
                      <Input
                        id="contactNumber"
                        value={employee.contactNumber}
                        onChange={(e) => handleEmployeeChange("contactNumber", e.target.value)}
                        placeholder="Enter personal contact"
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={employee.address}
                      onChange={(e) => handleEmployeeChange("address", e.target.value)}
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={employee.emergencyContact}
                        onChange={(e) => handleEmployeeChange("emergencyContact", e.target.value)}
                        placeholder="Emergency contact name"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-sm font-medium text-gray-700">
                        Emergency Phone
                      </Label>
                      <Input
                        id="emergencyPhone"
                        value={employee.emergencyPhone}
                        onChange={(e) => handleEmployeeChange("emergencyPhone", e.target.value)}
                        placeholder="Emergency contact phone"
                        className="h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Sensitive personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={employee.dateOfBirth}
                        onChange={(e) => handleEmployeeChange("dateOfBirth", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialSecurityNumber" className="text-sm font-medium text-gray-700">
                        Social Security Number
                      </Label>
                      <Input
                        id="socialSecurityNumber"
                        value={employee.socialSecurityNumber}
                        onChange={(e) => handleEmployeeChange("socialSecurityNumber", e.target.value)}
                        placeholder="XXX-XX-XXXX"
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount" className="text-sm font-medium text-gray-700">
                        Bank Account
                      </Label>
                      <Input
                        id="bankAccount"
                        value={employee.bankAccount}
                        onChange={(e) => handleEmployeeChange("bankAccount", e.target.value)}
                        placeholder="Bank account details"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="benefits" className="text-sm font-medium text-gray-700">
                        Benefits
                      </Label>
                      <Input
                        id="benefits"
                        value={employee.benefits}
                        onChange={(e) => handleEmployeeChange("benefits", e.target.value)}
                        placeholder="Health, Dental, etc."
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={employee.notes}
                      onChange={(e) => handleEmployeeChange("notes", e.target.value)}
                      placeholder="Additional notes about the employee"
                      rows={3}
                    />
                  </div>
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
                    {isSubmitting ? "Updating..." : "Update Employee"}
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

              {/* Employee Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Details</CardTitle>
                  <CardDescription>
                    Review the current employee information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <p className="text-gray-900">{employee.name || "—"}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="text-gray-900">{employee.email || "—"}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Role:</span>
                      <p className="text-gray-900 capitalize">{employee.role || "—"}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Department:</span>
                      <p className="text-gray-900">{employee.department || "—"}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className="text-gray-900 capitalize">{employee.status || "—"}</p>
                    </div>
                    
                    {employee.salary > 0 && (
                      <div>
                        <span className="font-medium text-gray-600">Salary:</span>
                        <p className="text-gray-900">${employee.salary.toLocaleString()}</p>
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
                    <p>• <strong>Required fields</strong> are marked with *</p>
                    <p>• <strong>Daily target</strong> should be a positive number (tasks/goals per day)</p>
                    <p>• <strong>Personal information</strong> is kept secure</p>
                    <p>• <strong>Changes are saved</strong> in real-time</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
