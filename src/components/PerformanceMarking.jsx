"use client";

import React, { useState,useEffect } from 'react';
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
  Save
} from "lucide-react";
import { usePerformance } from "@/contexts/PerformanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "sonner";

export default function PerformanceMarking() {
  const { 
    performanceRecords,
    performanceLevels, 
    markDailyPerformance, 
    getTeamPerformance, 
    isPerformanceMarkedToday,
    getPerformanceLevelDetails 
  } = usePerformance();
  const { user: currentUser } = useAuth();
  const { users } = useUsers();
  
  const [userRatings, setUserRatings] = useState({});
  const [userNotes, setUserNotes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingUsers, setSubmittingUsers] = useState(new Set());
  const [justMarkedPerformance, setJustMarkedPerformance] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date(today).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get team members assigned to this manager
  let teamMembers = users?.filter(u => 
    u.role === 'worker' && 
    currentUser?.assignedUsers?.includes(u.id)
  ) || [];

  // If no team members assigned, use mock team members for demonstration
  if (teamMembers.length === 0) {
    teamMembers = [
      { id: 5, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", role: "worker", workerType: "Permanent Clicker" },
      { id: 6, name: "Adnan Amir", email: "adnan.amir@joyapps.net", role: "worker", workerType: "Permanent Viewer" },
      { id: 7, name: "Waleed Bin Shakeel", email: "waleed.shakeel@joyapps.net", role: "worker", workerType: "Trainee Clicker" }
    ];
  }

  // Update team performance when performance records change
  useEffect(() => {
    if (currentUser?.id && teamMembers.length > 0) {
      // Always start with empty array and build from scratch
      let currentPerformance = [];
      
      // Check each team member for existing performance
      teamMembers.forEach((member, index) => {
        const existingPerformance = getTeamPerformance(currentUser.id, today).find(p => p.user.id === member.id);
        
        if (existingPerformance) {
          // Use existing performance
          currentPerformance.push(existingPerformance);
        } else if (index < 2) {
          // Create mock data for first 2 members only
          currentPerformance.push({
            user: { 
              id: member.id, 
              name: member.name,
              workerType: member.workerType 
            }, 
            performance: { 
              rating: index === 0 ? 'excellent' : 'good', 
              markedAt: new Date().toISOString() 
            } 
          });
        }
      });
      
      setTeamPerformance(currentPerformance);
    }
  }, [currentUser?.id, today, teamMembers.length, getTeamPerformance]);

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
  const handleSubmitPerformance = async (userId, rating, notes) => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setSubmittingUsers(prev => new Set(prev).add(userId));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      const user = teamMembers.find(member => member.id === userId);
      console.log('Found user for ID', userId, ':', user);
      
      if (!user) {
        console.error('User not found for ID:', userId);
        toast.error('User not found');
        return;
      }
      
      // Update local teamPerformance state to reflect the new performance
      const newPerformance = {
        user: { 
          id: user.id, 
          name: user.name,
          workerType: user.workerType 
        },
        performance: { 
          rating: rating, 
          markedAt: new Date().toISOString() 
        }
      };
      
      console.log('Saving performance for:', user.name, 'ID:', userId, 'Rating:', rating);
      console.log('Current teamPerformance before save:', teamPerformance);
      
      // Update teamPerformance state immediately (BEFORE markDailyPerformance)
      setTeamPerformance(prev => {
        console.log('Previous teamPerformance in setState:', prev);
        const existingIndex = prev.findIndex(p => p.user.id === userId);
        console.log('Existing index for user', userId, ':', existingIndex);
        
        if (existingIndex >= 0) {
          // Update existing performance
          const updated = [...prev];
          updated[existingIndex] = newPerformance;
          console.log('Updated existing performance for:', user.name, 'New array:', updated);
          return updated;
        } else {
          // Add new performance
          const newArray = [...prev, newPerformance];
          console.log('Added new performance for:', user.name, 'New array:', newArray);
          return newArray;
        }
      });

      // Call markDailyPerformance AFTER state update
      // Temporarily disabled to test if this is causing the issue
      // markDailyPerformance(
      //   userId,
      //   currentUser.id,
      //   currentUser.name,
      //   rating,
      //   notes
      // );
      console.log('Skipping markDailyPerformance for testing');

      // Store the just marked performance for display
      setJustMarkedPerformance({
        worker: user,
        rating: rating,
        notes: notes,
        timestamp: new Date().toISOString()
      });

      // Force a re-render to ensure UI updates
      setTimeout(() => {
        toast.success(`Performance marked for ${user.name}`);
        // Force component to re-render by updating teamPerformance
        setTeamPerformance(prev => {
          console.log('Force re-render triggered, current state:', prev);
          return [...prev];
        });
      }, 100);
      
      // Clear the form for this user
      setUserRatings(prev => ({ ...prev, [userId]: '' }));
      setUserNotes(prev => ({ ...prev, [userId]: '' }));
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

  // Handle notes change
  const handleNotesChange = (userId, notes) => {
    setUserNotes(prev => ({ ...prev, [userId]: notes }));
  };

  // Emoji mapping for performance levels
  const performanceEmojis = {
    excellent: '🌟',
    good: '👍',
    average: '😐',
    bad: '👎',
    worst: '💔'
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
  const filteredTeamMembers = teamMembers.filter(member => {
    const performance = teamPerformance.find(p => p.user.id === member.id)?.performance;
    const currentRating = userRatings[member.id] || '';
    const isMarked = !!performance; // Use teamPerformance data instead of isPerformanceMarkedToday
    
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
    
    // Debug logging
    if (ratingFilter !== 'all' || statusFilter !== 'all') {
      console.log(`Member: ${member.name}, Status: ${isMarked ? 'marked' : 'not_marked'}, Rating Filter: ${ratingFilter}, Performance: ${performance?.rating}, Current: ${currentRating}, Matches: ${result}`);
    }
    
    return result;
  });

  // Get performance stats for today
  const performanceStats = teamPerformance.reduce((stats, member) => {
    if (member.performance) {
      stats.total++;
      stats[member.performance.rating]++;
    }
    return stats;
  }, { total: 0, excellent: 0, good: 0, average: 0, bad: 0, worst: 0 });

  // Calculate marked count for display
  const markedCount = teamPerformance.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Performance Marking</h2>
          <p className="text-gray-600">{todayFormatted}</p>
        
         
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Shift End Performance Review</span>
         
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Quick Stats */}
            {/* <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">Total: <span className="font-medium">{teamMembers.length}</span></span>
              </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">Marked: <span className="font-medium">{performanceStats.total}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-gray-600">Remaining: <span className="font-medium">{teamMembers.length - performanceStats.total}</span></span>
              </div>
            </div> */}

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
                  <TableHead>Current Status</TableHead>
                  <TableHead>Performance Rating</TableHead>
                  <TableHead>Review Notes</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
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
                const performance = teamPerformance.find(p => p.user.id === member.id)?.performance;
                  const isMarked = !!performance; // Use teamPerformance data instead of isPerformanceMarkedToday
                  const isJustMarked = justMarkedPerformance?.worker?.id === member.id;
                  
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
                  const currentNotes = userNotes[member.id] || '';
                
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
                            <p className="text-sm text-gray-500">{member.workerType?.replace('-', ' ') || 'Unknown'}</p>
                      </div>
                    </div>
                      </TableCell>

                      {/* Current Status */}
                      <TableCell>
                        {isMarked && performance ? (
                      <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        <Badge 
                          variant="outline" 
                          className={`${getPerformanceLevelDetails(performance.rating).bgColor} ${getPerformanceLevelDetails(performance.rating).color}`}
                        >
                              {performanceEmojis[performance.rating]} {getPerformanceLevelDetails(performance.rating).label}
                        </Badge>
                        {isJustMarked && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 animate-pulse">
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
                        <div className="flex gap-1">
                {performanceLevels.map((level) => (
                  <Button
                    key={level.value}
                              variant={currentRating === level.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleRatingChange(member.id, level.value)}
                              className={`h-10 w-10 p-0 hover:scale-105 transition-transform ${
                                currentRating === level.value 
                        ? `${level.bgColor} ${level.color} border-current` 
                                  : 'hover:bg-gray-50'
                    }`}
                              disabled={isMarked}
                              title={`${level.label} - ${level.value}`}
                  >
                              <span className="text-lg">{performanceEmojis[level.value]}</span>
                  </Button>
                ))}
              </div>
                      </TableCell>

                      {/* Review Notes */}
                      <TableCell>
              <Textarea
                          value={currentNotes}
                          onChange={(e) => handleNotesChange(member.id, e.target.value)}
                          placeholder="Add review notes..."
                          rows={2}
                          className="w-full min-w-[200px]"
                          disabled={isMarked}
                        />
                      </TableCell>

                      {/* Action */}
                      <TableCell>
                        {!isMarked ? (
              <Button
                            onClick={() => handleSubmitPerformance(member.id, currentRating, currentNotes)}
                            disabled={submittingUsers.has(member.id) || !currentRating}
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
                                Save
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
