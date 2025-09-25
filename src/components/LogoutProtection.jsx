"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useManagerWorkflow } from "@/contexts/ManagerWorkflowContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/contexts/AttendanceContext";

export default function LogoutProtection({ isOpen, onClose, onConfirm }) {
  const { 
    attendanceVerified, 
    verifiedUsers, 
    performanceMarked,
    checkPerformanceCompletion,
    checkTeamPerformanceCompletion 
  } = useManagerWorkflow();
  const { user } = useAuth();
  const { users } = useUsers();
  const { getAttendanceForDate } = useAttendance();

  // Get team members based on attendance status (same logic as PerformanceMarking)
  const getTeamMembersByAttendance = () => {
    if (!user || user.role !== 'manager') {
      console.log('LogoutProtection - No user or not manager:', { user: user?.role });
      return [];
    }
    
    console.log('LogoutProtection - User:', { id: user.id, name: user.name, assignedUsers: user.assignedUsers });
    console.log('LogoutProtection - All users:', users?.map(u => ({ id: u.id, name: u.name, role: u.role })));
    
    // Get team members from assigned users
    let teamMembers = users?.filter(u => 
      u.role === 'worker' && 
      user?.assignedUsers?.includes(u.id)
    ) || [];

    console.log('LogoutProtection - Filtered team members:', teamMembers.map(m => ({ id: m.id, name: m.name })));

    // If no team members assigned, use mock team members for demonstration
    if (teamMembers.length === 0) {
      console.log('LogoutProtection - Using mock team members');
      teamMembers = [
        { id: 5, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", role: "worker", workerType: "Permanent Clicker" },
        { id: 6, name: "Adnan Amir", email: "adnan.amir@joyapps.net", role: "worker", workerType: "Permanent Viewer" },
        { id: 7, name: "Waleed Bin Shakeel", email: "waleed.shakeel@joyapps.net", role: "worker", workerType: "Trainee Clicker" }
      ];
    }

    // Generate mock attendance data for team members (same as dashboard)
    const generateMockAttendanceForMembers = () => {
      const getConsistentRandom = (userId) => {
        let hash = 0;
        for (let i = 0; i < userId.toString().length; i++) {
          const char = userId.toString().charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) / 2147483647; // Normalize to 0-1
      };

      return teamMembers.map((member) => {
        const randomValue = getConsistentRandom(member.id);
        let status;
        
        if (randomValue < 0.4) {
          status = 'present';
        } else if (randomValue < 0.7) {
          status = 'marked';
        } else {
          status = 'absent';
        }
        
        return {
          ...member,
          attendanceStatus: status
        };
      });
    };

    // Use mock data for consistency with dashboard
    const membersWithAttendance = generateMockAttendanceForMembers();
    
    // Filter based on attendance status
    const presentMembers = membersWithAttendance.filter(member => 
      member.attendanceStatus === 'present' || 
      member.attendanceStatus === 'approved' ||
      member.attendanceStatus === 'marked'
    );
    
    // If all members are present, show all
    if (presentMembers.length === teamMembers.length) {
      return teamMembers;
    }
    
    // Otherwise, show only present members
    return presentMembers;
  };

  const teamMembers = getTeamMembersByAttendance();

  console.log('LogoutProtection - Team members:', teamMembers.map(m => ({ id: m.id, name: m.name })));

  const handleLogout = () => {
    // Use the performanceMarked state from workflow context
    console.log('LogoutProtection - Performance marked:', performanceMarked);
    
    if (performanceMarked) {
      // If performance is marked, show success message briefly then logout
      setTimeout(() => {
        onConfirm();
      }, 1000);
    } else {
      // Show warning dialog only if performance is not marked
      setShowWarning(true);
    }
  };

  const [showWarning, setShowWarning] = useState(false);

  if (!isOpen) return null;

  // Don't render if user is not loaded yet
  if (!user) {
    console.log('LogoutProtection - User not loaded yet');
    return null;
  }

  // Use the performanceMarked state from workflow context
  const performanceCompleted = performanceMarked;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              {performanceCompleted ? "Logout" : "Confirm Logout"}
            </DialogTitle>
            <DialogDescription>
              {performanceCompleted 
                ? "All tasks completed. Logging out..." 
                : "Are you sure you want to logout? Your session will be ended."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Workflow Status */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Workflow Status:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {attendanceVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={attendanceVerified ? 'text-green-600' : 'text-red-600'}>
                    Attendance Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {performanceMarked ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={performanceMarked ? 'text-green-600' : 'text-red-600'}>
                    Performance Marked
                  </span>
                </div>
              </div>
            </div>

            {/* Warning if performance not marked */}
            {!performanceMarked && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Performance Not Complete</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  You should mark the performance for all verified team members before logging out.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              {!performanceCompleted && (
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button 
                onClick={handleLogout}
                className={performanceCompleted ? "bg-green-600 hover:bg-green-700" : (performanceMarked ? "bg-blue-600 hover:bg-blue-700" : "bg-yellow-600 hover:bg-yellow-700")}
              >
                {performanceCompleted ? "Logout" : (performanceMarked ? "Logout" : "Logout Anyway")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Performance Not Complete
            </DialogTitle>
            <DialogDescription>
              You should mark the performance for all verified team members before logging out.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> You need to mark performance for your team members before logging out.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWarning(false)}>
                Go Back
              </Button>
              <Button 
                onClick={() => {
                  setShowWarning(false);
                  onConfirm();
                }}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Logout Anyway
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
