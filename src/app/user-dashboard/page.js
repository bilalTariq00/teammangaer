"use client";

import { useState } from "react";
import UserMainLayout from "@/components/layout/UserMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, Users, MousePointer, CheckCircle, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const quickDateRanges = [
  "Today",
  "Yesterday", 
  "Last 7 Days",
  "Last 14 Days",
  "Last 30 Days",
  "Last 60 Days",
  "Last 90 Days",
  "This Month",
  "Last Month",
  "All Time"
];

// Mock data for user's personal metrics - this would come from API based on user ID and date range
const getUserMetrics = (userId, fromDate, toDate, selectedRange) => {
  // Mock data with different values based on date range
  const baseData = {
    2: { // Hasan Abbas
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0,
      recentClicks: 0
    },
    3: { // Adnan Amir
      totalClicks: 26,
      goodClicks: 21,
      badClicks: 5,
      recentClicks: 3
    },
    4: { // Waleed Bin Shakeel
      totalClicks: 139,
      goodClicks: 123,
      badClicks: 19,
      recentClicks: 8
    }
  };

  const userData = baseData[userId] || {
    totalClicks: 0,
    goodClicks: 0,
    badClicks: 0,
    recentClicks: 0
  };

  // Simulate different data based on date range
  const rangeMultipliers = {
    "Today": 1,
    "Yesterday": 0.8,
    "Last 7 Days": 1.2,
    "Last 14 Days": 1.5,
    "Last 30 Days": 2,
    "Last 60 Days": 2.5,
    "Last 90 Days": 3,
    "This Month": 1.8,
    "Last Month": 1.6,
    "All Time": 3.5
  };

  const multiplier = rangeMultipliers[selectedRange] || 1;
  
  return {
    totalClicks: Math.floor(userData.totalClicks * multiplier),
    goodClicks: Math.floor(userData.goodClicks * multiplier),
    badClicks: Math.floor(userData.badClicks * multiplier),
    recentClicks: Math.floor(userData.recentClicks * multiplier)
  };
};

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Today");
  const [isLoading, setIsLoading] = useState(false);

  // Get user-specific metrics based on current user and date range
  const userMetrics = getUserMetrics(user?.id, fromDate, toDate, selectedRange);

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
      case "Last 14 Days":
        const last14Days = new Date(today);
        last14Days.setDate(last14Days.getDate() - 14);
        setFromDate(last14Days);
        setToDate(today);
        break;
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
      case "Last 90 Days":
        const last90Days = new Date(today);
        last90Days.setDate(last90Days.getDate() - 90);
        setFromDate(last90Days);
        setToDate(today);
        break;
      case "This Month":
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setFromDate(thisMonth);
        setToDate(today);
        break;
      case "Last Month":
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        setFromDate(lastMonth);
        setToDate(lastMonthEnd);
        break;
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
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
              
              <div className="space-y-2">
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

        {/* Your Personal Click/View Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Total Clicks/Views */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{userMetrics.totalClicks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">Your Total Clicks</div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Range: {format(fromDate, "yyyy-MM-dd")} → {format(toDate, "yyyy-MM-dd")}
                </p>
                <p className="text-xs text-muted-foreground">Recent: {userMetrics.recentClicks}</p>
              </div>
            </CardContent>
          </Card>

          {/* Good Clicks/Views */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Good Clicks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-1">{userMetrics.goodClicks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">Your Good Clicks</div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">Successful submissions</p>
                <p className="text-xs text-muted-foreground">Recent: {userMetrics.goodClicks}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bad Clicks/Views */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bad Clicks</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-1">{userMetrics.badClicks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">Your Bad Clicks</div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">Allowed clicks without success</p>
                <p className="text-xs text-muted-foreground">Recent: {userMetrics.badClicks}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserMainLayout>
  );
}
