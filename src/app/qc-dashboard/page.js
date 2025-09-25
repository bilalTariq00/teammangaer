"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QCMainLayout from "@/components/layout/QCMainLayout";
import { Card, CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  CheckCircle, 
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";

const quickDateRanges = [
  "Today",
  "Yesterday", 
  "Last 7 Days",
  "Last 30 Days",
  "All Time"
];

// Mock data for QC stats - this would come from API based on date range
const getQCStats = (selectedRange) => {
  // Base data for different time ranges
  const rangeMultipliers = {
    "Today": 0.8,
    "Yesterday": 0.6,
    "Last 7 Days": 0.5,
    "Last 30 Days": 1.0,
    "All Time": 1.2
  };

  const multiplier = rangeMultipliers[selectedRange] || 1;
  
  // Add some daily variation for more realistic data
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Weekend activity is typically lower
  const weekendMultiplier = isWeekend ? 0.7 : 1;
  
  // Add some random variation (±5%) for more realistic data
  const randomVariation = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
  
  const finalMultiplier = multiplier * weekendMultiplier * randomVariation;
  
  return {
    totalTasks: Math.round(12 * finalMultiplier),
    pendingTasks: Math.round(6 * finalMultiplier),
    inProgressTasks: Math.round(3 * finalMultiplier),
    completedTasks: Math.round(3 * finalMultiplier),
    highPriorityTasks: Math.round(4 * finalMultiplier),
    averageCompletionTime: 2.5,
    qualityScore: 94.2,
    workersReviewed: Math.round(8 * finalMultiplier)
  };
};

export default function QCDashboard() {
  const { user } = useAuth();
  const { isAttendanceMarkedToday } = useAttendance();
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState("Today");
  const [isLoading, setIsLoading] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Check if attendance is marked for today
  useEffect(() => {
    if (user && (user.role === 'qc' || user.role === 'manager')) {
      const attendanceMarked = isAttendanceMarkedToday(user.id);
      
      if (!attendanceMarked) {
        setShowAttendanceModal(true);
      }
    }
  }, [user, isAttendanceMarkedToday]);

  // Get QC stats based on selected range
  const qcStats = getQCStats(selectedRange);

  const handleQuickRange = (range) => {
    setSelectedRange(range);
  };

  const handleShowData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedRange("Today");
  };

  // Show attendance modal if attendance is not marked for today
  if (showAttendanceModal) {
    return (
      <QCMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Mark Your Attendance</CardTitle>
              <CardDescription className="text-gray-600">
                You must mark your attendance before accessing the QC dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Please mark your attendance for today to continue.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/qc-attendance')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAttendanceModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </QCMainLayout>
    );
  }

  return (
    <QCMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">QC Dashboard</h1>
            <p className="text-muted-foreground">Quality control tasks and performance monitoring</p>
          </div>
        </div>

        {/* Date Range Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range Filters</CardTitle>
            <CardDescription>
              Select a date range to filter your QC task data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {quickDateRanges.map((range) => (
                <Button
                  key={range}
                  variant={selectedRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickRange(range)}
                  className="text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShowData} disabled={isLoading}>
                {isLoading ? "Loading..." : "Show"}
              </Button>
              <Button variant="outline" onClick={handleReset}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{qcStats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                All assigned tasks
              </p>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{qcStats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">
                Tasks awaiting review
              </p>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{qcStats.totalTasks - qcStats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">
                Tasks reviewed today
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </QCMainLayout>
  );
}