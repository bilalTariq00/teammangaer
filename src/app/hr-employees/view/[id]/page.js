"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "sonner";
import HRLayout from "@/components/layout/HRLayout";

function ViewEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id ? parseInt(params.id) : null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  
  // Always call hooks unconditionally
  const usersContext = useUsers();
  const getUserById = usersContext?.getUserById;

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load employee data
  useEffect(() => {
    if (!isClient) return;
    
    const loadEmployee = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Wait a bit for context to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Safety check for getUserById function
        if (!getUserById || typeof getUserById !== 'function') {
          console.error('getUserById function not available, context might not be ready');
          setError('Context not ready. Please refresh the page.');
          setIsLoading(false);
          return;
        }
        
        if (!employeeId || isNaN(employeeId)) {
          console.error('Invalid employee ID:', employeeId);
          setError('Invalid employee ID');
          setIsLoading(false);
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
            salary: foundUser.salary || 0,
            joinDate: foundUser.joinDate || foundUser.created || new Date().toISOString().split('T')[0],
            target: foundUser.target || 0,
            // attendance: foundUser.attendance || 0,
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
          console.error("Employee not found for ID:", employeeId);
          setError("Employee not found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading employee:", error);
        setError("Failed to load employee data. Please try again.");
        setIsLoading(false);
      }
    };

    if (employeeId && getUserById) {
      loadEmployee();
    } else if (!employeeId) {
      console.error('Invalid employee ID');
      setError("Invalid employee ID");
      setIsLoading(false);
    } else if (!getUserById) {
      console.error('Context not available');
      setError("Unable to access employee data. Please refresh the page.");
      setIsLoading(false);
    }
  }, [employeeId, router, getUserById, isClient]);

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
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Employee</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} className="w-full">
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/hr-employees")} 
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employees
              </Button>
            </div>
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

// Export as dynamic component to prevent SSR issues
export default dynamic(() => Promise.resolve(ViewEmployeePage), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
});
