"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Building,
  Calendar,
  DollarSign,
  Award,
  Phone,
  Mail,
  MapPin,
  User
} from "lucide-react";
import { useUsers } from "@/contexts/UsersContext";
import { useAuth } from "@/contexts/AuthContext";
import HRLayout from "@/components/layout/HRLayout";
import { toast } from "sonner";

export default function HREmployeesPage() {
  const router = useRouter();
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced employee data with HR-specific fields
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Convert users to employees with additional HR fields
    const enhancedEmployees = users.map(user => ({
      ...user,
      // HR-specific fields
      employeeId: `EMP${user.id.toString().padStart(4, '0')}`,
      department: user.department || "Operations",
      position: user.position || user.workerType?.replace('-', ' ') || "Worker",
      salary: user.salary || 0,
      joinDate: user.joinDate || user.created || new Date().toISOString().split('T')[0],
      performance: user.performance || 0,
      attendance: user.attendance || 0,
      lastReview: user.lastReview || null,
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      emergencyContact: user.emergencyContact || "",
      emergencyPhone: user.emergencyPhone || "",
      dateOfBirth: user.dateOfBirth || "",
      socialSecurityNumber: user.socialSecurityNumber || "",
      bankAccount: user.bankAccount || "",
      benefits: user.benefits || "",
      notes: user.notes || "",
      // Contact info (user can edit)
      contactNumber: user.contactNumber || "",
      emergencyNumber: user.emergencyNumber || ""
    }));
    
    setEmployees(enhancedEmployees);
    setIsLoading(false);
  }, [users]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleCreateEmployee = () => {
    router.push("/hr-employees/create");
  };

  const handleEditEmployee = (employee) => {
    router.push(`/hr-employees/edit/${employee.id}`);
  };

  const handleViewEmployee = (employee) => {
    router.push(`/hr-employees/view/${employee.id}`);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        deleteUser(employee.id);
        toast.success("Employee deleted successfully");
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
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

  if (isLoading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading employees...</span>
          </div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600">Manage employee information, roles, and permissions</p>
            </div>
          </div>
          <Button onClick={handleCreateEmployee} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Permanent</p>
                  <p className="text-2xl font-bold">{employees.filter(e => e.status === 'permanent').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Trainees</p>
                  <p className="text-2xl font-bold">{employees.filter(e => e.status === 'trainee').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Salary</p>
                  <p className="text-2xl font-bold">
                    ${employees.length > 0 ? Math.round(employees.reduce((sum, e) => sum + (e.salary || 0), 0) / employees.length).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-2xl font-bold">{new Set(employees.map(e => e.department)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search employees by name, email, ID, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="trainee">Trainee</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    
                    <SelectItem value="qc">QC</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
            <CardDescription>
              Manage employee information, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-600">Employee</th>
                    <th className="text-left p-3 font-medium text-gray-600">ID</th>
                    <th className="text-left p-3 font-medium text-gray-600">Role</th>
                    <th className="text-left p-3 font-medium text-gray-600">Department</th>
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 font-medium text-gray-600">Salary</th>
                    <th className="text-left p-3 font-medium text-gray-600">Join Date</th>
                    <th className="text-left p-3 font-medium text-gray-600">Performance</th>
                    <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {employee.employeeId}
                        </code>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <Badge variant={getRoleBadgeVariant(employee.role)}>
                            {employee.role.toUpperCase()}
                          </Badge>
                          {employee.workerType && (
                            <span className="text-xs text-gray-500">
                              {employee.workerType.replace('-', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{employee.department}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant={getStatusBadgeVariant(employee.status)}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            ${employee.salary ? employee.salary.toLocaleString() : '0'}/month
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{employee.joinDate}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${employee.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{employee.performance}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEmployee(employee)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                            title="Edit Employee"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee)}
                            title="Delete Employee"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </HRLayout>
  );
}
