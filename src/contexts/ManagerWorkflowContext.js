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

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Check if manager has marked their own attendance
  const checkManagerAttendance = () => {
    if (!user || user.role !== 'manager') return false;
    
    // Check if manager has marked attendance today
    const managerAttendance = localStorage.getItem(`attendance_${user.id}_${today}`);
    return !!managerAttendance;
  };

  // Check attendance verification status
  const checkAttendanceVerification = () => {
    if (!user || user.role !== 'manager') return false;
    
    const verificationKey = `attendance_verified_${user.id}_${today}`;
    const verified = localStorage.getItem(verificationKey);
    return verified === 'true';
  };

  // Get verified users (users whose attendance has been verified)
  const getVerifiedUsers = () => {
    if (!user || user.role !== 'manager') return [];
    
    const verificationKey = `verified_users_${user.id}_${today}`;
    const stored = localStorage.getItem(verificationKey);
    return stored ? JSON.parse(stored) : [];
  };

  // Check if all verified users have performance marked
  const checkPerformanceCompletion = () => {
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
  };

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
    if (!user || user.role !== 'manager') return;
    
    const verificationKey = `attendance_verified_${user.id}_${today}`;
    const usersKey = `verified_users_${user.id}_${today}`;
    
    localStorage.setItem(verificationKey, 'true');
    localStorage.setItem(usersKey, JSON.stringify(userIds));
    
    setAttendanceVerified(true);
    setVerifiedUsers(userIds);
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
  }, [user, today]);

  // Update performance completion status when performance changes
  useEffect(() => {
    if (user && user.role === 'manager' && attendanceVerified) {
      const performanceCompleted = checkPerformanceCompletion();
      setPerformanceMarked(performanceCompleted);
    }
  }, [user, today, attendanceVerified]);

  const value = {
    // State
    attendanceVerified,
    verifiedUsers,
    performanceMarked,
    workflowBlocked,
    navigationBlocked,
    
    // Actions
    verifyAttendance,
    markPerformanceCompleted,
    
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
