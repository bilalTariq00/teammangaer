"use client";

import React, { useState,useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  Award,
  AlertCircle,
  X
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
  
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedRating, setSelectedRating] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justMarkedPerformance, setJustMarkedPerformance] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date(today).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get team members assigned to this manager
  const teamMembers = currentUser?.assignedUsers ? 
    currentUser.assignedUsers.map(assignedId => 
      users.find(u => u.id === assignedId)
    ).filter(Boolean) : [];

  // Update team performance when performance records change
  useEffect(() => {
    if (currentUser?.id) {
      const performance = getTeamPerformance(currentUser.id, today);
      setTeamPerformance(performance);
    }
  }, [currentUser?.id, today, performanceRecords, getTeamPerformance]);

  // Auto-clear just marked performance after 10 seconds
  useEffect(() => {
    if (justMarkedPerformance) {
      const timer = setTimeout(() => {
        setJustMarkedPerformance(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [justMarkedPerformance]);

  // Handle performance submission
  const handleSubmitPerformance = async () => {
    if (!selectedWorker || !selectedRating) {
      toast.error("Please select a worker and rating");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      markDailyPerformance(
        selectedWorker.id,
        currentUser.id,
        currentUser.name,
        selectedRating,
        notes
      );

      // Store the just marked performance for display
      setJustMarkedPerformance({
        worker: selectedWorker,
        rating: selectedRating,
        notes: notes,
        timestamp: new Date().toISOString()
      });

      toast.success(`Performance marked for ${selectedWorker.name}`);
      
      // Reset form
      setSelectedWorker(null);
      setSelectedRating('');
      setNotes('');
    } catch (error) {
      console.error("Error marking performance:", error);
      toast.error("Failed to mark performance");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get performance stats for today
  const performanceStats = teamPerformance.reduce((stats, member) => {
    if (member.performance) {
      stats.total++;
      stats[member.performance.rating]++;
    }
    return stats;
  }, { total: 0, excellent: 0, good: 0, average: 0, bad: 0, worst: 0 });

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

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">Team Members</p>
                <p className="text-2xl font-bold text-blue-900">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-green-700">Marked Today</p>
                <p className="text-2xl font-bold text-green-900">{performanceStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {performanceLevels.map((level) => (
          <Card key={level.value} className={`${level.bgColor} border-current`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className={`h-4 w-4 ${level.color}`} />
                <div>
                  <p className={`text-sm ${level.color}`}>{level.label}</p>
                  <p className="text-2xl font-bold">{performanceStats[level.value] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Marking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mark Performance
          </CardTitle>
          <CardDescription>
            Select a team member and rate their performance for today's shift
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Worker Selection */}
          <div className="space-y-2">
            <Label htmlFor="worker">Select Team Member</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {teamMembers.map((member) => {
                const isMarked = isPerformanceMarkedToday(member.id);
                const performance = teamPerformance.find(p => p.user.id === member.id)?.performance;
                const isJustMarked = justMarkedPerformance?.worker.id === member.id;
                
                return (
                  <Button
                    key={member.id}
                    variant={selectedWorker?.id === member.id ? "default" : "outline"}
                    onClick={() => setSelectedWorker(member)}
                    className={`h-auto p-4 flex flex-col items-start gap-2 ${
                      isJustMarked ? 'bg-green-100 border-green-300 ring-2 ring-green-200' : 
                      isMarked ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.workerType?.replace('-', ' ')}</p>
                      </div>
                      {isMarked && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    {performance && (
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${getPerformanceLevelDetails(performance.rating).bgColor} ${getPerformanceLevelDetails(performance.rating).color}`}
                        >
                          {getPerformanceLevelDetails(performance.rating).label}
                        </Badge>
                        {isJustMarked && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Just Marked
                          </Badge>
                        )}
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Rating Selection */}
          {selectedWorker && (
            <div className="space-y-3">
              <Label>Performance Rating</Label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {performanceLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={selectedRating === level.value ? "default" : "outline"}
                    onClick={() => setSelectedRating(level.value)}
                    className={`h-auto p-4 flex flex-col items-center gap-2 ${
                      selectedRating === level.value 
                        ? `${level.bgColor} ${level.color} border-current` 
                        : ''
                    }`}
                  >
                    <Star className={`h-5 w-5 ${level.color}`} />
                    <span className="font-medium">{level.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedWorker && selectedRating && (
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific feedback or observations..."
                rows={3}
              />
            </div>
          )}

          {/* Submit Button */}
          {selectedWorker && selectedRating && (
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitPerformance}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Marking Performance...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Mark Performance
                  </>
                )}
              </Button>
            </div>
          )}
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
                  {getPerformanceLevelDetails(justMarkedPerformance.rating).label}
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
                        {levelDetails.label}
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
      {teamPerformance.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance Marked Today</h3>
            <p className="text-gray-500">
              Start marking performance for your team members to track their daily progress.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
