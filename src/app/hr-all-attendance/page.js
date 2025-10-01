"use client";

import { useState, useEffect, useCallback } from "react";
import HRMainLayout from "@/components/layout/HRMainLayout";
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
  Search,
  UserCheck,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/hooks/useAttendance";
import { toast } from "sonner";

export default function HRAllAttendancePage() {
  const { user } = useAuth();
  const { users: contextUsers } = useUsers();
  const { 
    attendance, 
    isLoading: attendanceLoading, 
    markAttendance, 
    getAttendanceStatus, 
    checkout, 
    checkin,
    getAttendanceRecords,
    verifyAttendance,
    getAttendanceStats,
    isAttendanceMarkedToday 
  } = useAttendance();
  
  // State for filters and data
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get all users from both AuthContext and UsersContext
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const getAllUsers = useCallback(() => {
    return allUsers;
  }, [allUsers]);

  // Fetch users from database
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch('/api/hr/employees', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Convert database users to the expected format
        const users = result.data.map(user => ({
          id: user.id || user._id, // Use id field from API response
          name: user.name,
          email: user.email,
          role: user.role,
          workerType: user.workerType,
          assignedUsers: user.assignedUsers || []
        }));
        
        // Filter out admin users and current HR user (don't show HR their own attendance)
        const filteredUsers = users.filter(u => u.role !== 'admin' && u.email !== user?.email);
        
        console.log('All users for HR attendance:', filteredUsers.map(u => ({ id: u.id, name: u.name, role: u.role, email: u.email })));
        console.log('Total users:', filteredUsers.length);
        
        setAllUsers(filteredUsers);
      } else {
        console.error('Failed to fetch users:', result.error);
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [user]);

  // Check if a user's attendance is verified by their manager (only for workers)
  const isUserVerified = useCallback((userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all users to check if this user is a worker
      const allUsers = getAllUsers();
      const user = allUsers.find(u => u.id === userId);
      
      // Only check verification for workers (not managers, QC, or HR)
      if (!user || (user.role !== 'worker' && user.role !== 'user')) {
        return false;
      }
      
      // Get all managers and check their verified users
      const managers = allUsers.filter(u => u.role === 'manager');
      
      for (const manager of managers) {
        const usersKey = `verified_users_${manager.id}_${today}`;
        const verifiedUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
        
        if (verifiedUsers.includes(userId)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  }, [getAllUsers]);

  // Get manager name for a user (only for workers)
  const getManagerName = useCallback((userId) => {
    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.id === userId);
    
    // Only get manager name for workers (not managers, QC, or HR)
    if (!user || (user.role !== 'worker' && user.role !== 'user')) {
      return null;
    }
    
    const managers = allUsers.filter(u => u.role === 'manager');
    
    // Find manager who has this user assigned
    for (const manager of managers) {
      if (manager.assignedUsers && manager.assignedUsers.includes(userId)) {
        return manager.name;
      }
    }
    return null;
  }, [getAllUsers]);

  const loadAttendanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const date = selectedDate;
      const data = [];
      
      // Get all users (excluding admin)
      const allUsers = getAllUsers();
      
      // Remove duplicates from allUsers to prevent processing the same user multiple times
      const uniqueUsers = allUsers.filter((user, index, self) => 
        self.findIndex(u => u.id === user.id) === index
      );
      
      console.log('Processing unique users:', uniqueUsers.length, 'out of', allUsers.length);
      
      // Get attendance records for the selected date
      const attendanceRecords = await getAttendanceRecords(date);
      
      // Create a map of attendance records by user ID
      const attendanceMap = {};
      if (attendanceRecords) {
        attendanceRecords.forEach(record => {
          // Skip records with null userId
          if (!record.userId) {
            console.warn('Skipping attendance record with null userId:', record._id);
            return;
          }
          const userId = record.userId._id || record.userId;
          if (userId) {
            attendanceMap[userId] = record;
          }
        });
      }
      
      // Get all users and their attendance data
      for (const user of uniqueUsers) {
        try {
          // Get attendance from the records map (will be set up before the loop)
          const attendance = attendanceMap[user.id];
          const isVerified = isUserVerified(user.id);
          const managerName = getManagerName(user.id);
          
          data.push({
            id: user.id,
            name: user.name || 'Unknown',
            email: user.email || 'No email',
            role: user.role || 'unknown',
            workerType: user.workerType || user.type || 'N/A',
            status: attendance?.status || 'not_marked',
            checkIn: attendance?.checkIn || null,
            checkOut: attendance?.checkOut || null,
            hours: attendance?.totalHours || 0,
            markedAt: attendance?.markedAt || null,
            markedBy: attendance?.markedBy || null,
            notes: attendance?.notes || null,
            isVerified: isVerified,
            managerName: managerName
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
            notes: null,
            isVerified: false,
            managerName: null
          });
        }
      }
      
      console.log('Loaded attendance data:', data);
      console.log('Sample data roles:', data.map(item => ({ id: item.id, name: item.name, role: item.role, workerType: item.workerType, email: item.email })));
      
      // Check for duplicates in attendance data
      const duplicateIds = data.filter((item, index, self) => 
        self.findIndex(i => i.id === item.id) !== index
      );
      const duplicateEmails = data.filter((item, index, self) => 
        self.findIndex(i => i.email === item.email) !== index
      );
      
      if (duplicateIds.length > 0) {
        console.warn('Duplicate IDs found in attendance data:', duplicateIds.map(d => ({ id: d.id, name: d.name, email: d.email })));
      }
      if (duplicateEmails.length > 0) {
        console.warn('Duplicate emails found in attendance data:', duplicateEmails.map(d => ({ id: d.id, name: d.name, email: d.email })));
      }
      
      // Final deduplication to ensure no duplicates in the final data
      const finalData = data.filter((item, index, self) => 
        self.findIndex(i => i.id === item.id) === index
      );
      
      console.log('Final data after deduplication:', finalData.length, 'out of', data.length);
      setAttendanceData(finalData);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Load attendance data for selected date
  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate]);

  // Filter data based on selected filters
  const filteredData = attendanceData.filter(item => {
    let matchesRole = false;
    
    // Role filtering logic
    if (roleFilter === "all") {
      matchesRole = true;
    } else if (roleFilter === "worker") {
      // Show both 'worker' and 'user' roles as workers
      matchesRole = item.role === "worker" || item.role === "user";
    } else if (roleFilter === "manager") {
      // Only show managers
      matchesRole = item.role === "manager";
    } else if (roleFilter === "qc") {
      // Only show QC
      matchesRole = item.role === "qc";
    } else if (roleFilter === "hr") {
      // Only show HR
      matchesRole = item.role === "hr";
    } else {
      // Fallback: exact match
      matchesRole = item.role === roleFilter;
    }
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const result = matchesRole && matchesStatus && matchesSearch;
    
    // Debug logging for role filtering
    if (roleFilter !== "all") {
      console.log('Role Filter Debug:', {
        item: item.name,
        role: item.role,
        workerType: item.workerType,
        roleFilter,
        matchesRole,
        result: result ? 'INCLUDED' : 'EXCLUDED'
      });
    }
    
    return result;
  });

  // Calculate statistics
  const stats = {
    total: filteredData.length,
    present: filteredData.filter(item => ['present', 'marked', 'approved'].includes(item.status)).length,
    absent: filteredData.filter(item => ['absent', 'rejected'].includes(item.status)).length,
    pending: filteredData.filter(item => item.status === 'marked').length,
    notMarked: filteredData.filter(item => item.status === 'not_marked').length,
    verified: filteredData.filter(item => item.isVerified && (item.role === 'worker' || item.role === 'user')).length
  };

  // Role filter options
  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "manager", label: "Manager" },
    { value: "qc", label: "QC" },
    { value: "hr", label: "HR" },
    { value: "worker", label: "Worker" }
  ];

  // Helper functions for badges
  const getRoleBadge = (role) => {
    const colors = {
      manager: "bg-blue-100 text-blue-800",
      qc: "bg-purple-100 text-purple-800",
      hr: "bg-green-100 text-green-800",
      worker: "bg-orange-100 text-orange-800",
      user: "bg-orange-100 text-orange-800"
    };
    
    return (
      <Badge className={colors[role] || "bg-gray-100 text-gray-800"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      present: "bg-green-100 text-green-800",
      approved: "bg-green-100 text-green-800",
      marked: "bg-yellow-100 text-yellow-800",
      absent: "bg-red-100 text-red-800",
      rejected: "bg-red-100 text-red-800",
      not_marked: "bg-gray-100 text-gray-800"
    };
    
    const labels = {
      present: "Present",
      approved: "Approved",
      marked: "Pending",
      absent: "Absent",
      rejected: "Rejected",
      not_marked: "Not Marked"
    };
    
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getVerificationBadge = (isVerified, managerName, role) => {
    // Only show verification status for workers
    if (role !== 'worker' && role !== 'user') {
      return (
        <Badge variant="outline" className="text-gray-500">
          <Shield className="h-3 w-3 mr-1" />
          N/A
        </Badge>
      );
    }
    
    if (!isVerified) {
      return (
        <Badge variant="outline" className="text-gray-600">
          <Clock className="h-3 w-3 mr-1" />
          Not Verified
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-green-100 text-green-800">
        <UserCheck className="h-3 w-3 mr-1" />
        Verified
        {managerName && (
          <span className="ml-1 text-xs">by {managerName}</span>
        )}
      </Badge>
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredData.map(item => ({
      Name: item.name,
      Email: item.email,
      Role: item.role,
      Status: item.status,
      'Check In': item.checkIn || '-',
      'Check Out': item.checkOut || '-',
      Hours: item.hours || 0,
      'Verification Status': (item.role === 'worker' || item.role === 'user') 
        ? (item.isVerified ? 'Verified' : 'Not Verified') 
        : 'N/A',
      'Manager': item.managerName || '-'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr-attendance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <HRMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to access the HR attendance page.</p>
          </div>
        </div>
      </HRMainLayout>
    );
  }

  return (
    <HRMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Users Attendance</h1>
            <p className="text-gray-600 mt-1">
              Monitor attendance records for all users including managers, QC, HR, and workers
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={loadAttendanceData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
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
            {isLoading || isLoadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                {isLoadingUsers ? 'Loading users...' : 'Loading attendance data...'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S.No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Verification Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No attendance records found for the selected filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{getRoleBadge(item.role)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.checkIn || '-'}</TableCell>
                          <TableCell>{item.checkOut || '-'}</TableCell>
                          <TableCell>{item.hours || 0}h</TableCell>
                          <TableCell>{getVerificationBadge(item.isVerified, item.managerName, item.role)}</TableCell>
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
    </HRMainLayout>
  );
}
