"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useUsers } from './UsersContext';

const PerformanceContext = createContext();

export function usePerformance() {
  return useContext(PerformanceContext);
}

export function PerformanceProvider({ children }) {
  const [performanceRecords, setPerformanceRecords] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { users } = useUsers();

  // Performance rating options
  const performanceLevels = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'good', label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'average', label: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'bad', label: 'Bad', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'worst', label: 'Worst', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('performanceRecords');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setPerformanceRecords(parsed);
      } else {
        // Add some sample data for testing
        const today = new Date().toISOString().split('T')[0];
        const sampleData = {
          [today]: {
            1: { // Hasan Abbas
              workerId: 1,
              managerId: 2,
              managerName: "Muhammad Shahood",
              rating: "excellent",
              notes: "Great work today!",
              date: today,
              markedAt: new Date().toISOString()
            }
          }
        };
        setPerformanceRecords(sampleData);
      }
    } catch (error) {
      console.error('Error loading performance data:', error);
      localStorage.removeItem('performanceRecords');
      setPerformanceRecords({});
    }
  }, []);

  // Save to localStorage whenever performanceRecords changes
  useEffect(() => {
    if (Object.keys(performanceRecords).length > 0) {
      localStorage.setItem('performanceRecords', JSON.stringify(performanceRecords));
    }
  }, [performanceRecords]);

  // Mark daily performance for a worker
  const markDailyPerformance = (workerId, managerId, managerName, rating, notes = '', performanceRating = null, performanceInput = '') => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord = {
      workerId,
      managerId,
      managerName,
      rating,
      notes,
      performanceRating,
      performanceInput,
      date: today,
      markedAt: new Date().toISOString()
    };

    console.log('markDailyPerformance called:', { workerId, managerId, managerName, rating, notes });

    setPerformanceRecords(prev => {
      const newRecords = {
        ...prev,
        [today]: {
          ...prev[today],
          [workerId]: newRecord
        }
      };
      console.log('Performance records updated:', newRecords);
      return newRecords;
    });

    // Save to localStorage immediately
    const savedData = JSON.parse(localStorage.getItem('performanceRecords') || '{}');
    savedData[today] = {
      ...savedData[today],
      [workerId]: newRecord
    };
    localStorage.setItem('performanceRecords', JSON.stringify(savedData));
  };

  // Get performance for a specific worker on a specific date
  const getWorkerPerformance = (workerId, date) => {
    return performanceRecords[date]?.[workerId] || null;
  };

  // Get all performance records for a specific date
  const getPerformanceForDate = (date) => {
    return performanceRecords[date] ? Object.values(performanceRecords[date]) : [];
  };

  // Get performance records for a manager's team
  const getTeamPerformance = (managerId, date) => {
    const manager = users.find(u => u.id === managerId);
    if (!manager || !manager.assignedUsers) {
      console.log('getTeamPerformance - No manager or assignedUsers:', { managerId, manager: !!manager, assignedUsers: manager?.assignedUsers });
      return [];
    }

    const teamMembers = manager.assignedUsers.map(assignedId =>
      users.find(u => u.id === assignedId)
    ).filter(Boolean);

    const dayRecords = performanceRecords[date] || {};
    console.log('getTeamPerformance - Day records:', dayRecords);
    console.log('getTeamPerformance - Team members:', teamMembers.map(m => ({ id: m.id, name: m.name })));

    const result = teamMembers.map(member => {
      // Find performance record by workerId
      const performanceRecord = Object.values(dayRecords).find(record => 
        record.workerId === member.id
      );
      
      console.log(`getTeamPerformance - Member ${member.name} (${member.id}):`, { performanceRecord });
      
      return {
        user: member,
        performance: performanceRecord || null
      };
    });

    console.log('getTeamPerformance - Result:', result);
    return result;
  };

  // Get performance statistics for a worker over a period
  const getWorkerPerformanceStats = (workerId, days = 30) => {
    const stats = {
      totalDays: 0,
      excellent: 0,
      good: 0,
      average: 0,
      bad: 0,
      worst: 0,
      averageRating: 0
    };

    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const record = performanceRecords[dateStr]?.[workerId];
      if (record) {
        stats.totalDays++;
        stats[record.rating]++;
      }
    }

    // Calculate average rating (excellent=5, good=4, average=3, bad=2, worst=1)
    const ratingValues = { excellent: 5, good: 4, average: 3, bad: 2, worst: 1 };
    const totalScore = stats.excellent * 5 + stats.good * 4 + stats.average * 3 + stats.bad * 2 + stats.worst * 1;
    stats.averageRating = stats.totalDays > 0 ? (totalScore / stats.totalDays).toFixed(1) : 0;

    return stats;
  };

  // Get performance history for a worker
  const getWorkerPerformanceHistory = (workerId, days = 30) => {
    const history = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const record = performanceRecords[dateStr]?.[workerId];
      if (record) {
        history.push({
          date: dateStr,
          rating: record.rating,
          notes: record.notes,
          markedAt: record.markedAt
        });
      }
    }

    return history;
  };

  // Check if performance has been marked for today
  const isPerformanceMarkedToday = (workerId) => {
    const today = new Date().toISOString().split('T')[0];
    return !!performanceRecords[today]?.[workerId];
  };

  // Get performance level details
  const getPerformanceLevelDetails = (rating) => {
    return performanceLevels.find(level => level.value === rating) || performanceLevels[2]; // Default to average
  };

  const value = {
    performanceRecords,
    performanceLevels,
    markDailyPerformance,
    getWorkerPerformance,
    getPerformanceForDate,
    getTeamPerformance,
    getWorkerPerformanceStats,
    getWorkerPerformanceHistory,
    isPerformanceMarkedToday,
    getPerformanceLevelDetails,
    isLoading
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}
