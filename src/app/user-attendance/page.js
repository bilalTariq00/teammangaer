"use client";

import { useState, useEffect } from 'react';
import UserMainLayout from "@/components/layout/UserMainLayout";
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
  CheckSquare,
  AlertCircle,
  User,
  Calendar as CalendarIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";

export default function UserAttendancePage() {
  const { user } = useAuth();
  const { markAttendance, getUserAttendance, getAttendanceForDate } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMarking, setIsMarking] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    checkIn: '',
    checkOut: '',
    notes: ''
  });

  // Get today's attendance
  const todayAttendance = getAttendanceForDate(selectedDate);
  const userAttendance = todayAttendance[user?.id];

  // Get user's attendance history for the past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];
  
  const attendanceHistory = getUserAttendance(user?.id, startDate, endDate);

  const handleMarkPresent = async () => {
    if (!attendanceData.checkIn) {
      toast.error('Please enter check-in time');
      return;
    }

    setIsMarking(true);
    
    try {
      // Calculate hours if check-out is provided
      let hours = 0;
      if (attendanceData.checkOut) {
        const checkInTime = new Date(`2000-01-01T${attendanceData.checkIn}`);
        const checkOutTime = new Date(`2000-01-01T${attendanceData.checkOut}`);
        hours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        if (hours < 0) hours += 24; // Handle overnight shifts
      }

      markAttendance(user.id, user, {
        checkIn: attendanceData.checkIn,
        checkOut: attendanceData.checkOut || null,
        hours: Math.round(hours * 10) / 10,
        notes: attendanceData.notes,
        status: 'present' // Explicitly mark as present
      });

      toast.success('Attendance marked as Present!');
      setAttendanceData({ checkIn: '', checkOut: '', notes: '' });
    } catch (error) {
      toast.error('Failed to mark attendance');
      console.error('Error marking attendance:', error);
    } finally {
      setIsMarking(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'absent':
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
        return <Badge variant="outline" className="text-green-600 border-green-200">Present</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200">Rejected</Badge>;
      case 'absent':
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Absent</Badge>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
      case 'marked':
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'absent':
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Calculate attendance statistics
  const totalDays = 30;
  const presentDays = Object.values(attendanceHistory).filter(record => 
    record.status === 'present' || record.status === 'marked' || record.status === 'approved'
  ).length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  if (!user) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view your attendance.</p>
          </div>
        </div>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Attendance</h1>
            <p className="text-muted-foreground">Track your daily attendance and view history</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentDays}</div>
              <p className="text-xs text-muted-foreground">
                Out of {totalDays} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              <XCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{absentDays}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today&apos;s Attendance
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userAttendance ? (
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(userAttendance.status)}`}>
                  {getStatusIcon(userAttendance.status)}
                  <span className="font-medium">{getStatusBadge(userAttendance.status)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Check In</Label>
                    <p className="text-lg font-semibold">{userAttendance.checkIn}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Check Out</Label>
                    <p className="text-lg font-semibold">{userAttendance.checkOut || 'Not marked'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Hours</Label>
                    <p className="text-lg font-semibold">{userAttendance.hours || 0} hrs</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Marked At</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(userAttendance.markedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {userAttendance.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Notes</Label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{userAttendance.notes}</p>
                  </div>
                )}

                {userAttendance.approvedAt && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Approved At</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(userAttendance.approvedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {userAttendance.approvalNotes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Manager Notes</Label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{userAttendance.approvalNotes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Marked</h3>
                  <p className="text-gray-500 mb-4">You need to manually mark your attendance for today</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50">
                    <XCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Status: Absent (Not Marked)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check In Time *</Label>
                      <Input
                        id="checkIn"
                        type="time"
                        value={attendanceData.checkIn}
                        onChange={(e) => setAttendanceData(prev => ({ ...prev, checkIn: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check Out Time</Label>
                      <Input
                        id="checkOut"
                        type="time"
                        value={attendanceData.checkOut}
                        onChange={(e) => setAttendanceData(prev => ({ ...prev, checkOut: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional notes about your attendance..."
                      value={attendanceData.notes}
                      onChange={(e) => setAttendanceData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleMarkPresent} 
                    disabled={isMarking || !attendanceData.checkIn}
                    className="w-full"
                  >
                    {isMarking ? 'Marking Present...' : 'Mark as Present'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance History (Last 30 Days)
            </CardTitle>
            <CardDescription>
              Your attendance record for the past month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(attendanceHistory).length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance History</h3>
                <p className="text-gray-500">Start marking your attendance to see your history here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(attendanceHistory)
                  .sort(([a], [b]) => new Date(b) - new Date(a))
                  .map(([date, record]) => (
                    <div key={date} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(record.status)}
                          <span className="font-medium">
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Check In:</span> {record.checkIn}
                        </div>
                        <div>
                          <span className="font-medium">Hours:</span> {record.hours || 0}h
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {record.status}
                        </div>
                      </div>
                      
                      {record.notes && (
                        <p className="text-xs text-gray-500 mt-2 italic">&ldquo;{record.notes}&rdquo;</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserMainLayout>
  );
}
