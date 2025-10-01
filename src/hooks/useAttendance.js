import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Get authentication token
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Mark attendance
  const markAttendance = async (checkIn, checkOut = null, notes = '') => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
          notes
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setAttendance(result.data);
        setIsOnline(true);
        toast.success('Attendance marked successfully!');
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error.message || 'Failed to mark attendance');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get attendance status
  const getAttendanceStatus = async (date = null) => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const url = date 
        ? `/api/attendance/status?date=${date}`
        : '/api/attendance/status';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setAttendance(result.data);
        setIsOnline(result.data.isOnline);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to get attendance status');
      }
    } catch (error) {
      console.error('Error getting attendance status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update online status (heartbeat)
  const updateActivity = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await fetch('/api/attendance/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'heartbeat'
        })
      });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  // Manual checkout
  const checkout = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/attendance/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'checkout'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsOnline(false);
        toast.success('Checkout recorded successfully!');
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to checkout');
      }
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error(error.message || 'Failed to checkout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Manual checkin for new session
  const checkin = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/attendance/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'checkin'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsOnline(true);
        toast.success('Check-in recorded successfully!');
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to checkin');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error(error.message || 'Failed to checkin');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get attendance records
  const getAttendanceRecords = async (date = null, userId = null) => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      let url = '/api/attendance';
      const params = new URLSearchParams();
      
      if (date) params.append('date', date);
      if (userId) params.append('userId', userId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to get attendance records');
      }
    } catch (error) {
      console.error('Error getting attendance records:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify attendance (for managers)
  const verifyAttendance = async (attendanceId, action, notes = '') => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attendanceId,
          action,
          notes
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Attendance ${action}d successfully!`);
        return result.data;
      } else {
        throw new Error(result.error || `Failed to ${action} attendance`);
      }
    } catch (error) {
      console.error(`Error ${action}ing attendance:`, error);
      toast.error(error.message || `Failed to ${action} attendance`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get attendance statistics
  const getAttendanceStats = async (date = null, startDate = null, endDate = null) => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      let url = '/api/attendance/stats';
      const params = new URLSearchParams();
      
      if (date) params.append('date', date);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to get attendance statistics');
      }
    } catch (error) {
      console.error('Error getting attendance statistics:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set up heartbeat interval
  useEffect(() => {
    if (isOnline) {
      const interval = setInterval(() => {
        updateActivity();
      }, 5 * 60 * 1000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isOnline]);

  // Check if attendance is marked for today
  const isAttendanceMarkedToday = () => {
    if (!attendance) return false;
    return attendance.hasAttendance && attendance.status !== 'not_marked';
  };

  return {
    attendance,
    isLoading,
    isOnline,
    markAttendance,
    getAttendanceStatus,
    updateActivity,
    checkout,
    checkin,
    getAttendanceRecords,
    verifyAttendance,
    getAttendanceStats,
    isAttendanceMarkedToday
  };
};

