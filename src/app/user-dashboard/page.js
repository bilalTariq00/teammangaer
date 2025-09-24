"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserMainLayout from "@/components/layout/UserMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, MousePointer, CheckCircle, Eye, Users, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";

const quickDateRanges = [
  "Today",
  "Yesterday", 
  "Last 7 Days",
  // "Last 14 Days",
  "Last 30 Days",
  // "Last 60 Days",
  // "Last 90 Days",
  // "This Month",
  // "Last Month",
  "All Time"
];

// Mock data for user's personal metrics - this would come from API based on user ID and date range
const getUserMetrics = (userId, fromDate, toDate, selectedRange) => {
  // Mock data with different values based on date range
  const baseData = {
    1: { // Abbas Hasan - Permanent Clicker
      totalClicks: 3247,
      goodClicks: 2856,
      badClicks: 391,
      recentClicks: 15,
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      recentViews: 0
    },
    3: { // Abid - Permanent Clicker
      totalClicks: 2156,
      goodClicks: 1890,
      badClicks: 266,
      recentClicks: 8,
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      recentViews: 0
    },
    4: { // Sarah Johnson - Trainee Viewer
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0,
      recentClicks: 0,
      totalViews: 1234,
      goodViews: 1089,
      badViews: 145,
      recentViews: 12,
      // Session data
      sessionTotal: 856,
      sessionGood: 734,
      sessionBad: 122,
      // Search data
      searchTotal: 378,
      searchGood: 355,
      searchBad: 23
    },
    5: { // Hasan Abbas - Permanent Clicker
      totalClicks: 3847,
      goodClicks: 3256,
      badClicks: 591,
      recentClicks: 18,
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      recentViews: 0,
      // Additional activity metrics
      todayClicks: 23,
      yesterdayClicks: 19,
      thisWeekClicks: 156,
      lastWeekClicks: 142,
      avgDailyClicks: 128,
      bestDayClicks: 45,
      currentStreak: 7,
      longestStreak: 23,
      // Session data (for both roles)
      sessionTotal: 1245,
      sessionGood: 1089,
      sessionBad: 156,
      // Search data (for both roles)
      searchTotal: 567,
      searchGood: 523,
      searchBad: 44
    },
    6: { // Adnan Amir - Viewer
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0,
      recentClicks: 0,
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      recentViews: 0,
      // Session data
      sessionTotal: 1456,
      sessionGood: 1234,
      sessionBad: 222,
      // Search data
      searchTotal: 678,
      searchGood: 612,
      searchBad: 66
    },
    7: { // Waleed Bin Shakeel - Clicker
      totalClicks: 2156,
      goodClicks: 1890,
      badClicks: 266,
      recentClicks: 12,
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      recentViews: 0,
      // Additional activity metrics
      todayClicks: 18,
      yesterdayClicks: 15,
      thisWeekClicks: 98,
      lastWeekClicks: 87,
      avgDailyClicks: 89,
      bestDayClicks: 35,
      currentStreak: 5,
      longestStreak: 18
    },
    9: { // Mike Wilson - Permanent Viewer
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0,
      recentClicks: 0,
      totalViews: 2567,
      goodViews: 2301,
      badViews: 266,
      recentViews: 18
    },
    10: { // Lisa Brown - Trainee Viewer
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0,
      recentClicks: 0,
      totalViews: 987,
      goodViews: 856,
      badViews: 131,
      recentViews: 9
    },
    11: { // David - Trainee Clicker
      totalClicks: 156,
      goodClicks: 134,
      badClicks: 22,
      recentClicks: 5,
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      recentViews: 0
    },
    12: { // Emma - Permanent Clicker
      totalClicks: 3456,
      goodClicks: 3123,
      badClicks: 333,
      recentClicks: 18,
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      recentViews: 0
    }
  };

  const userData = baseData[userId] || {
    totalClicks: 0,
    goodClicks: 0,
    badClicks: 0,
    recentClicks: 0,
    totalViews: 0,
    goodViews: 0,
    badViews: 0,
    recentViews: 0
  };

  // Simulate different data based on date range
  const rangeMultipliers = {
    "Today": 0.15,
    "Yesterday": 0.12,
    "Last 7 Days": 0.45,
    // "Last 14 Days": 0.6,
    "Last 30 Days": 1,
    // "Last 60 Days": 1.5,
    // "Last 90 Days": 2,
    // "This Month": 0.8,
    // "Last Month": 0.7,
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
    totalClicks: Math.floor(userData.totalClicks * finalMultiplier),
    goodClicks: Math.floor(userData.goodClicks * finalMultiplier),
    badClicks: Math.floor(userData.badClicks * finalMultiplier),
    recentClicks: Math.floor(userData.recentClicks * finalMultiplier),
    totalViews: Math.floor(userData.totalViews * finalMultiplier),
    goodViews: Math.floor(userData.goodViews * finalMultiplier),
    badViews: Math.floor(userData.badViews * finalMultiplier),
    recentViews: Math.floor(userData.recentViews * finalMultiplier),
    // Additional metrics for Hasan
    todayClicks: userData.todayClicks || 0,
    yesterdayClicks: userData.yesterdayClicks || 0,
    thisWeekClicks: userData.thisWeekClicks || 0,
    lastWeekClicks: userData.lastWeekClicks || 0,
    avgDailyClicks: userData.avgDailyClicks || 0,
    bestDayClicks: userData.bestDayClicks || 0,
    currentStreak: userData.currentStreak || 0,
    longestStreak: userData.longestStreak || 0,
    // Session and Search data (also affected by date range filters)
    sessionTotal: Math.floor((userData.sessionTotal || 0) * finalMultiplier),
    sessionGood: Math.floor((userData.sessionGood || 0) * finalMultiplier),
    sessionBad: Math.floor((userData.sessionBad || 0) * finalMultiplier),
    searchTotal: Math.floor((userData.searchTotal || 0) * finalMultiplier),
    searchGood: Math.floor((userData.searchGood || 0) * finalMultiplier),
    searchBad: Math.floor((userData.searchBad || 0) * finalMultiplier)
  };
};

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { isAttendanceMarkedToday } = useAttendance();
  const router = useRouter();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Today");
  const [isLoading, setIsLoading] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Check if attendance is marked for today
  useEffect(() => {
    if (user && (user.role === 'worker' || user.role === 'user')) {
      const attendanceMarked = isAttendanceMarkedToday(user.id);
      
      if (!attendanceMarked) {
        setShowAttendanceModal(true);
      }
    }
  }, [user, isAttendanceMarkedToday]);

  // Get user-specific metrics based on current user and date range
  const userMetrics = getUserMetrics(user?.id, fromDate, toDate, selectedRange);
  
  // Debug logging for all users
  console.log('=== USER DASHBOARD DEBUG ===');
  console.log('User object:', user);
  console.log('User role:', user?.role);
  console.log('User taskRole:', user?.taskRole);
  console.log('User email:', user?.email);
  console.log('Is viewer condition:', user?.role === 'worker' && user?.taskRole === 'viewer');
  console.log('Is clicker condition:', user?.role === 'worker' && user?.taskRole === 'clicker');
  console.log('Is both condition:', user?.role === 'worker' && user?.taskRole === 'both');
  console.log('================================');
  
  // If no user is logged in, show a message
  if (!user) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view your dashboard.</p>
          </div>
        </div>
      </UserMainLayout>
    );
  }

  // If user is a manager, redirect them to manager dashboard
  if (user?.role === 'manager' || user?.workerType === 'manager') {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Manager Dashboard</h2>
            <p className="text-gray-600 mb-4">Managers have their own dedicated dashboard.</p>
            <a 
              href="/manager-dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Manager Dashboard
            </a>
          </div>
        </div>
      </UserMainLayout>
    );
  }

  // Show attendance modal if attendance is not marked for today
  if (showAttendanceModal) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Mark Your Attendance</CardTitle>
              <CardDescription className="text-gray-600">
                You must mark your attendance before accessing the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Please mark your attendance for today to continue.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/user-attendance')}
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
      </UserMainLayout>
    );
  }

  // Determine user type based on workerType (only for workers, not managers)
  const isWorker = user?.workerType?.includes('worker') || user?.role === 'worker';
  const isPermanent = user?.workerType?.includes('permanent') || user?.status === 'permanent';
  const isTrainee = user?.workerType?.includes('trainee') || user?.status === 'trainee';
  
  // Debug logging
  console.log('User object:', user);
  console.log('WorkerType:', user?.workerType);
  console.log('Role:', user?.role);
  console.log('Status:', user?.status);
  console.log('Is Worker:', isWorker);
  console.log('Is Permanent:', isPermanent);
  console.log('Is Trainee:', isTrainee);
  console.log('User ID:', user?.id);
  console.log('User Metrics:', userMetrics);

  const handleShowData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setSelectedRange("Today");
  };

  const handleQuickRange = (range) => {
    setSelectedRange(range);
    const today = new Date();
    
    switch (range) {
      case "Today":
        setFromDate(new Date(today));
        setToDate(new Date(today));
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        setFromDate(new Date(yesterday));
        setToDate(new Date(yesterday));
        break;
      case "Last 7 Days":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        setFromDate(last7Days);
        setToDate(today);
        break;
      // case "Last 14 Days":
      //   const last14Days = new Date(today);
      //   last14Days.setDate(last14Days.getDate() - 14);
      //   setFromDate(last14Days);
      //   setToDate(today);
      //   break;
      case "Last 30 Days":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        setFromDate(last30Days);
        setToDate(today);
        break;
      case "Last 60 Days":
        const last60Days = new Date(today);
        last60Days.setDate(last60Days.getDate() - 60);
        setFromDate(last60Days);
        setToDate(today);
        break;
      // case "Last 90 Days":
      //   const last90Days = new Date(today);
      //   last90Days.setDate(last90Days.getDate() - 90);
      //   setFromDate(last90Days);
      //   setToDate(today);
      //   break;
      // case "This Month":
      //   const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      //   setFromDate(thisMonth);
      //   setToDate(today);
      //   break;
      // case "Last Month":
      //   const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      //   const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      //   setFromDate(lastMonth);
      //   setToDate(lastMonthEnd);
      //   break;
      case "All Time":
        const allTime = new Date(2024, 0, 1); // January 1, 2024
        setFromDate(allTime);
        setToDate(today);
        break;
      default:
        break;
    }
  };

  return (
    <UserMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Here&apos;s your personal click activity.
            </p>
          </div>
        </div>

        {/* Date Range Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range Filters</CardTitle>
            <CardDescription>
              Select a date range to filter your personal click data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <div className="flex flex-row gap-4">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex flex-row gap-4">
                <Label htmlFor="from-date">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-fit justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "MM/dd/yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2 flex flex-row gap-4">
                <Label htmlFor="to-date">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "MM/dd/yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Quick Date Range Buttons */}
          
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShowData} disabled={isLoading}>
                {isLoading ? "Loading..." : "Show"}
              </Button>
              <Button variant="outline" onClick={handleReset}>Reset</Button>
            </div>
          </CardContent>
        </Card>


        {/* Task Breakdown Section */}
        {user && (
          <div className="mt-8">
           
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Debug Card - Shows for any user */}
           
              
              {/* Viewer Cards - Session and Search */}
              {(user?.taskRole === 'viewer' || user?.email === 'adnan@joyapps.net') && (
                <>
                  {/* Session Task Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-green-200">
                      <CardTitle className="text-green-800 text-lg font-semibold">Session Tasks</CardTitle>
                      <Eye className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">{userMetrics.sessionTotal.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground font-medium">Total Sessions</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{userMetrics.sessionGood.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Good</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{userMetrics.sessionBad.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Bad</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground text-center">
                            Success Rate: {userMetrics.sessionTotal > 0 ? Math.round((userMetrics.sessionGood / userMetrics.sessionTotal) * 100) : 0}%
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1">
                            Range: {format(fromDate, "MM/dd/yyyy")} → {format(toDate, "MM/dd/yyyy")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Search Task Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-blue-200">
                      <CardTitle className="text-blue-800 text-lg font-semibold">Search Tasks</CardTitle>
                      <MousePointer className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">{userMetrics.searchTotal.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground font-medium">Total Searches</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{userMetrics.searchGood.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Good</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{userMetrics.searchBad.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Bad</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground text-center">
                            Success Rate: {userMetrics.searchTotal > 0 ? Math.round((userMetrics.searchGood / userMetrics.searchTotal) * 100) : 0}%
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1">
                            Range: {format(fromDate, "MM/dd/yyyy")} → {format(toDate, "MM/dd/yyyy")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Clicker Cards - Total, Good, Bad */}
              {(user?.taskRole === 'clicker' || user?.email === 'waleed@joyapps.net') && (
                <>
                  {/* Total Clicks Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-1">{userMetrics.totalClicks.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground font-medium">
                          Your Total Clicks {isPermanent ? '(Permanent)' : isTrainee ? '(Trainee)' : ''}
                    </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                          Range: {format(fromDate, "MM/dd/yyyy")} → {format(toDate, "MM/dd/yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">Recent: {userMetrics.recentClicks}</p>
                        {(user?.id === 5 || user?.email === 'hasan@joyapps.net') && (
                          <>
                            <p className="text-xs text-muted-foreground">Today: {userMetrics.todayClicks || 23}</p>
                            <p className="text-xs text-muted-foreground">Avg Daily: {userMetrics.avgDailyClicks || 128}</p>
                          </>
                        )}
              </div>
            </CardContent>
          </Card>

                  {/* Good Clicks Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Good Clicks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-1">{userMetrics.goodClicks.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground font-medium">Quality Clicks Completed</div>
              </div>
              <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">Success rate: {userMetrics.totalClicks > 0 ? Math.round((userMetrics.goodClicks / userMetrics.totalClicks) * 100) : 0}%</p>
                        <p className="text-xs text-muted-foreground">Recent: {userMetrics.goodClicks}</p>
                        {(user?.id === 5 || user?.email === 'hasan@joyapps.net') && (
                          <>
                            <p className="text-xs text-muted-foreground">This Week: {userMetrics.thisWeekClicks || 156}</p>
                            <p className="text-xs text-green-600">+{((userMetrics.thisWeekClicks || 156) - (userMetrics.lastWeekClicks || 142))} vs last week</p>
                          </>
                        )}
              </div>
            </CardContent>
          </Card>

                  {/* Bad Clicks Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Bad Clicks</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-center">
                        <div className="text-4xl font-bold text-red-600 mb-1">{userMetrics.badClicks.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground font-medium">Clicks Needing Improvement</div>
              </div>
              <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">Failure rate: {userMetrics.totalClicks > 0 ? Math.round((userMetrics.badClicks / userMetrics.totalClicks) * 100) : 0}%</p>
                        <p className="text-xs text-muted-foreground">Recent: {userMetrics.badClicks}</p>
                        {(user?.id === 5 || user?.email === 'hasan@joyapps.net') && (
                          <>
                            <p className="text-xs text-muted-foreground">Best Day: {userMetrics.bestDayClicks || 45}</p>
                            <p className="text-xs text-muted-foreground">Current Streak: {userMetrics.currentStreak || 7} days</p>
                          </>
                        )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

              {/* Both Roles - All Cards */}
              {(user?.taskRole === 'both' || user?.email === 'hasan@joyapps.net') && (
            <>
                  {/* Session Task Card */}
              <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-green-200">
                      <CardTitle className="text-green-800 text-lg font-semibold">Session Tasks</CardTitle>
                      <Eye className="h-4 w-4 text-green-600" />
                </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">{userMetrics.sessionTotal.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground font-medium">Total Sessions</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{userMetrics.sessionGood.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Good</div>
                          </div>
                  <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{userMetrics.sessionBad.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Bad</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground text-center">
                            Success Rate: {userMetrics.sessionTotal > 0 ? Math.round((userMetrics.sessionGood / userMetrics.sessionTotal) * 100) : 0}%
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1">
                            Range: {format(fromDate, "MM/dd/yyyy")} → {format(toDate, "MM/dd/yyyy")}
                          </p>
                  </div>
                  </div>
                </CardContent>
              </Card>

                  {/* Search Task Card */}
              <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-blue-200">
                      <CardTitle className="text-blue-800 text-lg font-semibold">Search Tasks</CardTitle>
                      <MousePointer className="h-4 w-4 text-blue-600" />
                </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">{userMetrics.searchTotal.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground font-medium">Total Searches</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{userMetrics.searchGood.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Good</div>
                          </div>
                  <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{userMetrics.searchBad.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Bad</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground text-center">
                            Success Rate: {userMetrics.searchTotal > 0 ? Math.round((userMetrics.searchGood / userMetrics.searchTotal) * 100) : 0}%
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1">
                            Range: {format(fromDate, "MM/dd/yyyy")} → {format(toDate, "MM/dd/yyyy")}
                          </p>
                  </div>
                  </div>
                </CardContent>
              </Card>

                  {/* Clicker Task Card */}
              <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-purple-200">
                      <CardTitle className="text-purple-800 text-lg font-semibold">Clicker Tasks</CardTitle>
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">{userMetrics.totalClicks.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground font-medium">Total Clicks</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{userMetrics.goodClicks.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Good</div>
                          </div>
                  <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{userMetrics.badClicks.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Bad</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground text-center">
                            Success Rate: {userMetrics.totalClicks > 0 ? Math.round((userMetrics.goodClicks / userMetrics.totalClicks) * 100) : 0}%
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1">
                            Range: {format(fromDate, "MM/dd/yyyy")} → {format(toDate, "MM/dd/yyyy")}
                          </p>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
          </div>
        )}

      </div>
    </UserMainLayout>
  );
}
