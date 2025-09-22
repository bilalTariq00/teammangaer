"use client";

import { useState } from 'react';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useUsers } from '@/contexts/UsersContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';

export default function HRAttendanceOverview() {
  const { getAllAttendance, getAttendanceStats } = useAttendance();
  const { users } = useUsers();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  const attendanceData = getAllAttendance(selectedDate);
  const stats = getAttendanceStats(selectedDate);

  // Filter attendance based on status
  const filteredAttendance = attendanceData.filter(record => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  // Group attendance by role
  const attendanceByRole = {
    workers: filteredAttendance.filter(r => r.role === 'worker'),
    managers: filteredAttendance.filter(r => r.role === 'manager'),
    qc: filteredAttendance.filter(r => r.role === 'qc')
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent':
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200">Present</Badge>;
      case 'absent':
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200">Absent</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Not Marked</Badge>;
    }
  };

  const getWorkerTypeBadge = (workerType) => {
    if (workerType?.includes('permanent')) {
      return <Badge variant="secondary" className="text-blue-600">Permanent</Badge>;
    } else if (workerType?.includes('trainee')) {
      return <Badge variant="secondary" className="text-orange-600">Trainee</Badge>;
    } else if (workerType === 'manager') {
      return <Badge variant="secondary" className="text-purple-600">Manager</Badge>;
    } else if (workerType === 'qc') {
      return <Badge variant="secondary" className="text-green-600">QC</Badge>;
    }
    return null;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'worker':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'manager':
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      case 'qc':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Selection and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Overview
          </CardTitle>
          <CardDescription>
            Monitor attendance across all teams for {new Date(selectedDate).toLocaleDateString()}
          </CardDescription>
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
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

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
              {stats.workers} workers • {stats.managers} managers • {stats.qc} QC
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground">
              Marked as present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              Not marked present
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Workers ({attendanceByRole.workers.length})
            </CardTitle>
            <CardDescription>Workers</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceByRole.workers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No worker attendance for this date</p>
            ) : (
              <div className="space-y-3">
                {attendanceByRole.workers.map((record) => (
                  <div key={record.userId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="font-medium text-sm">{record.name}</span>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {getWorkerTypeBadge(record.workerType)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Check In:</span> {record.checkIn}
                      </div>
                      <div>
                        <span className="font-medium">Hours:</span> {record.hours || 0}h
                      </div>
                    </div>
                    {record.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{record.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Managers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-500" />
              Managers ({attendanceByRole.managers.length})
            </CardTitle>
            <CardDescription>Team Leaders</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceByRole.managers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No manager attendance for this date</p>
            ) : (
              <div className="space-y-3">
                {attendanceByRole.managers.map((record) => (
                  <div key={record.userId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="font-medium text-sm">{record.name}</span>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Check In:</span> {record.checkIn}
                      </div>
                      <div>
                        <span className="font-medium">Hours:</span> {record.hours || 0}h
                      </div>
                    </div>
                    {record.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{record.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* QC */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              QC ({attendanceByRole.qc.length})
            </CardTitle>
            <CardDescription>Quality Control</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceByRole.qc.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No QC attendance for this date</p>
            ) : (
              <div className="space-y-3">
                {attendanceByRole.qc.map((record) => (
                  <div key={record.userId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="font-medium text-sm">{record.name}</span>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Check In:</span> {record.checkIn}
                      </div>
                      <div>
                        <span className="font-medium">Hours:</span> {record.hours || 0}h
                      </div>
                    </div>
                    {record.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{record.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <div className="text-sm text-green-700">Present</div>
              <div className="text-xs text-green-600 mt-1">
                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% of total
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-sm text-red-700">Absent</div>
              <div className="text-xs text-red-600 mt-1">
                {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}% of total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
