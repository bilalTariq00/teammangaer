"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon, 
  TrendingUp, 
  Users, 
  MousePointer, 
  CheckCircle, 
  Target,
  BarChart3,
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

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

// Mock data for comprehensive dashboard
const mockCampaigns = [
  { id: 1, name: "Summer Sale Campaign", status: "active", budget: 50000, spent: 32500, clicks: 15420, views: 23450, conversionRate: 12.5 },
  { id: 2, name: "Black Friday Blitz", status: "active", budget: 75000, spent: 68000, clicks: 28450, views: 45600, conversionRate: 18.2 },
  { id: 3, name: "Holiday Special", status: "paused", budget: 40000, spent: 15000, clicks: 8500, views: 12000, conversionRate: 8.7 },
  { id: 4, name: "New Year Launch", status: "active", budget: 60000, spent: 42000, clicks: 19800, views: 28900, conversionRate: 15.3 },
  { id: 5, name: "Spring Collection", status: "completed", budget: 35000, spent: 35000, clicks: 12500, views: 18700, conversionRate: 10.8 }
];

const mockWorkers = [
  { id: 1, name: "Muhammad Shahood", email: "Shahood1@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 139, success: 123, formFills: 0, failed: 19 },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 45, success: 38, formFills: 0, failed: 7 },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 92, success: 78, formFills: 0, failed: 14 },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 156, success: 142, formFills: 28, failed: 14 },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 134, success: 118, formFills: 32, failed: 16 },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 142, success: 125, formFills: 25, failed: 17 },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 28, success: 22, formFills: 0, failed: 6 },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 45, success: 38, formFills: 28, failed: 7 },
  { id: 9, name: "Mike Chen", email: "mike.chen@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 32, success: 26, formFills: 18, failed: 6 },
  { id: 10, name: "David Kim", email: "david.kim@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 38, success: 31, formFills: 15, failed: 7 }
];

const mockTasks = [
  { id: 1, title: "Tasker Click", status: "active", completed: 45, total: 50, priority: "high" },
  { id: 2, title: "Tasker View", status: "active", completed: 38, total: 40, priority: "medium" },
  { id: 3, title: "Form Fill Task", status: "active", completed: 25, total: 30, priority: "high" },
  { id: 4, title: "Survey Task", status: "paused", completed: 15, total: 20, priority: "low" },
  { id: 5, title: "Review Task", status: "completed", completed: 30, total: 30, priority: "medium" }
];

// Chart data
const performanceData = [
  { name: "Jan", campaigns: 2, clicks: 12000, views: 18000, tasks: 15 },
  { name: "Feb", campaigns: 3, clicks: 15000, views: 22000, tasks: 18 },
  { name: "Mar", campaigns: 4, clicks: 18000, views: 26000, tasks: 22 },
  { name: "Apr", campaigns: 3, clicks: 16000, views: 24000, tasks: 20 },
  { name: "May", campaigns: 5, clicks: 22000, views: 32000, tasks: 25 },
  { name: "Jun", campaigns: 4, clicks: 19000, views: 28000, tasks: 23 },
  { name: "Jul", campaigns: 6, clicks: 25000, views: 38000, tasks: 28 },
  { name: "Aug", campaigns: 5, clicks: 21000, views: 31000, tasks: 26 },
  { name: "Sep", campaigns: 7, clicks: 28000, views: 42000, tasks: 32 },
  { name: "Oct", campaigns: 6, clicks: 24000, views: 36000, tasks: 29 },
  { name: "Nov", campaigns: 8, clicks: 32000, views: 48000, tasks: 35 },
  { name: "Dec", campaigns: 5, clicks: 20000, views: 30000, tasks: 27 }
];

const campaignStatusData = [
  { name: "Active", value: 3, color: "#10b981" },
  { name: "Paused", value: 1, color: "#f59e0b" },
  { name: "Completed", value: 1, color: "#6b7280" }
];

const workerTypeData = [
  { name: "Permanent Workers", value: 6, color: "#3b82f6" },
  { name: "Trainee Workers", value: 4, color: "#8b5cf6" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  // Calculate metrics
  const totalCampaigns = mockCampaigns.length;
  const activeCampaigns = mockCampaigns.filter(c => c.status === "active").length;
  const totalWorkers = mockWorkers.length;
  const permanentWorkers = mockWorkers.filter(w => w.type.includes("Permanent Worker")).length;
  const traineeWorkers = mockWorkers.filter(w => w.type.includes("Trainee Worker")).length;
  const totalTasks = mockTasks.length;
  const activeTasks = mockTasks.filter(t => t.status === "active").length;
  const completedTasks = mockTasks.filter(t => t.status === "completed").length;
  
  const totalClicks = mockWorkers.reduce((sum, worker) => sum + worker.totalClicks, 0);
  const totalSuccess = mockWorkers.reduce((sum, worker) => sum + worker.success, 0);
  const totalFormFills = mockWorkers.reduce((sum, worker) => sum + worker.formFills, 0);
  const totalFailed = mockWorkers.reduce((sum, worker) => sum + worker.failed, 0);
  
  const totalBudget = mockCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = mockCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalCampaignClicks = mockCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalCampaignViews = mockCampaigns.reduce((sum, campaign) => sum + campaign.views, 0);
  
  const successRate = totalClicks > 0 ? ((totalSuccess / totalClicks) * 100).toFixed(1) : 0;
  const budgetUtilization = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;
  const conversionRate = totalCampaignViews > 0 ? ((totalCampaignClicks / totalCampaignViews) * 100).toFixed(1) : 0;

  const handleShowData = () => {
    // Handle date range filtering
    console.log("Filtering data from", fromDate, "to", toDate);
  };

  const handleReset = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setSelectedRange("Last 30 Days");
  };

  const handleQuickRange = (range) => {
    setSelectedRange(range);
    const today = new Date();
    
    switch (range) {
      case "Today":
        setFromDate(today);
        setToDate(today);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        setFromDate(yesterday);
        setToDate(yesterday);
        break;
      case "Last 7 Days":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        setFromDate(last7Days);
        setToDate(today);
        break;
      case "Last 30 Days":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        setFromDate(last30Days);
        setToDate(today);
        break;
      case "All Time":
        const allTime = new Date(2024, 0, 1);
        setFromDate(allTime);
        setToDate(today);
        break;
      default:
        break;
    }
  };

  const handleWorkerClick = (workerId) => {
    router.push(`/worker/${workerId}`);
  };

  const handleCampaignClick = (campaignId) => {
    router.push(`/campaigns`);
  };

  const handleTaskClick = () => {
    router.push(`/tasks`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive overview of your platform performance</p>
          </div>
        </div>

      {/* Date Range Filters */}
      {/* <Card>
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
                      {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
                      {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
              <div className="space-y-2">
                <Label>Quick Range</Label>
                <Select value={selectedRange} onValueChange={handleQuickRange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
            {quickDateRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleShowData}>Show Data</Button>
                <Button variant="outline" onClick={handleReset}>Reset</Button>
          </div>
          </div>
        </CardContent>
      </Card> */}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Campaigns */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCampaignClick()}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{activeCampaigns} active</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Workers */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/users')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 font-medium">{permanentWorkers} permanent workers</span> • <span className="text-purple-600 font-medium">{traineeWorkers} trainee workers</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Tasks */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTaskClick}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{activeTasks} active</span> • <span className="text-gray-600 font-medium">{completedTasks} completed</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Clicks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{successRate}% success rate</span>
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Success Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalSuccess.toLocaleString()} successful clicks
              </p>
            </CardContent>
          </Card>

          {/* Form Fills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Fills</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalFormFills.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalClicks > 0 ? ((totalFormFills / totalClicks) * 100).toFixed(1) : 0}% of total clicks
              </p>
            </CardContent>
          </Card>

          {/* Budget Utilization */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{budgetUtilization}%</div>
              <p className="text-xs text-muted-foreground">
                ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalCampaignClicks.toLocaleString()} clicks from {totalCampaignViews.toLocaleString()} views
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Monthly performance metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="campaigns" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="views" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
              <CardDescription>Distribution of campaign statuses</CardDescription>
                  </CardHeader>
                <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={campaignStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {campaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
                    </div>

        {/* Worker Distribution and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Worker Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Worker Distribution</CardTitle>
              <CardDescription>Breakdown of worker types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workerTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest worker performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWorkers.slice(0, 5).map((worker) => (
                  <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleWorkerClick(worker.id)}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                    </div>
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-sm text-gray-500">{worker.type}</p>
                    </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{worker.totalClicks} clicks</p>
                      <p className="text-sm text-green-600">{worker.success} success</p>
                    </div>
                  </div>
                ))}
                  </div>
                </CardContent>
              </Card>
          </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/campaigns')}
              >
                <Target className="h-6 w-6" />
                <span>Manage Campaigns</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/users')}
              >
                <Users className="h-6 w-6" />
                <span>Manage Workers</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/tasks')}
              >
                <CheckCircle className="h-6 w-6" />
                <span>Manage Tasks</span>
              </Button>
                  </div>
                </CardContent>
              </Card>
      </div>
    </MainLayout>
  );
}
