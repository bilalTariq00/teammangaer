"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/contexts/UsersContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendanceVerification() {
  const { user } = useAuth();
  const { users } = useUsers();
  const { getTeamAttendance, approveAttendance, markAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [approvalNotes, setApprovalNotes] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Get team members for this manager
  const teamMembers = users?.filter(u => 
    u.role === 'worker' && 
    user?.assignedUsers?.includes(u.id)
  ) || [];

  // Get attendance for selected date
  const teamAttendance = getTeamAttendance(teamMembers.map(m => m.id), selectedDate);
  
  // Get manager's own attendance
  const managerAttendance = teamAttendance.find(a => a.userId === user?.id) || 
    (user?.role === 'manager' ? {
      userId: user.id,
      name: user.name,
      role: 'manager',
      workerType: 'manager',
      status: 'not_marked'
    } : null);

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

  const handleMarkManagerAttendance = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const checkIn = new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      markAttendance(user.id, user, {
        checkIn,
        checkOut: null,
        hours: 0,
        notes: 'Manager attendance'
      });
      
      toast.success('Manager attendance marked!');
    } catch (error) {
      toast.error('Failed to mark manager attendance');
      console.error('Error marking manager attendance:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'marked':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'marked':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200">Rejected</Badge>;
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

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Verification
          </CardTitle>
          <CardDescription>
            Review and approve team attendance for {new Date(selectedDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="date">Select Date:</Label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Manager's Own Attendance */}
      {user?.role === 'manager' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {managerAttendance && managerAttendance.status !== 'not_marked' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(managerAttendance.status)}
                    <span className="font-medium">{user.name}</span>
                    {getWorkerTypeBadge(managerAttendance.workerType)}
                    {getStatusBadge(managerAttendance.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-500">Check In</Label>
                    <p className="font-medium">{managerAttendance.checkIn}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Check Out</Label>
                    <p className="font-medium">{managerAttendance.checkOut || 'Not marked'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Hours</Label>
                    <p className="font-medium">{managerAttendance.hours || 0} hrs</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">You haven't marked your attendance yet</p>
                  <p className="text-sm text-gray-500">Mark your attendance for today</p>
                </div>
                <Button 
                  onClick={handleMarkManagerAttendance}
                  disabled={isProcessing}
                  size="sm"
                >
                  Mark Attendance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Team Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Attendance ({teamAttendance.length} members)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamAttendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No team members found or no attendance marked for this date</p>
          ) : (
            <div className="space-y-4">
              {teamAttendance.map((attendance) => (
                <div key={attendance.userId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(attendance.status)}
                      <span className="font-medium">{attendance.name}</span>
                      {getWorkerTypeBadge(attendance.workerType)}
                      {getStatusBadge(attendance.status)}
                    </div>
                    
                    {attendance.status === 'marked' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(attendance.userId, 'approved')}
                          disabled={isProcessing}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(attendance.userId, 'rejected')}
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
                      <p className="font-medium">{attendance.checkIn}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Check Out</Label>
                      <p className="font-medium">{attendance.checkOut || 'Not marked'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Hours</Label>
                      <p className="font-medium">{attendance.hours || 0} hrs</p>
                    </div>
                  </div>

                  {attendance.notes && (
                    <div className="mb-3">
                      <Label className="text-gray-500">Employee Notes</Label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{attendance.notes}</p>
                    </div>
                  )}

                  {attendance.status === 'marked' && (
                    <div>
                      <Label htmlFor={`notes-${attendance.userId}`} className="text-gray-500">
                        Approval Notes (Optional)
                      </Label>
                      <Textarea
                        id={`notes-${attendance.userId}`}
                        placeholder="Add notes for this attendance..."
                        value={approvalNotes[attendance.userId] || ''}
                        onChange={(e) => setApprovalNotes(prev => ({ 
                          ...prev, 
                          [attendance.userId]: e.target.value 
                        }))}
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {attendance.approvedAt && (
                    <div className="text-xs text-gray-500 mt-2">
                      {attendance.status === 'approved' ? 'Approved' : 'Rejected'} at{' '}
                      {new Date(attendance.approvedAt).toLocaleString()}
                      {attendance.approvalNotes && (
                        <div className="mt-1">
                          <strong>Manager Notes:</strong> {attendance.approvalNotes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
