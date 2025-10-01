"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  Award,
  AlertCircle,
  X,
  Save,
  UserCheck
} from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useManagerWorkflow } from "@/contexts/ManagerWorkflowContext";
import { useAttendance } from "@/hooks/useAttendance";
import { toast } from "sonner";

export default function PerformanceMarking() {
  const { 
    getPerformanceRecords,
    recordPerformance,
    verifyPerformance,
    getPerformanceStats,
    isLoading: performanceLoading
  } = usePerformance();
  const { user: currentUser } = useAuth();
  const { users } = useUsers();
  const { verifiedUsers, attendanceVerified, markPerformanceCompleted } = useManagerWorkflow();
  const { getAttendanceRecords } = useAttendance();
  
  const [userRatings, setUserRatings] = useState({});
  const [performanceRatings, setPerformanceRatings] = useState({});
  const [performanceInputs, setPerformanceInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingUsers, setSubmittingUsers] = useState(new Set());
  const [justMarkedPerformance, setJustMarkedPerformance] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [markedUsers, setMarkedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  // Backend data states
  const [teamMembers, setTeamMembers] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [backendPerformanceStats, setBackendPerformanceStats] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date(today).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Fetch team members from backend
  const fetchTeamMembers = async () => {
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
  };

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      const attendanceRecords = await getAttendanceRecords(today);
      setAttendanceData(attendanceRecords);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceData([]);
    }
  };

  // Fetch performance data
  const fetchPerformanceData = async () => {
    try {
      const records = await getPerformanceRecords(today);
      const stats = await getPerformanceStats(today);
      setPerformanceRecords(records);
      setBackendPerformanceStats(stats);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setPerformanceRecords([]);
      setBackendPerformanceStats(null);
    }
  };

  // Load all data
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      await Promise.all([
        fetchTeamMembers(),
        fetchAttendanceData(),
        fetchPerformanceData()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser?.id, today]);

  // Helper function to check if a user is a team member (worker/user, but not manager)
  const isTeamMember = (user) => {
    return (user.role === 'worker' || user.role === 'user') && user.role !== 'manager';
  };

  // Get verified team members (those with approved attendance)
  const verifiedTeamMembers = useMemo(() => {
    if (teamMembers.length === 0) return [];
    
    // Get users with approved attendance
    const approvedAttendance = attendanceData.filter(record => 
      record.status === 'approved' || record.status === 'verified'
    );
    const approvedUserIds = approvedAttendance.map(record => record.userId._id);
    
    // Filter team members to only include those with approved attendance
    return teamMembers.filter(member => approvedUserIds.includes(member.id));
  }, [teamMembers, attendanceData]);

  // Debug logging
  console.log('PerformanceMarking Debug:', {
    currentUser: currentUser ? { id: currentUser.id, name: currentUser.name, role: currentUser.role } : null,
    teamMembers: teamMembers.map(m => ({ id: m.id, name: m.name, role: m.role })),
    verifiedTeamMembers: verifiedTeamMembers.map(m => ({ id: m.id, name: m.name })),
    attendanceData: attendanceData.length,
    performanceRecords: performanceRecords.length
  });

  // Update team performance when performance records change
  useEffect(() => {
    if (verifiedTeamMembers.length > 0) {
      // Build performance data from backend records
      let currentPerformance = [];
      let markedUserIds = new Set();
      
      verifiedTeamMembers.forEach((member) => {
        const existingPerformance = performanceRecords.find(p => p.userId._id === member.id);
        
        if (existingPerformance) {
          // Debug logging
          console.log(`Performance record for ${member.name}:`, {
            performanceStatus: existingPerformance.performanceStatus,
            status: existingPerformance.status,
            fullRecord: existingPerformance
          });
          
          // Use existing performance from backend
          currentPerformance.push({
            user: { 
              id: member.id, 
              name: member.name,
              workerType: member.workerType 
            }, 
            performance: {
              rating: existingPerformance.performanceStatus || 'average',
              markedAt: existingPerformance.createdAt
            }
          });
          markedUserIds.add(member.id);
        } else {
          // Add empty performance entry for unmarked members
          currentPerformance.push({
            user: { 
              id: member.id, 
              name: member.name,
              workerType: member.workerType 
            }, 
            performance: null
          });
        }
      });
      
      setTeamPerformance(currentPerformance);
      setMarkedUsers(markedUserIds);
    } else {
      // Clear performance data if no verified team members
      setTeamPerformance([]);
      setMarkedUsers(new Set());
    }
  }, [verifiedTeamMembers, performanceRecords]);


  // Check if all team members have performance marked
  useEffect(() => {
    if (verifiedTeamMembers.length > 0 && teamPerformance.length > 0) {
      const allTeamMembersHavePerformance = verifiedTeamMembers.every(member => {
        const hasPerformance = teamPerformance.some(p => p.user.id === member.id);
        return hasPerformance;
      });
      
      console.log('Team members performance check:', {
        verifiedTeamMembers: verifiedTeamMembers.map(m => ({ id: m.id, name: m.name })),
        teamPerformance: teamPerformance.map(p => ({ id: p.user.id, name: p.user.name })),
        allTeamMembersHavePerformance,
        verifiedTeamMembersCount: verifiedTeamMembers.length,
        teamPerformanceCount: teamPerformance.length
      });
      
      if (allTeamMembersHavePerformance) {
        console.log('Marking performance as completed');
        markPerformanceCompleted();
      }
    }
  }, [verifiedTeamMembers, teamPerformance, markPerformanceCompleted]);

  // Auto-clear just marked performance after 5 seconds
  useEffect(() => {
    if (justMarkedPerformance) {
      const timer = setTimeout(() => {
        setJustMarkedPerformance(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [justMarkedPerformance]);

  // Debug: Track teamPerformance changes
  useEffect(() => {
    console.log('teamPerformance changed:', teamPerformance.map(p => ({ 
      id: p.user.id, 
      name: p.user.name, 
      rating: p.performance?.rating 
    })));
  }, [teamPerformance]);

  // Handle performance submission for individual user
  const handleSubmitPerformance = async (userId, rating, notes, performanceRating, performanceInput) => {
    if (!performanceRating) {
      toast.error("Please select a performance rating");
      return;
    }

    // Validate performance rating for bad/worst ratings
    if ((performanceRating === 'bad' || performanceRating === 'worst') && !performanceInput?.trim()) {
      toast.error("Please provide an explanation for the performance issues");
      return;
    }

    setIsSubmitting(true);
    setSubmittingUsers(prev => new Set(prev).add(userId));
    
    try {
      const user = verifiedTeamMembers.find(member => member.id === userId);
      console.log('Found user for ID', userId, ':', user);
      
      if (!user) {
        console.error('User not found for ID:', userId);
        toast.error('User not found');
        return;
      }
      
      // Convert performance rating to backend format
      let backendRating = 'good';
      if (performanceRating === 'excellent') backendRating = 'excellent';
      else if (performanceRating === 'good') backendRating = 'good';
      else if (performanceRating === 'average') backendRating = 'average';
      else if (performanceRating === 'bad') backendRating = 'bad';
      else if (performanceRating === 'worst') backendRating = 'worst';
      
      // Record performance using backend API
      const performanceData = {
        userId: userId,
        date: today,
        totalClicks: user.goodClicks + user.badClicks || 0,
        goodClicks: user.goodClicks || 0,
        badClicks: user.badClicks || 0,
        dailyTarget: user.dailyTarget || 80,
        performanceStatus: backendRating,
        notes: performanceInput || `Performance rated as ${performanceRating}`
      };
      
      console.log('Saving performance data:', performanceData);
      await recordPerformance(performanceData);
      console.log('Performance saved to backend for user:', userId);

      // Store the just marked performance for display
      setJustMarkedPerformance({
        worker: user,
        rating: performanceRating,
        notes: performanceInput,
        timestamp: new Date().toISOString()
      });

      // Show success message
      toast.success(`Performance marked for ${user.name}`);
      
      // Clear the form for this user
      setPerformanceRatings(prev => ({ ...prev, [userId]: '' }));
      setPerformanceInputs(prev => ({ ...prev, [userId]: '' }));
      
      // Reload performance data
      await fetchPerformanceData();
      
      // Immediately mark user as completed for instant UI update
      setMarkedUsers(prev => new Set(prev).add(userId));
    } catch (error) {
      console.error("Error marking performance:", error);
      toast.error("Failed to mark performance");
    } finally {
      setIsSubmitting(false);
      setSubmittingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Handle rating change
  const handleRatingChange = (userId, rating) => {
    setUserRatings(prev => ({ ...prev, [userId]: rating }));
  };

  // Handle performance rating dropdown change
  const handlePerformanceRatingChange = (userId, rating) => {
    setPerformanceRatings(prev => ({ ...prev, [userId]: rating }));
    // Clear input field when rating changes
    setPerformanceInputs(prev => ({ ...prev, [userId]: '' }));
  };

  // Handle performance input field change
  const handlePerformanceInputChange = (userId, input) => {
    setPerformanceInputs(prev => ({ ...prev, [userId]: input }));
  };


  // Performance rating options
  const performanceLevels = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'good', label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'average', label: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'bad', label: 'Bad', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'worst', label: 'Worst', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  // Emoji mapping for performance levels
  const performanceEmojis = {
    excellent: '🌟',
    good: '👍',
    average: '😐',
    bad: '👎',
    worst: '💔'
  };

  // Get performance level details
  const getPerformanceLevelDetails = (rating) => {
    return performanceLevels.find(level => level.value === rating) || performanceLevels[2]; // Default to average
  };

  // Debug: Log current filter values
  console.log('🔍 Filter Debug:', {
    searchTerm,
    statusFilter,
    ratingFilter,
    teamMembersCount: teamMembers.length,
    teamMembers: teamMembers.map(m => ({ id: m.id, name: m.name })),
    teamPerformanceCount: teamPerformance.length,
    teamPerformance: teamPerformance.map(p => ({ userId: p.user.id, name: p.user.name, rating: p.performance?.rating }))
  });

  // Filter team members based on search and filters
  const filteredTeamMembers = useMemo(() => {
    return verifiedTeamMembers.filter(member => {
      const performance = teamPerformance.find(p => p.user.id === member.id)?.performance;
      const currentRating = performanceRatings[member.id] || '';
      const isMarked = !!performance || markedUsers.has(member.id);
      
      // Search filter
      const matchesSearch = searchTerm === '' || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.workerType?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'marked') {
        matchesStatus = isMarked;
      } else if (statusFilter === 'not_marked') {
        matchesStatus = !isMarked;
      }
      
      // Rating filter
      let matchesRating = true;
      if (ratingFilter !== 'all') {
        // Check both saved performance and current form rating
        const hasRating = performance?.rating || currentRating;
        matchesRating = hasRating === ratingFilter;
      }
      
      const result = matchesSearch && matchesStatus && matchesRating;
      
      return result;
    });
  }, [verifiedTeamMembers, teamPerformance, performanceRatings, markedUsers, searchTerm, statusFilter, ratingFilter]);

  // Get performance stats for today
  const performanceStats = useMemo(() => {
    return teamPerformance.reduce((stats, member) => {
      if (member.performance) {
        stats.total++;
        stats[member.performance.rating]++;
      }
      return stats;
    }, { total: 0, excellent: 0, good: 0, average: 0, bad: 0, worst: 0 });
  }, [teamPerformance]);

  // Calculate marked count for display
  const markedCount = teamPerformance.length;

  // Show loading state
  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading performance data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if no verified team members
  if (verifiedTeamMembers.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">No Verified Team Members</CardTitle>
            </div>
            <CardDescription className="text-yellow-700">
              No verified team members are available for performance marking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-600">
              Team members must be verified for attendance before they can appear in performance marking.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Performance Marking</h2>
          <p className="text-gray-600">{todayFormatted}</p>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredTeamMembers.length} of {verifiedTeamMembers.length} verified team members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('Manual refresh triggered');
              loadData();
            }}
          >
            Refresh Data
          </Button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Shift End Performance Review</span>
          </div>
        </div>
      </div>

      {/* Verified Users Display */}
      {verifiedUsers && verifiedUsers.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">Verified Team Members</CardTitle>
              </div>
            <CardDescription className="text-green-700">
              The following team members have been verified for attendance today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {verifiedUsers.map(userId => {
                const user = teamMembers.find(m => m.id === userId);
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
            <p className="text-sm text-green-600 mt-2">
              {verifiedUsers.length} team member{verifiedUsers.length !== 1 ? 's' : ''} verified
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <Label htmlFor="search">Search Team Members</Label>
                <Input
                  id="search"
                  placeholder="Search by name or worker type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="marked">Marked</SelectItem>
                    <SelectItem value="not_marked">Not Marked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="sm:w-48">
                <Label htmlFor="rating-filter">Rating</Label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    {performanceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {performanceEmojis[level.value]} {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Performance Marking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Daily Performance Marking
          </CardTitle>
          <CardDescription>
            Rate each team member's performance for today's shift
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Daily Target</TableHead>
                  <TableHead>Target Achievement</TableHead>
                  <TableHead>Account Locks</TableHead>
                  <TableHead>Performance Status</TableHead>
                  <TableHead>Performance Rating</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">No team members found matching your criteria</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setRatingFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeamMembers.map((member) => {
                  const performanceData = teamPerformance.find(p => p.user.id === member.id);
                  const performance = performanceData?.performance;
                  const isMarked = !!performance || markedUsers.has(member.id); // Use teamPerformance data or markedUsers for immediate update
                  const isJustMarked = justMarkedPerformance?.worker?.id === member.id;
                  
                  // If user is marked but no performance data found, create a temporary one for display
                  const displayPerformance = performance || (markedUsers.has(member.id) ? {
                    rating: justMarkedPerformance?.worker?.id === member.id ? justMarkedPerformance.rating : 'good', // Default to 'good' if no specific rating
                    markedAt: justMarkedPerformance?.worker?.id === member.id ? justMarkedPerformance.timestamp : new Date().toISOString()
                  } : null);
                  
                  // Debug logging for performance data
                  console.log(`Member ${member.name} (${member.id}):`, {
                    performance,
                    displayPerformance,
                    isMarked,
                    markedUsers: markedUsers.has(member.id),
                    teamPerformance: teamPerformance.find(p => p.user.id === member.id),
                    justMarkedPerformance: justMarkedPerformance?.worker?.id === member.id ? justMarkedPerformance : null
                  });
                  
                  // Debug logging
                  if (member.id === 7) { // Debug for Waleed Bin Shakeel
                    console.log('Debug for member', member.name, {
                      performance,
                      isMarked,
                      isJustMarked,
                      teamPerformance: teamPerformance.map(p => ({ id: p.user.id, rating: p.performance?.rating }))
                    });
                  }
                  const currentRating = userRatings[member.id] || '';
                
                return (
                    <TableRow 
                    key={member.id}
                      className={`${isJustMarked ? 'bg-green-50 border-green-200 ring-2 ring-green-300' : ''} ${isMarked ? 'bg-blue-50' : ''}`}
                    >
                      {/* Team Member */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                              {member.name?.split(' ').map(n => n[0] || '').join('') || '??'}
                        </span>
                      </div>
                          <div>
                            <p className="font-medium">{member.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{member.phone || 'No phone'}</p>
                      </div>
                    </div>
                      </TableCell>

                      {/* Daily Target */}
                      <TableCell>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {member.dailyTarget || 80}
                          </div>
                          <div className="text-xs text-gray-500">target</div>
                        </div>
                      </TableCell>

                      {/* Target Achievement */}
                      <TableCell>
                        <div className="text-center space-y-1">
                          <div className={`text-lg font-semibold ${
                            (member.goodClicks || 0) >= (member.dailyTarget || 80)
                              ? 'text-green-600' 
                              : (member.goodClicks || 0) >= ((member.dailyTarget || 80) * 0.8)
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                          }`}>
                            {member.goodClicks || 0}
                          </div>
                          <div className={`text-xs ${
                            (member.goodClicks || 0) >= (member.dailyTarget || 80)
                              ? 'text-green-500' 
                              : (member.goodClicks || 0) >= ((member.dailyTarget || 80) * 0.8)
                                ? 'text-yellow-500' 
                                : 'text-red-500'
                          }`}>
                            {Math.round(((member.goodClicks || 0) / (member.dailyTarget || 80)) * 100)}%
                          </div>
                          <div className="text-xs text-gray-600 border-t pt-1">
                            <div className="flex justify-center gap-2">
                              <span className="text-green-600">✓{member.goodClicks || 0}</span>
                              <span className="text-gray-400">+</span>
                              <span className="text-red-600">✗{member.badClicks || 0}</span>
                              <span className="text-gray-400">=</span>
                              <span className="font-medium">{(member.goodClicks || 0) + (member.badClicks || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Account Locks */}
                      <TableCell>
                        <div className="text-center">
                          <div className={`text-lg font-semibold ${
                            member.locked === 'unlocked' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {member.locked === 'unlocked' ? '0' : '1'}
                          </div>
                          <div className="text-xs text-gray-500">times</div>
                        </div>
                      </TableCell>

                      {/* Performance Status */}
                      <TableCell>
                        {isMarked && displayPerformance ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <Badge 
                              variant="outline" 
                              className={`${getPerformanceLevelDetails(displayPerformance.rating).bgColor} ${getPerformanceLevelDetails(displayPerformance.rating).color}`}
                            >
                              {performanceEmojis[displayPerformance.rating]} {getPerformanceLevelDetails(displayPerformance.rating).label}
                            </Badge>
                            {isJustMarked && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 animate-pulse text-xs">
                                Just Saved
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">
                            Not Marked
                          </Badge>
                        )}
                      </TableCell>

                      {/* Performance Rating */}
                      <TableCell>
                        <div className="space-y-2">
                          {/* Performance Rating Dropdown */}
                          <Select
                            value={performanceRatings[member.id] || ''}
                            onValueChange={(value) => handlePerformanceRatingChange(member.id, value)}
                            disabled={isMarked}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent>
                              {performanceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{performanceEmojis[level.value]}</span>
                                    <span>{level.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {/* Conditional Input Field for Bad/Worst ratings */}
                          {(performanceRatings[member.id] === 'bad' || performanceRatings[member.id] === 'worst') && (
                            <Input
                              value={performanceInputs[member.id] || ''}
                              onChange={(e) => handlePerformanceInputChange(member.id, e.target.value)}
                              placeholder="Please explain the performance issues..."
                              className="w-full"
                              disabled={isMarked}
                            />
                          )}
                        </div>
                      </TableCell>


                      {/* Action */}
                      <TableCell>
                        {!isMarked ? (
              <Button
                            onClick={() => handleSubmitPerformance(
                              member.id, 
                              performanceRatings[member.id], 
                              '', 
                              performanceRatings[member.id], 
                              performanceInputs[member.id]
                            )}
                            disabled={submittingUsers.has(member.id) || !performanceRatings[member.id]}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                          >
                            {submittingUsers.has(member.id) ? (
                              <>
                                <Clock className="h-4 w-4 animate-spin mr-1" />
                                Saving...
                  </>
                ) : (
                  <>
                                <Save className="h-4 w-4 mr-1" />
                                Completed
                  </>
                )}
              </Button>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {isJustMarked ? 'Just Saved' : 'Completed'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                  })
                )}
              </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>

      {/* Just Marked Performance Display */}
      {justMarkedPerformance && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <CardTitle>Performance Marked Successfully</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setJustMarkedPerformance(null)}
                className="text-green-600 hover:text-green-800 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-green-700">
              Latest performance rating has been recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-800">
                    {justMarkedPerformance.worker.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {justMarkedPerformance.worker.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {justMarkedPerformance.worker.workerType?.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge 
                  variant="outline" 
                  className={`${getPerformanceLevelDetails(justMarkedPerformance.rating).bgColor} ${getPerformanceLevelDetails(justMarkedPerformance.rating).color} text-lg px-4 py-2`}
                >
                  {performanceEmojis[justMarkedPerformance.rating]} {getPerformanceLevelDetails(justMarkedPerformance.rating).label}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(justMarkedPerformance.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-gray-400">Just now</p>
                </div>
              </div>
            </div>
            {justMarkedPerformance.notes && (
              <div className="mt-3 p-3 bg-white rounded border border-green-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Notes:</span> {justMarkedPerformance.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Today's Performance Summary */}
      {teamPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Today's Performance Summary
            </CardTitle>
            <CardDescription>
              Performance ratings marked for today's shift
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamPerformance.map((member) => {
                if (!member.performance) return null;
                
                const levelDetails = getPerformanceLevelDetails(member.performance.rating);
                
                return (
                  <div key={member.user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-gray-500">{member.user.workerType?.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`${levelDetails.bgColor} ${levelDetails.color}`}
                      >
                        {performanceEmojis[member.performance.rating]} {levelDetails.label}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(member.performance.markedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Performance Marked Message */}
    
    </div>
  );
}
