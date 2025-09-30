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
import { toast } from "sonner";
import HRLayout from "@/components/layout/HRLayout";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  
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
    defaultTasker: "none",
    vacationDay: "Monday"
  });

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load employee data from backend API
  useEffect(() => {
    if (!isClient || !employeeId) return;
    
    const loadEmployee = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to edit employee details");
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/hr/employees/${employeeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        
        if (result.success) {
          setEmployee(result.data);
        } else {
          setError(result.error || 'Failed to load employee');
          toast.error(result.error || 'Failed to load employee');
          if (result.error === 'Employee not found') {
            router.push("/hr-employees");
          }
        }
      } catch (error) {
        console.error("Error loading employee:", error);
        setError('Failed to load employee data');
        toast.error("Failed to load employee data");
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId, router, isClient]);

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
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to update employee details");
        router.push("/login");
        return;
      }

      // Set final worker type based on role and employment type
      let finalWorkerType = employee.workerType;
      if (employee.role === "worker") {
        finalWorkerType = `${employee.workerType}-worker`;
      }
      
      const updateData = {
        ...employee,
        workerType: finalWorkerType
      };

      const response = await fetch(`/api/hr/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Employee updated successfully!");
        router.push("/hr-employees");
      } else {
        toast.error(result.error || 'Failed to update employee');
      }
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

  if (error) {
    return (
      <HRLayout>
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Employee</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/hr-employees")} className="mt-4">
              Back to Employees
            </Button>
          </div>
        </div>
      </HRLayout>
    );
  }

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
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Essential employee details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-800">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={employee.name}
                        onChange={(e) => handleEmployeeChange("name", e.target.value)}
                        placeholder="Enter employee&apos;s full name"
                        className="h-11 border-2 focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500">Employee&apos;s complete legal name</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-800">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={employee.email}
                        onChange={(e) => handleEmployeeChange("email", e.target.value)}
                        placeholder="employee@company.com"
                        className="h-11 border-2 focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500">Primary contact email address</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-semibold text-gray-800">
                        Job Role <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.role} 
                        onValueChange={(value) => handleEmployeeChange("role", value)}
                      >
                        <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Select job role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="qc">QC (Quality Control)</SelectItem>
                          <SelectItem value="worker">Worker</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Employee&apos;s primary job function</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workerType" className="text-sm font-semibold text-gray-800">
                        Employment Type <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.workerType} 
                        onValueChange={(value) => handleEmployeeChange("workerType", value)}
                      >
                        <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="permanent">Permanent Employee</SelectItem>
                          <SelectItem value="trainee">Trainee</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Type of employment contract</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-semibold text-gray-800">
                        Employment Status <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={employee.status} 
                        onValueChange={(value) => handleEmployeeChange("status", value)}
                      >
                        <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trainee">Trainee</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Current employment status</p>
                    </div>
                    
                    {/* Task Role - Only show for workers */}
                    {employee.role === 'worker' && (
                      <div className="space-y-2">
                        <Label htmlFor="taskRole" className="text-sm font-semibold text-gray-800">
                          Task Role <span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          value={employee.taskRole || 'viewer'} 
                          onValueChange={(value) => handleEmployeeChange("taskRole", value)}
                        >
                          <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder="Select task role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer - Can only view tasks</SelectItem>
                            <SelectItem value="clicker">Clicker - Can perform click tasks</SelectItem>
                            <SelectItem value="both">Both - Can view and perform tasks</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Worker&apos;s task capabilities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* HR Information */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="bg-green-50/50">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Building className="h-5 w-5" />
                    HR Information
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Work-related details, compensation, and organizational information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-sm font-semibold text-gray-800">
                        Employee ID
                      </Label>
                      <Input
                        id="employeeId"
                        value={employee.employeeId}
                        onChange={(e) => handleEmployeeChange("employeeId", e.target.value)}
                        placeholder="EMP-001234"
                        className="h-11 border-2 focus:border-green-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500">Unique employee identifier</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-semibold text-gray-800">
                        Department
                      </Label>
                      <Select 
                        value={employee.department} 
                        onValueChange={(value) => handleEmployeeChange("department", value)}
                      >
                        <SelectTrigger className="h-11 border-2 focus:border-green-500 transition-colors">
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
                      <p className="text-xs text-gray-500">Employee&apos;s organizational department</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-semibold text-gray-800">
                        Job Position
                      </Label>
                      <Input
                        id="position"
                        value={employee.position}
                        onChange={(e) => handleEmployeeChange("position", e.target.value)}
                        placeholder="e.g., Senior Worker, QC Specialist"
                        className="h-11 border-2 focus:border-green-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500">Employee&apos;s job title or position</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate" className="text-sm font-semibold text-gray-800">
                        Join Date
                      </Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={employee.joinDate}
                        onChange={(e) => handleEmployeeChange("joinDate", e.target.value)}
                        className="h-11 border-2 focus:border-green-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500">Date employee joined the company</p>
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