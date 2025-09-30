"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Edit, 
  Building, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Award,
  Users,
  Clock,
  TrendingUp,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import HRLayout from "@/components/layout/HRLayout";

export default function ViewEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  
  // Comprehensive employee state with all HR fields
  const [employee, setEmployee] = useState(null);

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
          toast.error("Please log in to view employee details");
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

  const handleEditEmployee = () => {
    router.push(`/hr-employees/edit/${employeeId}`);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "permanent": return "default";
      case "trainee": return "secondary";
      case "terminated": return "destructive";
      case "blocked": return "outline";
      default: return "secondary";
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin": return "destructive";
      case "manager": return "default";
      case "hr": return "secondary";
      case "qc": return "outline";
      case "worker": return "secondary";
      default: return "outline";
    }
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

  if (!employee) {
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
                  <p className="text-gray-600">{employee.position} • {employee.department}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getRoleBadgeVariant(employee.role)}>
                      {employee.role.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(employee.status)}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={handleEditEmployee} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Employee
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Daily Target</p>
                    <p className="text-2xl font-bold">{employee.target}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold">{employee.attendance}%</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="text-2xl font-bold">{employee.salary.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="text-2xl font-bold">{employee.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="text-gray-900">{employee.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email Address</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employee ID</p>
                      <p className="text-gray-900 font-mono">{employee.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Role</p>
                      <Badge variant={getRoleBadgeVariant(employee.role)}>
                        {employee.role.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <Badge variant={getStatusBadgeVariant(employee.status)}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Worker Type</p>
                      <p className="text-gray-900">{employee.workerType?.replace('-', ' ') || "—"}</p>
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
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Department</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {employee.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Position</p>
                      <p className="text-gray-900">{employee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Join Date</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {employee.joinDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Salary</p>
                      <p className="text-gray-900 flex items-center gap-1">
                      
                        ${employee.salary.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Daily Target</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((employee.target / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{employee.target}</span>
                      </div>
                    </div>
                    {/* <div>
                      <p className="text-sm font-medium text-gray-600">Attendance</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${employee.attendance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{employee.attendance}%</span>
                      </div>
                    </div> */}
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
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone Number</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {employee.phoneNumber || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Personal Contact</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {employee.contactNumber || "—"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-gray-900 flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5" />
                        {employee.address || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
                      <p className="text-gray-900">{employee.emergencyContact || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Emergency Phone</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {employee.emergencyPhone || "—"}
                      </p>
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
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                      <p className="text-gray-900">{employee.dateOfBirth || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Social Security Number</p>
                      <p className="text-gray-900 font-mono">{employee.socialSecurityNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bank Account</p>
                      <p className="text-gray-900 font-mono">{employee.bankAccount || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Benefits</p>
                      <p className="text-gray-900">{employee.benefits || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Vacation Day</p>
                      <p className="text-gray-900">{employee.vacationDay || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {employee.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 whitespace-pre-wrap">{employee.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleEditEmployee} className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Employee
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push("/hr-employees")}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Employees
                  </Button>
                </CardContent>
              </Card>

              {/* Team Management (for managers) */}
              {employee.role === "manager" && employee.assignedUsers?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Members
                    </CardTitle>
                    <CardDescription>
                      {employee.assignedUsers.length} team members assigned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {employee.assignedUsers.slice(0, 3).map((userId, index) => {
                        const teamMember = getUserById(userId);
                        return teamMember ? (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-3 w-3 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {teamMember.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {teamMember.email}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })}
                      {employee.assignedUsers.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{employee.assignedUsers.length - 3} more team members
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Daily Target</span>
                        <span className="font-medium">{employee.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((employee.target / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      {/* <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Attendance</span>
                        <span className="font-medium">{employee.attendance}%</span>
                      </div> */}
                      {/* <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${employee.attendance}%` }}
                        ></div>
                      </div> */}
                    </div>
                    
                    {employee.lastReview && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">Last Review</p>
                        <p className="text-sm text-gray-900">{employee.lastReview}</p>
                      </div>
                    )}
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