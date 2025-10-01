"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  UserCheck,
  XCircle
} from "lucide-react";
import { useManagerWorkflow } from "@/contexts/ManagerWorkflowContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/hooks/useAttendance";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AttendanceVerification({ onVerificationComplete }) {
  const { 
    attendanceVerified, 
    verifyAttendance, 
    checkManagerAttendance,
    navigationBlocked,
    verifiedUsers
  } = useManagerWorkflow();
  const { users } = useUsers();
  const { getAttendanceRecords } = useAttendance();
  const { user: currentUser } = useAuth();
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Helper function to check if a user is a team member (worker/user, but not manager)
  const isTeamMember = (user) => {
    return (user.role === 'worker' || user.role === 'user') && user.role !== 'manager';
  };

  // Load team members from backend
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (currentUser && currentUser.role === 'manager') {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch('/api/manager/team', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const result = await response.json();
          if (result.success) {
            setTeamMembers(result.data);
          } else {
            console.error('Failed to fetch team members:', result.error);
            setTeamMembers([]);
          }
        } catch (error) {
          console.error('Error fetching team members:', error);
          setTeamMembers([]);
        }
      }
    };

    fetchTeamMembers();
  }, [currentUser]);

  // Load attendance statuses for team members
  useEffect(() => {
    const loadAttendanceStatuses = async () => {
      if (teamMembers.length === 0) return;

      const statusPromises = teamMembers.map(async (member) => {
        const status = await getAttendanceStatus(member.id);
        return { userId: member.id, status };
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      statuses.forEach(({ userId, status }) => {
        statusMap[userId] = status;
      });
      setAttendanceStatuses(statusMap);
    };

    loadAttendanceStatuses();
  }, [teamMembers]);

  // Filter team members to only show verified users
  const verifiedTeamMembers = teamMembers.filter(member => 
    verifiedUsers && verifiedUsers.includes(member.id)
  );

  console.log('AttendanceVerification Debug:', {
    teamMembers: teamMembers.map(m => ({ id: m.id, name: m.name })),
    verifiedUsers,
    verifiedTeamMembers: verifiedTeamMembers.map(m => ({ id: m.id, name: m.name })),
    attendanceVerified
  });

  // Get attendance status for each team member
  const getAttendanceStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'not_marked';

      const response = await fetch(`/api/attendance?date=${today}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        const userAttendance = result.data.find(record => 
          record.userId && record.userId._id === userId
        );
        
        if (!userAttendance) return 'not_marked';
        
        if (userAttendance.status === 'present') return 'present';
        if (userAttendance.status === 'marked') return 'marked';
        if (userAttendance.status === 'approved') return 'approved';
        if (userAttendance.status === 'rejected') return 'rejected';
        if (userAttendance.status === 'absent') return 'absent';
        
        return 'not_marked';
      }
      
      return 'not_marked';
    } catch (error) {
      console.error('Error getting attendance for user:', userId, error);
      return 'not_marked';
    }
  };

  // Get attendance status badge
  const getAttendanceBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'marked':
        return <Badge className="bg-yellow-100 text-yellow-800">Marked</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'absent':
        return <Badge className="bg-gray-100 text-gray-800">Absent</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Marked</Badge>;
    }
  };

  // Handle user selection
  const handleUserSelect = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      const allUserIds = teamMembers.map(member => member.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle verification
  const handleVerifyAttendance = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one team member to verify");
      return;
    }

    setIsVerifying(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Verify attendance for each selected user
      const verificationPromises = selectedUsers.map(async (userId) => {
        // First, get the attendance record ID for this user
        const attendanceResponse = await fetch(`/api/attendance?date=${today}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const attendanceResult = await attendanceResponse.json();
        if (!attendanceResult.success) {
          throw new Error('Failed to fetch attendance records');
        }

        const userAttendance = attendanceResult.data.find(record => 
          record.userId && record.userId._id === userId
        );

        if (!userAttendance) {
          throw new Error('No attendance record found for this user');
        }

        // Now verify the attendance record
        const response = await fetch(`/api/attendance/${userAttendance._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'approve',
            verificationNotes: `Verified by manager on ${new Date().toLocaleDateString()}`
          })
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to verify attendance');
        }
        return result.data;
      });

      await Promise.all(verificationPromises);
      
      // Verify attendance in context
      verifyAttendance(selectedUsers);
      
      // Set just verified state to show success message
      setJustVerified(true);
      setIsEditing(false);
      
      // Notify parent component
      if (onVerificationComplete) {
        onVerificationComplete(selectedUsers);
      }
      
      toast.success(`Attendance ${isEditing ? 'updated' : 'verified'} for ${selectedUsers.length} team member(s)`);
      
      // Clear selection
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error verifying attendance:", error);
      toast.error("Failed to verify attendance");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle edit verification
  const handleEditVerification = () => {
    try {
      // Set current verified users as selected
      setSelectedUsers(verifiedUsers || []);
      setIsEditing(true);
      setJustVerified(false);
    } catch (error) {
      console.error('Error handling edit verification:', error);
      toast.error('Failed to enter edit mode');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedUsers([]);
  };

  // Manager attendance is already marked, so we don't need to check it here
  // Always show the selection interface first, then verification status after completion

  return (
    <Card className={navigationBlocked ? "border-orange-200 bg-orange-50" : ""}>
          <CardHeader>
        <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
          <CardTitle>
            Verify Team Attendance
            </CardTitle>
        </div>
       
          </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Interface - Show when not just verified or when editing */}
        {(!justVerified || isEditing) && (
          <>
            {/* Select All */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedUsers.length === teamMembers.length && teamMembers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Select All Present ({teamMembers.length} members)
              </Label>
                  </div>
                    
            {/* Team Members List */}
            <div className="space-y-3">
              {teamMembers.map((member) => {
                const attendanceStatus = attendanceStatuses[member.id] || 'not_marked';
                const isSelected = selectedUsers.includes(member.id);
                
                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`user-${member.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleUserSelect(member.id, checked)}
                      />
                  <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.workerType?.replace('-', ' ')}</p>
                        <p className="text-xs text-gray-400">
                          {isSelected ? '✓ Selected as present' : 'Click to mark as present'}
                        </p>
                      </div>
                  </div>
                    <div className="flex items-center gap-2">
                      {getAttendanceBadge(attendanceStatus)}
                      {attendanceStatus === 'not_marked' && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {attendanceStatus === 'present' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                  </div>
                  </div>
                );
              })}
                </div>
          </>
        )}
        
        {/* Success Message - Show after verification */}
        {justVerified && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="text-sm font-medium text-green-800">Attendance Verified Successfully!</h4>
              </div>
            <p className="text-sm text-green-700 mb-3">
              Team attendance has been {isEditing ? 'updated' : 'verified'}. You can now proceed to other tasks.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
              <UserCheck className="h-4 w-4" />
              <span>Verified for {verifiedUsers?.length || 0} team member(s)</span>
                </div>
                <Button 
              variant="outline" 
                  size="sm"
              onClick={handleEditVerification}
              className="text-green-700 border-green-300 hover:bg-green-100"
                >
              Edit Verification
                </Button>
              </div>
        )}

        {/* Verified Team Members Display */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Verified Team Members
          </h4>
          {verifiedUsers && verifiedUsers.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {verifiedUsers.map(userId => {
                  const user = verifiedTeamMembers.find(m => m.id === userId);
                  if (!user) return null;
                  return (
                    <Badge 
                      key={userId} 
                      variant="outline" 
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      {user.name}
                    </Badge>
                  );
                })}
              </div>
              <p className="text-xs text-green-600 mt-2">
                {verifiedUsers.length} team member{verifiedUsers.length !== 1 ? 's' : ''} verified for attendance
              </p>
            </>
          ) : (
            <p className="text-sm text-green-600">
              No team members have been verified yet. Select team members above and click "Verify Attendance" to verify them.
            </p>
          )}
                    </div>
                    
        {/* Action Buttons */}
        {(!justVerified || isEditing) && (
          <div className="flex justify-end gap-2 pt-4">
            {isEditing && (
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleVerifyAttendance}
              disabled={selectedUsers.length === 0 || isVerifying}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Verifying...'}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {isEditing ? `Update Verification (${selectedUsers.length})` : `Verify Attendance (${selectedUsers.length})`}
                </>
              )}
            </Button>
          </div>
        )}
        </CardContent>
      </Card>
  );
}