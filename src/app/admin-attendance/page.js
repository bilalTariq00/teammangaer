"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";

export default function AdminAttendancePage() {
  const { user } = useAuth();
  const { users: contextUsers } = useUsers();
  const { getAttendanceForDate, getAttendanceStats } = useAttendance();
  
  // State for filters and data
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get all users from both AuthContext and UsersContext
  const getAllUsers = useCallback(() => {
    // Users from AuthContext (includes QC, HR, and other demo users)
    const authUsers = [
      {
        id: 2,
        name: "Muhammad Shahood",
        email: "Shahood1@joyapps.net",
        role: "manager",
        workerType: "manager"
      },
      {
        id: 8,
        name: "Sarah Manager",
        email: "manager@joyapps.com",
        role: "manager",
        workerType: "manager"
      },
      {
        id: 3,
        name: "John QC",
        email: "qc@joyapps.com",
        role: "qc",
        workerType: "qc"
      },
      {
        id: 4,
        name: "Sarah HR",
        email: "hr@joyapps.com",
        role: "hr",
        workerType: "hr"
      },
      {
        id: 5,
        name: "Hasan Abbas",
        email: "hasan@joyapps.net",
        role: "user",
        workerType: "permanent-worker"
      },
      {
        id: 6,
        name: "Adnan Amir",
        email: "adnan@joyapps.net",
        role: "user",
        workerType: "permanent-worker"
      },
      {
        id: 7,
        name: "Waleed Bin Shakeel",
        email: "waleed@joyapps.net",
        role: "user",
        workerType: "trainee-worker"
      }
    ];

    // Users from UsersContext (workers and managers created by admin)
    const contextUsersList = contextUsers || [];

    // Combine both lists and remove duplicates by email
    const allUsers = [...authUsers, ...contextUsersList];
    const uniqueUsers = allUsers.filter((user, index, self) => 
      index === self.findIndex(u => u.email === user.email)
    );

    // Filter out admin users
    return uniqueUsers.filter(u => u.role !== 'admin');
  }, [contextUsers]);

  const loadAttendanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const date = selectedDate;
      const data = [];
      
      // Get all users (excluding admin) - filter inside the function to avoid dependency issues
      const allUsers = getAllUsers();
      
      // Get all users and their attendance data
      for (const user of allUsers) {
        try {
          const attendance = getAttendanceForDate(user.id, date);
          data.push({
            id: user.id,
            name: user.name || 'Unknown',
            email: user.email || 'No email',
            role: user.role || 'unknown',
            workerType: user.workerType || user.type || 'N/A',
            status: attendance?.status || 'not_marked',
            checkIn: attendance?.checkIn || null,
            checkOut: attendance?.checkOut || null,
            hours: attendance?.hours || 0,
            markedAt: attendance?.markedAt || null,
            markedBy: attendance?.markedBy || null,
            notes: attendance?.notes || null
          });
        } catch (userError) {
          console.error(`Error loading attendance for user ${user.id}:`, userError);
          // Add user with default values if there's an error
          data.push({
            id: user.id,
            name: user.name || 'Unknown',
            email: user.email || 'No email',
            role: user.role || 'unknown',
            workerType: user.workerType || user.type || 'N/A',
            status: 'not_marked',
            checkIn: null,
            checkOut: null,
            hours: 0,
            markedAt: null,
            markedBy: null,
            notes: null
          });
        }
      }
      
      setAttendanceData(data);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, getAllUsers, getAttendanceForDate]);

  // Get all users (excluding admin) for display
  const allUsers = getAllUsers();

  // Load attendance data for selected date
  useEffect(() => {
    loadAttendanceData();
  }, [loadAttendanceData]);

  // Filter data based on selected filters
  const filteredData = attendanceData.filter(item => {
    let matchesRole = false;
    
    if (roleFilter === "all") {
      matchesRole = true;
    } else if (roleFilter === "worker") {
      // Show both 'worker' and 'user' roles as workers
      matchesRole = item.role === "worker" || item.role === "user";
    } else {
      // For specific roles (manager, qc, hr), match exactly
      matchesRole = item.role === roleFilter;
    }
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: filteredData.length,
    present: filteredData.filter(item => ['present', 'marked', 'approved'].includes(item.status)).length,
    absent: filteredData.filter(item => ['absent', 'rejected'].includes(item.status)).length,
    notMarked: filteredData.filter(item => item.status === 'not_marked').length,
    pending: filteredData.filter(item => item.status === 'marked').length
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { className: "bg-green-100 text-green-800", label: "Present" },
      marked: { className: "bg-yellow-100 text-yellow-800", label: "Marked" },
      approved: { className: "bg-green-100 text-green-800", label: "Approved" },
      absent: { className: "bg-red-100 text-red-800", label: "Absent" },
      rejected: { className: "bg-red-100 text-red-800", label: "Rejected" },
      not_marked: { className: "bg-gray-100 text-gray-800", label: "Not Marked" }
    };
    
    const config = statusConfig[status] || statusConfig.not_marked;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      manager: { className: "bg-blue-100 text-blue-800", label: "Manager" },
      qc: { className: "bg-purple-100 text-purple-800", label: "QC" },
      hr: { className: "bg-pink-100 text-pink-800", label: "HR" },
      worker: { className: "bg-orange-100 text-orange-800", label: "Worker" },
      user: {className: "bg-orange-100 text-orange-800", label: "Worker" }
    };
    
    const config = roleConfig[role] || { className: "bg-gray-100 text-gray-800", label: role };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Export data to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Check In', 'Check Out', 'Hours'],
      ...filteredData.map(item => [
        item.name,
        item.email,
        item.role,
        item.status,
        item.checkIn || '',
        item.checkOut || '',
        item.hours || 0
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Define role filter options
  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "manager", label: "Manager" },
    { value: "qc", label: "QC" },
    { value: "hr", label: "HR" },
    { value: "worker", label: "Worker" }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Users Attendance</h1>
          <p className="text-muted-foreground">
            View attendance records for all users across all roles
          </p>
        </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={loadAttendanceData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Marked</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.notMarked}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="marked">Marked (Pending)</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="not_marked">Not Marked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Filter */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users Attendance Records</CardTitle>
            <CardDescription>
              Showing {filteredData.length} of {attendanceData.length} users for {selectedDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Loading attendance data...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          No attendance records found for the selected filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{getRoleBadge(item.role)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.checkIn || '-'}</TableCell>
                          <TableCell>{item.checkOut || '-'}</TableCell>
                          <TableCell>{item.hours || 0}h</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
