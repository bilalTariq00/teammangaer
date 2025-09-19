"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendanceMarking() {
  const { user } = useAuth();
  const { markAttendance, getAttendanceForDate } = useAttendance();
  const [isMarking, setIsMarking] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    checkIn: '',
    checkOut: '',
    notes: ''
  });

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = getAttendanceForDate(today);
  const userAttendance = todayAttendance[user?.id];

  const handleMarkAttendance = async () => {
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
        notes: attendanceData.notes
      });

      toast.success('Attendance marked successfully!');
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
      case 'marked':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'marked':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Marked';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'marked':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Please log in to mark attendance</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Attendance Status
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
                <span className="font-medium">{getStatusText(userAttendance.status)}</span>
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
            <p className="text-gray-500">No attendance marked for today</p>
          )}
        </CardContent>
      </Card>

      {/* Mark Attendance Form */}
      {!userAttendance && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Your Attendance</CardTitle>
            <CardDescription>
              Mark your check-in and check-out times for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              onClick={handleMarkAttendance} 
              disabled={isMarking || !attendanceData.checkIn}
              className="w-full"
            >
              {isMarking ? 'Marking Attendance...' : 'Mark Attendance'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
