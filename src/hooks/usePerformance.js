import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function usePerformance() {
  const [isLoading, setIsLoading] = useState(false);

  // Get performance records
  const getPerformanceRecords = useCallback(async (date = null, userId = null) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (userId) params.append('userId', userId);

      const response = await fetch(`/api/performance?${params.toString()}`, {
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
        throw new Error(result.error || 'Failed to fetch performance records');
      }
    } catch (error) {
      console.error('Error fetching performance records:', error);
      toast.error('Failed to load performance data');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Record performance
  const recordPerformance = useCallback(async (data) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Performance recorded successfully');
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to record performance');
      }
    } catch (error) {
      console.error('Error recording performance:', error);
      toast.error(error.message || 'Failed to record performance');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify performance
  const verifyPerformance = useCallback(async (performanceId, action, verificationNotes = '') => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/performance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          performanceId,
          action,
          verificationNotes
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Performance ${action}d successfully`);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to verify performance');
      }
    } catch (error) {
      console.error('Error verifying performance:', error);
      toast.error(error.message || 'Failed to verify performance');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get performance statistics
  const getPerformanceStats = useCallback(async (date = null, userId = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (userId) params.append('userId', userId);

      const response = await fetch(`/api/performance/stats?${params.toString()}`, {
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
        throw new Error(result.error || 'Failed to fetch performance stats');
      }
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      return null;
    }
  }, []);

  return {
    isLoading,
    getPerformanceRecords,
    recordPerformance,
    verifyPerformance,
    getPerformanceStats
  };
}

