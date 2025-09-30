"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAttendance } from './AttendanceContext';
import { usePerformance } from './PerformanceContext';

const ManagerWorkflowContext = createContext();

export function ManagerWorkflowProvider({ children }) {
  const { user } = useAuth();
  const { getTeamAttendance, getAttendanceStats } = useAttendance();
  const { getTeamPerformance } = usePerformance();
  
  const [attendanceVerified, setAttendanceVerified] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [performanceMarked, setPerformanceMarked] = useState(false);
  const [workflowBlocked, setWorkflowBlocked] = useState(false);
  const [navigationBlocked, setNavigationBlocked] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Check if manager has marked their own attendance
  const checkManagerAttendance = useCallback(() => {
    try {
      if (!user || user.role !== 'manager') return false;
      
      // Check if manager has marked attendance today
      const managerAttendance = localStorage.getItem(`attendance_${user.id}_${today}`);
      return !!managerAttendance;
    } catch (error) {
      console.error('Error checking manager attendance:', error);
      return false;
    }
  }, [user, today]);

  // Check attendance verification status
  const checkAttendanceVerification = useCallback(() => {
    try {
      if (!user || user.role !== 'manager') return false;
      
      const verificationKey = `attendance_verified_${user.id}_${today}`;
      const verified = localStorage.getItem(verificationKey);
      
      // Clean up old verification data (older than today)
      cleanupOldVerificationData();
      
      return verified === 'true';
    } catch (error) {
      console.error('Error checking attendance verification:', error);
      return false;
    }
  }, [user, today]);

  // Clean up old verification data (older than today)
  const cleanupOldVerificationData = () => {
    try {
      if (!user || user.role !== 'manager') return;
      
      const keysToCheck = [
        `attendance_verified_${user.id}_`,
        `verified_users_${user.id}_`,
        `performance_completed_${user.id}_`
      ];
      
      // Get all localStorage keys and remove old ones
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          // Check if this key belongs to the current user but is for a different date
          const isOldUserKey = keysToCheck.some(prefix => 
            key.startsWith(prefix) && !key.endsWith(today)
          );
          
          if (isOldUserKey) {
            console.log('Cleaning up old verification data:', key);
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up verification data:', error);
    }
  };

  // Get verified users (users whose attendance has been verified)
  const getVerifiedUsers = useCallback(() => {
    try {
      if (!user || user.role !== 'manager') return [];
      
      const verificationKey = `verified_users_${user.id}_${today}`;
      const stored = localStorage.getItem(verificationKey);
      let verifiedUsers = stored ? JSON.parse(stored) : [];
      
      console.log('getVerifiedUsers:', {
        user: user?.name,
        verificationKey,
        stored,
        verifiedUsers,
        today
      });
      
      return verifiedUsers;
    } catch (error) {
      console.error('Error getting verified users:', error);
      return [];
    }
  }, [user, today]);

  // Check if all verified users have performance marked
  const checkPerformanceCompletion = useCallback(() => {
    if (!user || user.role !== 'manager') return true;
    
    const verifiedUsersList = getVerifiedUsers();
    if (verifiedUsersList.length === 0) return true;
    
    const teamPerformance = getTeamPerformance(user.id, today);
    const performanceUserIds = teamPerformance.map(p => p.user.id);
    
    console.log('Performance completion check:', {
      verifiedUsers: verifiedUsersList,
      performanceUserIds,
      teamPerformance
    });
    
    // Check if all verified users have performance marked
    const allMarked = verifiedUsersList.every(userId => 
      performanceUserIds.includes(userId)
    );
    
    console.log('All performance marked:', allMarked);
    return allMarked;
  }, [user, today, getVerifiedUsers]);

  // Alternative check based on actual team members (for when verification is not used)
  const checkTeamPerformanceCompletion = (teamMembers) => {
    if (!user || user.role !== 'manager' || !teamMembers || teamMembers.length === 0) {
      console.log('Team performance completion check - early return:', { user: user?.role, teamMembers: teamMembers?.length });
      return true;
    }
    
    const teamPerformance = getTeamPerformance(user.id, today);
    const performanceUserIds = teamPerformance.map(p => p.user.id);
    
    console.log('Team performance completion check:', {
      teamMembers: teamMembers.map(m => ({ id: m.id, name: m.name })),
      performanceUserIds,
      teamPerformance: teamPerformance.map(p => ({ 
        id: p.user.id, 
        name: p.user.name, 
        hasPerformance: !!p.performance,
        performance: p.performance
      }))
    });
    
    // Check if all team members have performance marked
    const allMarked = teamMembers.every(member => {
      const hasPerformance = performanceUserIds.includes(member.id);
      console.log(`Member ${member.name} (${member.id}) has performance:`, hasPerformance);
      return hasPerformance;
    });
    
    console.log('All team performance marked:', allMarked);
    return allMarked;
  };

  // Verify attendance for users
  const verifyAttendance = (userIds) => {
    try {
      if (!user || user.role !== 'manager') return;
      
      // Filter out the manager's own ID to ensure only team members are verified
      const teamMemberIds = userIds.filter(id => id !== user.id);
      
      const verificationKey = `attendance_verified_${user.id}_${today}`;
      const usersKey = `verified_users_${user.id}_${today}`;
      
      console.log('verifyAttendance called with userIds:', userIds);
      console.log('Filtered team member IDs (excluding manager):', teamMemberIds);
      console.log('Storing verification data:', {
        verificationKey,
        usersKey,
        originalUserIds: userIds,
        filteredUserIds: teamMemberIds,
        userIdsLength: teamMemberIds.length
      });
      
      localStorage.setItem(verificationKey, 'true');
      localStorage.setItem(usersKey, JSON.stringify(teamMemberIds));
      
      // Force state updates
      setAttendanceVerified(true);
      setVerifiedUsers([...teamMemberIds]); // Create new array to trigger re-render
      setUpdateTrigger(prev => prev + 1); // Trigger update
      
      console.log('Verification data stored successfully');
      console.log('State updated - attendanceVerified: true, verifiedUsers:', teamMemberIds);
      
      // Force a re-check after a short delay to ensure state is updated
      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
          console.log('Verification data verification - stored users:', storedUsers);
          setVerifiedUsers([...storedUsers]);
          setUpdateTrigger(prev => prev + 1); // Trigger another update
        } catch (error) {
          console.error('Error in verification timeout:', error);
        }
      }, 100);
    } catch (error) {
      console.error('Error verifying attendance:', error);
    }
  };

  // Mark performance as completed
  const markPerformanceCompleted = () => {
    if (!user || user.role !== 'manager') return;
    
    console.log('Marking performance as completed for user:', user.id);
    
    const performanceKey = `performance_completed_${user.id}_${today}`;
    localStorage.setItem(performanceKey, 'true');
    setPerformanceMarked(true);
    
    console.log('Performance marked as completed');
  };

  // Clear verification data (for testing/debugging)
  const clearVerificationData = () => {
    if (!user || user.role !== 'manager') return;
    
    const verificationKey = `attendance_verified_${user.id}_${today}`;
    const usersKey = `verified_users_${user.id}_${today}`;
    
    localStorage.removeItem(verificationKey);
    localStorage.removeItem(usersKey);
    
    setAttendanceVerified(false);
    setVerifiedUsers([]);
    
    console.log('Verification data cleared');
  };

  // Refresh verification data from localStorage
  const refreshVerificationData = () => {
    if (!user || user.role !== 'manager') return;
    
    const attendanceVerifiedStatus = checkAttendanceVerification();
    const verifiedUsersList = getVerifiedUsers();
    
    console.log('Refreshing verification data:', {
      attendanceVerifiedStatus,
      verifiedUsersList
    });
    
    setAttendanceVerified(attendanceVerifiedStatus);
    setVerifiedUsers(verifiedUsersList);
  };

  // Check workflow status on mount
  useEffect(() => {
    if (user && user.role === 'manager') {
      const managerAttended = checkManagerAttendance();
      const attendanceVerifiedStatus = checkAttendanceVerification();
      const verifiedUsersList = getVerifiedUsers();
      const performanceCompleted = checkPerformanceCompletion();
      
      setAttendanceVerified(attendanceVerifiedStatus);
      setVerifiedUsers(verifiedUsersList);
      setPerformanceMarked(performanceCompleted);
      
      // Block workflow if manager hasn't attended or verified team attendance
      setWorkflowBlocked(!managerAttended || !attendanceVerifiedStatus);
      
      // Block navigation if team attendance not verified (but allow manager attendance page and dashboard)
      setNavigationBlocked(!attendanceVerifiedStatus);
    }
  }, [user, today, checkAttendanceVerification, checkManagerAttendance, checkPerformanceCompletion, getVerifiedUsers]);

  // Update performance completion status when performance changes
  useEffect(() => {
    if (user && user.role === 'manager' && attendanceVerified) {
      const performanceCompleted = checkPerformanceCompletion();
      setPerformanceMarked(performanceCompleted);
    }
  }, [user, today, attendanceVerified, checkPerformanceCompletion]);

  const value = {
    // State
    attendanceVerified,
    verifiedUsers,
    performanceMarked,
    workflowBlocked,
    navigationBlocked,
    updateTrigger,
    
    // Actions
    verifyAttendance,
    markPerformanceCompleted,
    clearVerificationData,
    refreshVerificationData,
    
    // Checks
    checkManagerAttendance,
    checkAttendanceVerification,
    checkPerformanceCompletion,
    checkTeamPerformanceCompletion,
    getVerifiedUsers,
  };

  return (
    <ManagerWorkflowContext.Provider value={value}>
      {children}
    </ManagerWorkflowContext.Provider>
  );
}

export function useManagerWorkflow() {
  const context = useContext(ManagerWorkflowContext);
  if (!context) {
    throw new Error('useManagerWorkflow must be used within a ManagerWorkflowProvider');
  }
  return context;
}
