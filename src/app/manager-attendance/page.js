"use client";

import { useState, useEffect } from 'react';
import ManagerMainLayout from "@/components/layout/ManagerMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Users,
  AlertCircle,
  UserCheck,
  Filter,
  Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";

export default function ManagerAttendancePage() {
  const { user } = useAuth();
  const { users } = useUsers();
  const { getTeamAttendance, approveAttendance, getAllAttendance, getAttendanceStats } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalNotes, setApprovalNotes] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Get team members for this manager
  const teamMembers = users?.filter(u => 
    u.role === 'worker' && 
    user?.assignedUsers?.includes(u.id)
  ) || [];

  // Get all attendance for the selected date
  const allAttendance = getAllAttendance(selectedDate);
  
  // Filter attendance for team members only
  const teamAttendance = allAttendance.filter(record => 
    teamMembers.some(member => member.id === record.userId)
  );

  // Apply filters
  const filteredAttendance = teamAttendance.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.workerType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get attendance statistics
  const stats = getAttendanceStats(selectedDate);
  const teamStats = {
    total: teamAttendance.length,
    present: teamAttendance.filter(r => r.status === 'present' || r.status === 'marked' || r.status === 'approved').length,
    absent: teamAttendance.filter(r => r.status === 'absent' || r.status === 'rejected').length,
    pending: teamAttendance.filter(r => r.status === 'marked').length,
    approved: teamAttendance.filter(r => r.status === 'approved').length,
    rejected: teamAttendance.filter(r => r.status === 'rejected').length
  };

  const handleApprove = async (userId, action) => {
    setIsProcessing(true);
    try {
      approveAttendance(userId, selectedDate, action, approvalNotes[userId] || '');
      toast.success(`Attendance ${action} successfully!`);
      setApprovalNotes(prev => ({ ...prev, [userId]: '' }));
    } catch (error) {
      toast.error(`Failed to ${action} attendance`);
      console.error('Error approving attendance:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200">Rejected</Badge>;
      case 'absent':
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Absent</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Not Marked</Badge>;
    }
  };

  const getWorkerTypeBadge = (workerType) => {
    if (workerType?.includes('permanent')) {
      return <Badge variant="secondary" className="text-blue-600">Permanent</Badge>;
    } else if (workerType?.includes('trainee')) {
      return <Badge variant="secondary" className="text-orange-600">Trainee</Badge>;
    }
    return null;
  };

  if (!user) {
    return (
      <ManagerMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view attendance.</p>
          </div>
        </div>
      </ManagerMainLayout>
    );
  }

  return (
    <ManagerMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Attendance Management</h1>
            <p className="text-muted-foreground">Review and approve team member attendance</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {teamMembers.length} assigned to you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{teamStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{teamStats.approved}</div>
              <p className="text-xs text-muted-foreground">
                Approved by you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{teamStats.absent}</div>
              <p className="text-xs text-muted-foreground">
                Not marked present
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
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
                <Label htmlFor="status">Filter by Status:</Label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="marked">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div className="flex-1">
                <Label htmlFor="search">Search Team Members:</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or worker type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Team Attendance for {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
            <CardDescription>
              {filteredAttendance.length} team members found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAttendance.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No team members match your current filters.' 
                    : 'No team members have marked attendance for this date.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAttendance.map((record) => (
                  <div key={record.userId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <span className="font-medium text-lg">{record.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {getWorkerTypeBadge(record.workerType)}
                            {getStatusBadge(record.status)}
                          </div>
                        </div>
                      </div>
                      
                      {record.status === 'marked' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(record.userId, 'approved')}
                            disabled={isProcessing}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(record.userId, 'rejected')}
                            disabled={isProcessing}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>

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

                    {record.notes && (
                      <div className="mb-3">
                        <Label className="text-gray-500">Employee Notes</Label>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{record.notes}</p>
                      </div>
                    )}

                    {record.status === 'marked' && (
                      <div>
                        <Label htmlFor={`notes-${record.userId}`} className="text-gray-500">
                          Approval Notes (Optional)
                        </Label>
                        <Textarea
                          id={`notes-${record.userId}`}
                          placeholder="Add notes for this attendance approval..."
                          value={approvalNotes[record.userId] || ''}
                          onChange={(e) => setApprovalNotes(prev => ({ 
                            ...prev, 
                            [record.userId]: e.target.value 
                          }))}
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    )}

                    {record.approvedAt && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                        <div className="flex items-center gap-4">
                          <span>
                            <strong>Status:</strong> {record.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                          <span>
                            <strong>Approved at:</strong> {new Date(record.approvedAt).toLocaleString()}
                          </span>
                        </div>
                        {record.approvalNotes && (
                          <div className="mt-1">
                            <strong>Manager Notes:</strong> {record.approvalNotes}
                          </div>
                        )}
                      </div>
                    )}

                    {record.markedAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Marked at:</strong> {new Date(record.markedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{teamStats.total}</div>
                <div className="text-sm text-blue-700">Total Team</div>
                <div className="text-xs text-blue-600 mt-1">
                  {teamMembers.length} assigned members
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{teamStats.pending}</div>
                <div className="text-sm text-yellow-700">Pending Approval</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {teamStats.total > 0 ? Math.round((teamStats.pending / teamStats.total) * 100) : 0}% of team
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{teamStats.approved}</div>
                <div className="text-sm text-green-700">Approved</div>
                <div className="text-xs text-green-600 mt-1">
                  {teamStats.total > 0 ? Math.round((teamStats.approved / teamStats.total) * 100) : 0}% of team
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{teamStats.absent}</div>
                <div className="text-sm text-red-700">Absent</div>
                <div className="text-xs text-red-600 mt-1">
                  {teamStats.total > 0 ? Math.round((teamStats.absent / teamStats.total) * 100) : 0}% of team
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerMainLayout>
  );
}
