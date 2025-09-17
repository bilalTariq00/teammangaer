"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, Users, MousePointer, CheckCircle, ArrowLeft, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

// Function to get metrics based on date range
const getMetricsForRange = (selectedRange) => {
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

  // Calculate actual worker counts and metrics from the data
  const permanentViewersCount = permanentViewers.length;
  const permanentClickersCount = permanentClickers.length;
  const traineeViewersCount = traineeViewers.length;
  const traineeClickersCount = traineeClickers.length;

  // Calculate total clicks for each category
  const permanentViewersClicks = permanentViewers.reduce((sum, worker) => sum + worker.clicks, 0);
  const permanentViewersSuccess = permanentViewers.reduce((sum, worker) => sum + worker.success, 0);
  const permanentViewersFailed = permanentViewers.reduce((sum, worker) => sum + worker.failed, 0);
  const permanentViewersFormFills = permanentViewers.reduce((sum, worker) => sum + worker.formFills, 0);

  const permanentClickersClicks = permanentClickers.reduce((sum, worker) => sum + worker.clicks, 0);
  const permanentClickersSuccess = permanentClickers.reduce((sum, worker) => sum + worker.success, 0);
  const permanentClickersFailed = permanentClickers.reduce((sum, worker) => sum + worker.failed, 0);
  const permanentClickersFormFills = permanentClickers.reduce((sum, worker) => sum + worker.formFills, 0);

  const traineeViewersClicks = traineeViewers.reduce((sum, worker) => sum + worker.clicks, 0);
  const traineeViewersSuccess = traineeViewers.reduce((sum, worker) => sum + worker.success, 0);
  const traineeViewersFailed = traineeViewers.reduce((sum, worker) => sum + worker.failed, 0);
  const traineeViewersFormFills = traineeViewers.reduce((sum, worker) => sum + worker.formFills, 0);

  const traineeClickersClicks = traineeClickers.reduce((sum, worker) => sum + worker.clicks, 0);
  const traineeClickersSuccess = traineeClickers.reduce((sum, worker) => sum + worker.success, 0);
  const traineeClickersFailed = traineeClickers.reduce((sum, worker) => sum + worker.failed, 0);
  const traineeClickersFormFills = traineeClickers.reduce((sum, worker) => sum + worker.formFills, 0);

  const permanentMetrics = [
    {
      title: "Viewers",
      icon: Users,
      metrics: {
        activeWorkers: permanentViewersCount,
        totalClicks: Math.floor(permanentViewersClicks * multiplier),
        goodClicks: Math.floor(permanentViewersSuccess * multiplier),
        badClicks: Math.floor(permanentViewersFailed * multiplier),
        formFills: Math.floor(permanentViewersFormFills * multiplier)
      }
    },
    {
      title: "Clickers",
      icon: MousePointer,
      metrics: {
        activeWorkers: permanentClickersCount,
        totalClicks: Math.floor(permanentClickersClicks * multiplier),
        goodClicks: Math.floor(permanentClickersSuccess * multiplier),
        badClicks: Math.floor(permanentClickersFailed * multiplier),
        formFills: Math.floor(permanentClickersFormFills * multiplier)
      }
    }
  ];

  const traineeMetrics = [
    {
      title: "Viewers",
      icon: Users,
      metrics: {
        activeWorkers: traineeViewersCount,
        totalClicks: Math.floor(traineeViewersClicks * multiplier),
        goodClicks: Math.floor(traineeViewersSuccess * multiplier),
        badClicks: Math.floor(traineeViewersFailed * multiplier),
        formFills: Math.floor(traineeViewersFormFills * multiplier)
      }
    },
    {
      title: "Clickers",
      icon: MousePointer,
      metrics: {
        activeWorkers: traineeClickersCount,
        totalClicks: Math.floor(traineeClickersClicks * multiplier),
        goodClicks: Math.floor(traineeClickersSuccess * multiplier),
        badClicks: Math.floor(traineeClickersFailed * multiplier),
        formFills: Math.floor(traineeClickersFormFills * multiplier)
      }
    }
  ];

  return { permanentMetrics, traineeMetrics };
};

// Mock data for detailed worker views
const permanentViewers = [
  {
    id: 2,
    name: "Muhammad Shahood",
    email: "Shahood1@joyapps.net",
    clicks: 139,
    success: 123,
    formFills: 0,
    failed: 19,
    avgGapLast5: "9h 44m 34s",
    avgGapAll: "20m 07s",
    avgSubmitDelta: "1m 01s",
    workTime: "3h 03m 11s"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah.johnson@joyapps.net",
    clicks: 45,
    success: 38,
    formFills: 0,
    failed: 7,
    avgGapLast5: "12h 30m 45s",
    avgGapAll: "2h 15m 30s",
    avgSubmitDelta: "8m 30s",
    workTime: "1h 45m 20s"
  },
  {
    id: 7,
    name: "Emma Wilson",
    email: "emma.wilson@joyapps.net",
    clicks: 92,
    success: 78,
    formFills: 0,
    failed: 14,
    avgGapLast5: "9h 20m 15s",
    avgGapAll: "1h 15m 30s",
    avgSubmitDelta: "2m 45s",
    workTime: "11h 30m"
  }
];

const permanentClickers = [
  {
    id: 1,
    name: "Hasan Abbas",
    email: "abbas_hasan12@joysapps.com",
    clicks: 89,
    success: 78,
    formFills: 12,
    failed: 11,
    avgGapLast5: "8h 15m 22s",
    avgGapAll: "45m 12s",
    avgSubmitDelta: "3m 25s",
    workTime: "4h 12m 33s"
  },
  {
    id: 6,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@joyapps.net",
    clicks: 67,
    success: 58,
    formFills: 15,
    failed: 9,
    avgGapLast5: "7h 30m 10s",
    avgGapAll: "1h 20m 45s",
    avgSubmitDelta: "2m 15s",
    workTime: "9h 20m"
  },
  {
    id: 10,
    name: "James Brown",
    email: "james.brown@joyapps.net",
    clicks: 156,
    success: 134,
    formFills: 28,
    failed: 22,
    avgGapLast5: "6h 30m 15s",
    avgGapAll: "30m 45s",
    avgSubmitDelta: "1m 45s",
    workTime: "14h 20m"
  }
];

const traineeViewers = [
  {
    id: 9,
    name: "Lisa Thompson",
    email: "lisa.thompson@joyapps.net",
    clicks: 12,
    success: 9,
    formFills: 0,
    failed: 3,
    avgGapLast5: "15h 45m 20s",
    avgGapAll: "3h 30m 15s",
    avgSubmitDelta: "4m 30s",
    workTime: "4h 15m"
  }
];

const traineeClickers = [
  {
    id: 3,
    name: "Abid",
    email: "Abid1@joyapps.net",
    clicks: 26,
    success: 21,
    formFills: 18,
    failed: 5,
    avgGapLast5: "10h 50m 31s",
    avgGapAll: "1h 52m 32s",
    avgSubmitDelta: "2m 15s",
    workTime: "8h 30m"
  },
  {
    id: 5,
    name: "Mike Chen",
    email: "mike.chen@joyapps.net",
    clicks: 15,
    success: 12,
    formFills: 8,
    failed: 3,
    avgGapLast5: "11h 15m 30s",
    avgGapAll: "2h 30m 45s",
    avgSubmitDelta: "4m 10s",
    workTime: "7h 30m"
  },
  {
    id: 8,
    name: "David Kim",
    email: "david.kim@joyapps.net",
    clicks: 18,
    success: 14,
    formFills: 6,
    failed: 4,
    avgGapLast5: "12h 20m 45s",
    avgGapAll: "2h 45m 30s",
    avgSubmitDelta: "3m 45s",
    workTime: "6h 45m"
  }
];

const inactiveWorkers = [
  {
    id: 9,
    name: "Mohsin Test",
    email: "mohsin@joyapps.net"
  },
  {
    id: 10,
    name: "Test User",
    email: "test@joyapps.net"
  },
  {
    id: 11,
    name: "Inactive Worker",
    email: "inactive@joyapps.net"
  },
  {
    id: 12,
    name: "No Activity",
    email: "noactivity@joyapps.net"
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Today");
  const [activeTab, setActiveTab] = useState("permanent");
  const [detailedView, setDetailedView] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState("100");
  const [isLoading, setIsLoading] = useState(false);

  // Get metrics based on selected range
  const { permanentMetrics, traineeMetrics } = getMetricsForRange(selectedRange);

  const handleCardClick = (cardType) => {
    setDetailedView(cardType);
  };

  const handleWorkerClick = (workerId) => {
    router.push(`/worker/${workerId}`);
  };

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

  const getWorkerData = () => {
    switch (detailedView) {
      case "permanent-viewers":
        return permanentViewers;
      case "permanent-clickers":
        return permanentClickers;
      case "trainee-viewers":
        return traineeViewers;
      case "trainee-clickers":
        return traineeClickers;
      default:
        return [];
    }
  };

  const getViewTitle = () => {
    switch (detailedView) {
      case "permanent-viewers":
        return "Workers · Viewers";
      case "permanent-clickers":
        return "Workers · Clickers";
      case "trainee-viewers":
        return "Workers · Viewers";
      case "trainee-clickers":
        return "Workers · Clickers";
      default:
        return "";
    }
  };

  const filteredWorkers = getWorkerData().filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If detailed view is active, show the detailed table
  if (detailedView) {
    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Back Button and Title */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailedView(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cards
            </Button>
            <h1 className="text-2xl font-bold">{getViewTitle()}</h1>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
                <SelectItem value="200">200 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600">
            Showing page 1 of 1 • {filteredWorkers.length} active
          </div>

          {/* Workers Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Worker</TableHead>
                      <TableHead className="w-[100px]">Clicks</TableHead>
                      <TableHead className="w-[100px]">Success</TableHead>
                      <TableHead className="w-[120px]">Form fills</TableHead>
                      <TableHead className="w-[100px]">Failed</TableHead>
                      <TableHead className="w-[150px]">Avg gap (last 5)</TableHead>
                      <TableHead className="w-[150px]">Avg gap (all)</TableHead>
                      <TableHead className="w-[120px]">Avg submit Δ</TableHead>
                      <TableHead className="w-[120px]">Work time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell>
                          <div>
                            <div 
                              className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                              onClick={() => handleWorkerClick(worker.id)}
                            >
                              {worker.name}
                            </div>
                            <div className="text-sm text-gray-500">{worker.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{worker.clicks}</TableCell>
                        <TableCell className="text-green-600 font-medium">{worker.success}</TableCell>
                        <TableCell className="font-medium">{worker.formFills}</TableCell>
                        <TableCell className="text-red-600 font-medium">{worker.failed}</TableCell>
                        <TableCell className="text-sm">{worker.avgGapLast5}</TableCell>
                        <TableCell className="text-sm">{worker.avgGapAll}</TableCell>
                        <TableCell className="text-sm">{worker.avgSubmitDelta}</TableCell>
                        <TableCell className="text-sm font-medium">{worker.workTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                &lt;&lt; Prev
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next &gt;&gt;
              </Button>
            </div>
          </div>

          {/* Inactive Workers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inactive workers (no clicks in selected range)</CardTitle>
              <CardDescription>{inactiveWorkers.length} inactive</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell className="text-gray-500">{worker.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
      {/* Date Range Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range Filters</CardTitle>
          <CardDescription>
            Select a date range to filter your dashboard data
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

      {/* Metrics Cards with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger 
              value="permanent"
              className={`${
                activeTab === "permanent" 
                  ? "!bg-black !text-white shadow-md" 
                  : ""
              }`}
              style={activeTab === "permanent" ? { backgroundColor: 'black', color: 'white' } : {}}
            >
              Permanent
            </TabsTrigger>
            <TabsTrigger 
              value="trainee"
              className={`${
                activeTab === "trainee" 
                  ? "!bg-black !text-white shadow-md" 
                  : ""
              }`}
              style={activeTab === "trainee" ? { backgroundColor: 'black', color: 'white' } : {}}
            >
              Trainee
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="permanent" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
            {permanentMetrics.map((item) => {
              const cardType = item.title === "Viewers" ? "permanent-viewers" : "permanent-clickers";
              return (
                <Card 
                  key={item.title} 
                  className="relative overflow-hidden transition-smooth hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                  onClick={() => handleCardClick(cardType)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Active Workers */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{item.metrics.activeWorkers}</div>
                      <div className="text-sm text-muted-foreground font-medium">Active Workers</div>
                    </div>
                    
                    {/* Total Clicks */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{item.metrics.totalClicks.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Total Clicks</div>
                    </div>
                    
                    {/* Good Clicks */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{item.metrics.goodClicks.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Good Clicks</div>
                    </div>
                    
                    {/* Bad Clicks */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-1">{item.metrics.badClicks.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Bad Clicks</div>
                    </div>
                    
                    {/* Form Fills - spans full width */}
                    <div className="text-center col-span-2">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{item.metrics.formFills}</div>
                      <div className="text-sm text-muted-foreground font-medium">Form Fills</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Range: {format(fromDate, "yyyy-MM-dd")} → {format(toDate, "yyyy-MM-dd")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="trainee" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
            {traineeMetrics.map((item) => {
              const cardType = item.title === "Viewers" ? "trainee-viewers" : "trainee-clickers";
              return (
                <Card 
                  key={item.title} 
                  className="relative overflow-hidden transition-smooth hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                  onClick={() => handleCardClick(cardType)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Active Workers */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{item.metrics.activeWorkers}</div>
                      <div className="text-sm text-muted-foreground font-medium">Active Workers</div>
                    </div>
                    
                    {/* Total Clicks */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{item.metrics.totalClicks.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Total Clicks</div>
                    </div>
                    
                    {/* Good Clicks */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{item.metrics.goodClicks.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Good Clicks</div>
                    </div>
                    
                    {/* Bad Clicks */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-1">{item.metrics.badClicks.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Bad Clicks</div>
                    </div>
                    
                    {/* Form Fills - spans full width */}
                    <div className="text-center col-span-2">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{item.metrics.formFills}</div>
                      <div className="text-sm text-muted-foreground font-medium">Form Fills</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Range: {format(fromDate, "yyyy-MM-dd")} → {format(toDate, "yyyy-MM-dd")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </MainLayout>
  );
}
