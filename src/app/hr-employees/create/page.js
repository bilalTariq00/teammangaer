"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, UserPlus, Save, X, User, Building, DollarSign, Calendar, Phone, Mail, MapPin, Shield, Award } from "lucide-react";
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "sonner";
import HRLayout from "@/components/layout/HRLayout";

export default function CreateEmployeePage() {
  const router = useRouter();
  const { addUser } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Comprehensive employee state with all HR fields
  const [employee, setEmployee] = useState({
    // Basic Information
    name: "",
    email: "",
    role: "worker",
    workerType: "",
    workCategory: "",
    status: "trainee",
    taskRole: "viewer", // Default task role for workers
    password: "",
    
    // HR-specific fields
    employeeId: "",
    department: "Operations",
    position: "",
    salary: 0,
    joinDate: new Date().toISOString().split('T')[0],
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
    defaultTasker: "none",
    vacationDay: "Monday"
  });

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
    
    if (!employee.password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    if (!employee.workerType) {
      toast.error("Please select an employment type (Permanent or Trainee)");
      return;
    }

    // Validate taskRole for workers
    if (employee.role === "worker" && !employee.taskRole) {
      toast.error("Please select a task role for the worker");
      return;
    }

    if (!employee.salary || employee.salary <= 0) {
      toast.error("Please enter a valid salary amount");
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
      // Get auth token from localStorage
      const token = localStorage.getItem("token");
      console.log('🔍 Token from localStorage:', token ? token.substring(0, 50) + '...' : 'null');
      if (!token) {
        toast.error("Please log in to create employees");
        router.push("/login");
        return;
      }

      // Prepare employee data for API
      const employeeData = {
        ...employee,
        // Ensure role is set correctly
        role: employee.role === "worker" ? "user" : employee.role,
        // Set status based on workerType
        status: employee.workerType === "trainee" ? "trainee" : "permanent"
      };

      // Call the HR employee creation API
      console.log('🔍 Making API call with token:', `Bearer ${token.substring(0, 50)}...`);
      const response = await fetch('/api/hr/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("Employee created:", result.data);
        toast.success("Employee created successfully!");
        router.push("/hr-employees");
      } else {
        console.error("API Error:", result.error);
        toast.error(result.error || "Failed to create employee. Please try again.");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/hr-employees");
  };

  return (
    <HRLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/hr-employees")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Employees
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Employee</h1>
              <p className="text-gray-600">
                Add a new employee to the system with comprehensive information
              </p>
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
                          <SelectItem value="worker">Worker</SelectItem>
                          <SelectItem value="qc">QC (Quality Control)</SelectItem>
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
                  
                  {/* Task Role - Only show for workers */}
                  {employee.role === 'worker' && (
                    <div className="space-y-2">
                      <Label htmlFor="taskRole" className="text-sm font-medium text-gray-700">
                        Task Role <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.taskRole} 
                        onValueChange={(value) => handleEmployeeChange("taskRole", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select task role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer - Can only view tasks</SelectItem>
                          <SelectItem value="clicker">Clicker - Can perform click tasks</SelectItem>
                          <SelectItem value="both">Both - Can view and perform tasks</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Choose the worker's task capabilities
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={employee.password}
                      onChange={(e) => handleEmployeeChange("password", e.target.value)}
                      placeholder="Enter password"
                      className="h-10"
                    />
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
                        placeholder="Auto-generated if empty"
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
                        Salary <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="salary"
                          type="number"
                          min="0"
                          step="100"
                          value={employee.salary}
                          onChange={(e) => handleEmployeeChange("salary", parseInt(e.target.value) || 0)}
                          placeholder="Enter monthly salary"
                          className="h-10 pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Monthly salary in USD</p>
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
                      <Label htmlFor="vacationDay" className="text-sm font-medium text-gray-700">
                        Vacation Day <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.vacationDay} 
                        onValueChange={(value) => handleEmployeeChange("vacationDay", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select vacation day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monday">Monday</SelectItem>
                          <SelectItem value="Tuesday">Tuesday</SelectItem>
                          <SelectItem value="Wednesday">Wednesday</SelectItem>
                          <SelectItem value="Thursday">Thursday</SelectItem>
                          <SelectItem value="Friday">Friday</SelectItem>
                          <SelectItem value="Saturday">Saturday</SelectItem>
                          <SelectItem value="Sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Select the day of the week for this employee&apos;s vacation</p>
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
                    {isSubmitting ? "Creating..." : "Create Employee"}
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
                  <CardTitle className="text-lg">Employee Preview</CardTitle>
                  <CardDescription>
                    Review the employee information
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
                      <span className="font-medium text-gray-600">Worker Type:</span>
                      <p className="text-gray-900 capitalize">
                        {employee.workerType && employee.workCategory 
                          ? `${employee.workerType} ${employee.workCategory}` 
                          : employee.workerType || "—"}
                      </p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Department:</span>
                      <p className="text-gray-900">{employee.department || "—"}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Salary:</span>
                      <p className="text-gray-900 font-semibold text-green-600">
                        {employee.salary > 0 ? `$${employee.salary.toLocaleString()}/month` : "—"}
                      </p>
                    </div>
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
                    <p>• <strong>HR can only create:</strong> Workers and QC</p>
                    <p>• <strong>Employment Type:</strong> Permanent or Trainee only</p>
                    <p>• <strong>Salary:</strong> Required field - enter monthly salary in USD</p>
                    <p>• <strong>Employee ID</strong> will be auto-generated if empty</p>
                    <p>• <strong>Daily target</strong> should be a positive number (tasks/goals per day)</p>
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
