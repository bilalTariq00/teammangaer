"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with sample data for testing
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const sampleData = {
      [today]: {
        // Sample worker attendance for testing
        3: { // Abid - Permanent Clicker (assigned to manager)
          userId: 3,
          name: "Abid Ali",
          role: "worker",
          workerType: "permanent-clicker",
          status: "marked", // Pending approval
          markedBy: "self",
          markedAt: new Date().toISOString(),
          checkIn: "09:00",
          checkOut: "17:00",
          hours: 8,
          notes: "Regular working day"
        },
        5: { // Hasan - Permanent Clicker (assigned to manager)
          userId: 5,
          name: "Hasan Abbas",
          role: "worker",
          workerType: "permanent-clicker",
          status: "marked", // Pending approval
          markedBy: "self",
          markedAt: new Date().toISOString(),
          checkIn: "08:45",
          checkOut: "17:15",
          hours: 8.5,
          notes: "Early start, stayed late"
        },
        7: { // Waleed - Trainee Viewer (assigned to manager)
          userId: 7,
          name: "Waleed Bin Shakeel",
          role: "worker",
          workerType: "trainee-viewer",
          status: "marked", // Pending approval
          markedBy: "self",
          markedAt: new Date().toISOString(),
          checkIn: "09:15",
          checkOut: "16:45",
          hours: 7.5,
          notes: "Trainee day, learning new tasks"
        },
        // Sample approved attendance
        1: { // Another worker - already approved
          userId: 1,
          name: "Muhammad Shahood",
          role: "worker",
          workerType: "permanent-viewer",
          status: "approved",
          markedBy: "self",
          markedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          approvedBy: "manager",
          approvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          checkIn: "08:30",
          checkOut: "17:30",
          hours: 9,
          notes: "Full day of work",
          approvalNotes: "Good attendance, approved"
        }
      }
    };
    setAttendanceRecords(sampleData);
  }, []);

  // Mark attendance (for workers, managers, QC)
  const markAttendance = (userId, userData, attendanceData) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord = {
      userId,
      name: userData.name,
      role: userData.role,
      workerType: userData.workerType,
      status: attendanceData.status || "present", // Default to present when explicitly marked
      markedBy: "self",
      markedAt: new Date().toISOString(),
      ...attendanceData
    };

    setAttendanceRecords(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        [userId]: newRecord
      }
    }));

    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
    savedData[today] = {
      ...savedData[today],
      [userId]: newRecord
    };
    localStorage.setItem('attendanceRecords', JSON.stringify(savedData));
  };

  // Approve/reject attendance (for managers)
  const approveAttendance = (userId, date, action, notes = '') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [userId]: {
          ...prev[date][userId],
          status: action, // approved or rejected
          approvedBy: "manager",
          approvedAt: new Date().toISOString(),
          approvalNotes: notes
        }
      }
    }));

    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
    if (savedData[date] && savedData[date][userId]) {
      savedData[date][userId] = {
        ...savedData[date][userId],
        status: action,
        approvedBy: "manager",
        approvedAt: new Date().toISOString(),
        approvalNotes: notes
      };
      localStorage.setItem('attendanceRecords', JSON.stringify(savedData));
    }
  };

  // Get attendance for a specific date
  const getAttendanceForDate = (date) => {
    return attendanceRecords[date] || {};
  };

  // Get attendance for a user
  const getUserAttendance = (userId, startDate, endDate) => {
    const userRecords = {};
    Object.keys(attendanceRecords).forEach(date => {
      if (date >= startDate && date <= endDate && attendanceRecords[date][userId]) {
        userRecords[date] = attendanceRecords[date][userId];
      }
    });
    return userRecords;
  };

  // Get team attendance (for managers)
  const getTeamAttendance = (teamUserIds, date) => {
    const dayRecords = attendanceRecords[date] || {};
    return teamUserIds.map(userId => dayRecords[userId]).filter(Boolean);
  };

  // Get all attendance for HR
  const getAllAttendance = (date) => {
    const dayRecords = attendanceRecords[date] || {};
    return Object.values(dayRecords);
  };

  // Get attendance statistics
  const getAttendanceStats = (date) => {
    const dayRecords = attendanceRecords[date] || {};
    const records = Object.values(dayRecords);
    
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present' || r.status === 'marked' || r.status === 'approved').length,
      absent: records.filter(r => r.status === 'absent' || r.status === 'rejected').length,
      marked: records.filter(r => r.status === 'marked').length,
      approved: records.filter(r => r.status === 'approved').length,
      rejected: records.filter(r => r.status === 'rejected').length,
      workers: records.filter(r => r.role === 'worker').length,
      managers: records.filter(r => r.role === 'manager').length,
      qc: records.filter(r => r.role === 'qc').length
    };

    return stats;
  };

  // Mark user as absent if they haven't marked present by end of day
  const markAbsentIfNotPresent = (userId, userData, date) => {
    const dayRecords = attendanceRecords[date] || {};
    if (!dayRecords[userId]) {
      const absentRecord = {
        userId,
        name: userData.name,
        role: userData.role,
        workerType: userData.workerType,
        status: "absent",
        markedBy: "system",
        markedAt: new Date().toISOString(),
        checkIn: null,
        checkOut: null,
        hours: 0,
        notes: "Automatically marked absent - no attendance marked"
      };

      setAttendanceRecords(prev => ({
        ...prev,
        [date]: {
          ...prev[date],
          [userId]: absentRecord
        }
      }));

      // Save to localStorage
      const savedData = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
      savedData[date] = {
        ...savedData[date],
        [userId]: absentRecord
      };
      localStorage.setItem('attendanceRecords', JSON.stringify(savedData));
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('attendanceRecords');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAttendanceRecords(parsed);
      } catch (error) {
        console.error('Error loading attendance data:', error);
        // Clear corrupted data
        localStorage.removeItem('attendanceRecords');
        setAttendanceRecords({});
      }
    }
  }, []);

  const value = {
    attendanceRecords,
    markAttendance,
    approveAttendance,
    getAttendanceForDate,
    getUserAttendance,
    getTeamAttendance,
    getAllAttendance,
    getAttendanceStats,
    markAbsentIfNotPresent,
    isLoading
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
