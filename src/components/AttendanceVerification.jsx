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
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";

export default function AttendanceVerification() {
  const { 
    attendanceVerified, 
    verifyAttendance, 
    checkManagerAttendance,
    navigationBlocked 
  } = useManagerWorkflow();
  const { users } = useUsers();
  const { getAttendanceForDate } = useAttendance();
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Load team members and their attendance status
  useEffect(() => {
    if (users) {
      const teamMembersList = users.filter(u => 
        u.role === 'worker' && 
        u.assignedUsers?.includes(users.find(u => u.role === 'manager')?.id)
      ) || [];
      
      // If no assigned users, use mock data
      if (teamMembersList.length === 0) {
        const mockTeamMembers = [
          { id: 5, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", role: "worker", workerType: "Permanent Clicker" },
          { id: 6, name: "Adnan Amir", email: "adnan.amir@joyapps.net", role: "worker", workerType: "Permanent Viewer" },
          { id: 7, name: "Waleed Bin Shakeel", email: "waleed.shakeel@joyapps.net", role: "worker", workerType: "Trainee Clicker" }
        ];
        setTeamMembers(mockTeamMembers);
      } else {
        setTeamMembers(teamMembersList);
      }
    }
  }, [users]);

  // Get attendance status for each team member
  const getAttendanceStatus = (userId) => {
    try {
      const attendance = getAttendanceForDate(userId, today);
      if (!attendance) return 'not_marked';
      
      if (attendance.status === 'present') return 'present';
      if (attendance.status === 'marked') return 'marked';
      if (attendance.status === 'approved') return 'approved';
      if (attendance.status === 'rejected') return 'rejected';
      if (attendance.status === 'absent') return 'absent';
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify attendance
      verifyAttendance(selectedUsers);
      
      toast.success(`Attendance verified for ${selectedUsers.length} team member(s)`);
      
      // Clear selection
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error verifying attendance:", error);
      toast.error("Failed to verify attendance");
    } finally {
      setIsVerifying(false);
    }
  };

  // Manager attendance is already marked, so we don't need to check it here

  if (attendanceVerified) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Attendance Verified</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Team attendance has been verified. You can now proceed to other tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <UserCheck className="h-4 w-4" />
            <span>Verified for {teamMembers.length} team member(s)</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={navigationBlocked ? "border-orange-200 bg-orange-50" : ""}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>
            Verify Team Attendance
          </CardTitle>
        </div>
        <CardDescription>
          Select team members whose attendance you want to verify for today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Select All */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedUsers.length === teamMembers.length && teamMembers.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="select-all" className="text-sm font-medium">
            Select All ({teamMembers.length} members)
          </Label>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          {teamMembers.map((member) => {
            const attendanceStatus = getAttendanceStatus(member.id);
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

        {/* Verify Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleVerifyAttendance}
            disabled={selectedUsers.length === 0 || isVerifying}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isVerifying ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Verify Attendance ({selectedUsers.length})
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}