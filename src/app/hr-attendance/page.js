"use client";

import { useState, useEffect } from 'react';
import HRMainLayout from "@/components/layout/HRMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Users,
  AlertCircle,
  UserCheck,
  Filter,
  Search,
  Eye,
  EyeOff,
  Building,
  UserCog
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";

export default function HRAttendancePage() {
  const { user } = useAuth();
  const { users } = useUsers();
  const { getAllAttendance, getAttendanceStats } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState({});
  const [activeTab, setActiveTab] = useState('partial');

  // Get all attendance for the selected date
  const allAttendance = getAllAttendance(selectedDate);

  // Apply filters
  const filteredAttendance = allAttendance.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesRole = filterRole === 'all' || record.role === filterRole;
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.workerType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesRole && matchesSearch;
  });

  // Get attendance statistics
  const stats = getAttendanceStats(selectedDate);

  // Group attendance by status
  const partialAttendance = filteredAttendance.filter(r => r.status === 'marked' || r.status === 'present');
  const approvedAttendance = filteredAttendance.filter(r => r.status === 'approved');
  const rejectedAttendance = filteredAttendance.filter(r => r.status === 'rejected');
  const absentAttendance = filteredAttendance.filter(r => r.status === 'absent');

  const toggleDetails = (userId) => {
    setShowDetails(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Partial (Marked by Worker)</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200">Approved by Manager</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200">Rejected by Manager</Badge>;
      case 'absent':
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Absent</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Not Marked</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'worker':
        return <Badge variant="secondary" className="text-blue-600">Worker</Badge>;
      case 'manager':
        return <Badge variant="secondary" className="text-purple-600">Manager</Badge>;
      case 'qc':
        return <Badge variant="secondary" className="text-orange-600">QC</Badge>;
      case 'hr':
        return <Badge variant="secondary" className="text-green-600">HR</Badge>;
      default:
        return <Badge variant="secondary" className="text-gray-600">{role}</Badge>;
    }
  };

  const getWorkerTypeBadge = (workerType) => {
    if (workerType?.includes('permanent')) {
      return <Badge variant="outline" className="text-blue-600 border-blue-200">Permanent</Badge>;
    } else if (workerType?.includes('trainee')) {
      return <Badge variant="outline" className="text-orange-600 border-orange-200">Trainee</Badge>;
    }
    return null;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view attendance.</p>
        </div>
      </div>
    );
  }

  return (
    <HRMainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Attendance Management</h1>
              <p className="text-muted-foreground">View partial and approved attendance across all teams</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All employees
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partial Attendance</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{partialAttendance.length}</div>
                <p className="text-xs text-muted-foreground">
                  Marked by workers, pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedAttendance.length}</div>
                <p className="text-xs text-muted-foreground">
                  Approved by managers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{absentAttendance.length}</div>
                <p className="text-xs text-muted-foreground">
                  Not marked present
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Attendance Management
                </CardTitle>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={activeTab === 'partial' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('partial')}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Partial Attendance ({partialAttendance.length})
                  </Button>
                  <Button
                    variant={activeTab === 'approved' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('approved')}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approved Attendance ({approvedAttendance.length})
                  </Button>
                  <Button
                    variant={activeTab === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('all')}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    All Attendance ({filteredAttendance.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <Label htmlFor="date">Select Date:</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-48"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Filter by Role:</Label>
                  <select
                    id="role"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="worker">Workers</option>
                    <option value="manager">Managers</option>
                    <option value="qc">QC</option>
                    <option value="hr">HR</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="search">Search Employees:</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name, role, or worker type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === 'partial' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Partial Attendance (Marked by Workers)
                </CardTitle>
                <CardDescription>
                  {partialAttendance.length} employees have marked attendance but are pending manager approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {partialAttendance.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Partial Attendance</h3>
                    <p className="text-gray-500">
                      No employees have marked attendance for this date.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {partialAttendance.map((record) => (
                      <div key={record.userId} className="border rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(record.status)}
                            <div>
                              <span className="font-medium text-lg">{record.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                {getRoleBadge(record.role)}
                                {getWorkerTypeBadge(record.workerType)}
                                {getStatusBadge(record.status)}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleDetails(record.userId)}
                            className="text-gray-600"
                          >
                            {showDetails[record.userId] ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </>
                            )}
                          </Button>
                        </div>

                        {showDetails[record.userId] && (
                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <Label className="text-gray-500">Check In</Label>
                              <p className="font-medium">{record.checkIn || 'Not marked'}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Check Out</Label>
                              <p className="font-medium">{record.checkOut || 'Not marked'}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Hours</Label>
                              <p className="font-medium">{record.hours || 0} hrs</p>
                            </div>
                          </div>
                        )}

                        {record.notes && (
                          <div className="mb-3">
                            <Label className="text-gray-500">Employee Notes</Label>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded border">{record.notes}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 pt-2 border-t border-yellow-200">
                          <div className="flex items-center gap-4">
                            <span>
                              <strong>Marked at:</strong> {new Date(record.markedAt).toLocaleString()}
                            </span>
                            <span>
                              <strong>Status:</strong> Awaiting manager approval
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'approved' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Approved Attendance (Verified by Managers)
                </CardTitle>
                <CardDescription>
                  {approvedAttendance.length} employees have approved attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {approvedAttendance.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Attendance</h3>
                    <p className="text-gray-500">
                      No attendance has been approved by managers for this date.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedAttendance.map((record) => (
                      <div key={record.userId} className="border rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(record.status)}
                            <div>
                              <span className="font-medium text-lg">{record.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                {getRoleBadge(record.role)}
                                {getWorkerTypeBadge(record.workerType)}
                                {getStatusBadge(record.status)}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleDetails(record.userId)}
                            className="text-gray-600"
                          >
                            {showDetails[record.userId] ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </>
                            )}
                          </Button>
                        </div>

                        {showDetails[record.userId] && (
                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <Label className="text-gray-500">Check In</Label>
                              <p className="font-medium">{record.checkIn || 'Not marked'}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Check Out</Label>
                              <p className="font-medium">{record.checkOut || 'Not marked'}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Hours</Label>
                              <p className="font-medium">{record.hours || 0} hrs</p>
                            </div>
                          </div>
                        )}

                        {record.notes && (
                          <div className="mb-3">
                            <Label className="text-gray-500">Employee Notes</Label>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded border">{record.notes}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 pt-2 border-t border-green-200">
                          <div className="flex items-center gap-4">
                            <span>
                              <strong>Approved by:</strong> {record.approvedBy || 'Manager'}
                            </span>
                            <span>
                              <strong>Approved at:</strong> {record.approvedAt ? new Date(record.approvedAt).toLocaleString() : 'N/A'}
                            </span>
                          </div>
                          {record.approvalNotes && (
                            <div className="mt-1">
                              <strong>Manager Notes:</strong> {record.approvalNotes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'all' && (
            <div className="space-y-6">
              {/* All Attendance - Partial */}
              {partialAttendance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      Partial Attendance ({partialAttendance.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {partialAttendance.map((record) => (
                        <div key={record.userId} className="border rounded-lg p-4 bg-yellow-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(record.status)}
                              <div>
                                <span className="font-medium text-lg">{record.name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  {getRoleBadge(record.role)}
                                  {getWorkerTypeBadge(record.workerType)}
                                  {getStatusBadge(record.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <strong>Marked at:</strong> {new Date(record.markedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Attendance - Approved */}
              {approvedAttendance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Approved Attendance ({approvedAttendance.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {approvedAttendance.map((record) => (
                        <div key={record.userId} className="border rounded-lg p-4 bg-green-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(record.status)}
                              <div>
                                <span className="font-medium text-lg">{record.name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  {getRoleBadge(record.role)}
                                  {getWorkerTypeBadge(record.workerType)}
                                  {getStatusBadge(record.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <strong>Approved by:</strong> {record.approvedBy || 'Manager'} at {record.approvedAt ? new Date(record.approvedAt).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Attendance - Rejected */}
              {rejectedAttendance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Rejected Attendance ({rejectedAttendance.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rejectedAttendance.map((record) => (
                        <div key={record.userId} className="border rounded-lg p-4 bg-red-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(record.status)}
                              <div>
                                <span className="font-medium text-lg">{record.name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  {getRoleBadge(record.role)}
                                  {getWorkerTypeBadge(record.workerType)}
                                  {getStatusBadge(record.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <strong>Rejected by:</strong> {record.approvedBy || 'Manager'} at {record.approvedAt ? new Date(record.approvedAt).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Data Message for All Tab */}
              {filteredAttendance.length === 0 && (
                <Card>
                  <CardContent>
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Found</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterRole !== 'all'
                          ? 'No employees match your current filters.' 
                          : 'No employees have marked attendance for this date.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Summary - {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-700">Total Employees</div>
                  <div className="text-xs text-blue-600 mt-1">
                    All roles combined
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{partialAttendance.length}</div>
                  <div className="text-sm text-yellow-700">Partial Attendance</div>
                  <div className="text-xs text-yellow-600 mt-1">
                    Marked by workers, pending approval
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{approvedAttendance.length}</div>
                  <div className="text-sm text-green-700">Approved</div>
                  <div className="text-xs text-green-600 mt-1">
                    Verified by managers
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{absentAttendance.length}</div>
                  <div className="text-sm text-red-700">Absent</div>
                  <div className="text-xs text-red-600 mt-1">
                    Not marked present
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </HRMainLayout>
  );
}
