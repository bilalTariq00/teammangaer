"use client";

import { useState } from "react";
import QCMainLayout from "@/components/layout/QCMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Calendar,
  Filter
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for QC reports
const qualityTrendData = [
  { month: "Jan", qualityScore: 85, tasksCompleted: 12, issuesFound: 3 },
  { month: "Feb", qualityScore: 88, tasksCompleted: 15, issuesFound: 2 },
  { month: "Mar", qualityScore: 92, tasksCompleted: 18, issuesFound: 1 },
  { month: "Apr", qualityScore: 89, tasksCompleted: 14, issuesFound: 4 },
  { month: "May", qualityScore: 94, tasksCompleted: 20, issuesFound: 1 },
  { month: "Jun", qualityScore: 91, tasksCompleted: 16, issuesFound: 2 }
];

const campaignQualityData = [
  { name: "Summer Sale", qualityScore: 92, totalTasks: 15, completedTasks: 14 },
  { name: "Holiday Special", qualityScore: 88, totalTasks: 12, completedTasks: 11 },
  { name: "Black Friday", qualityScore: 95, totalTasks: 18, completedTasks: 18 },
  { name: "New Year Sale", qualityScore: 87, totalTasks: 10, completedTasks: 8 },
  { name: "Spring Campaign", qualityScore: 90, totalTasks: 13, completedTasks: 12 }
];

const issueTypeData = [
  { name: "Click Quality", value: 35, color: "#8884d8" },
  { name: "Form Issues", value: 25, color: "#82ca9d" },
  { name: "Bot Detection", value: 20, color: "#ffc658" },
  { name: "User Experience", value: 15, color: "#ff7300" },
  { name: "Technical", value: 5, color: "#ff0000" }
];

const recentIssues = [
  {
    id: 1,
    type: "Click Quality",
    severity: "high",
    campaign: "Summer Sale",
    description: "Inconsistent click patterns detected in user behavior",
    reportedBy: "Muhammad Shahood",
    date: "2024-01-15",
    status: "open"
  },
  {
    id: 2,
    type: "Form Issues",
    severity: "medium",
    campaign: "Holiday Special",
    description: "Form validation errors causing user drop-offs",
    reportedBy: "Hasan Abbas",
    date: "2024-01-14",
    status: "in_progress"
  },
  {
    id: 3,
    type: "Bot Detection",
    severity: "high",
    campaign: "Black Friday",
    description: "Suspicious automated traffic patterns identified",
    reportedBy: "Adnan Amir",
    date: "2024-01-13",
    status: "resolved"
  },
  {
    id: 4,
    type: "User Experience",
    severity: "low",
    campaign: "New Year Sale",
    description: "Mobile responsiveness issues on checkout page",
    reportedBy: "Waleed Bin Shakeel",
    date: "2024-01-12",
    status: "open"
  }
];

export default function QCReportsPage() {
  const [timeRange, setTimeRange] = useState("6months");
  const [reportType, setReportType] = useState("overview");

  const getSeverityBadge = (severity) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return variants[severity] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    const variants = {
      open: "bg-red-100 text-red-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800"
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <QCMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quality Reports</h1>
            <p className="text-muted-foreground">Comprehensive quality control analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Customize your quality control reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="detailed">Detailed Analysis</SelectItem>
                    <SelectItem value="campaigns">Campaign Focus</SelectItem>
                    <SelectItem value="issues">Issues Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Quality Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +12 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                -3 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92.3%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +1.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quality Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Score Trend</CardTitle>
              <CardDescription>Monthly quality score progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="qualityScore" stroke="#8884d8" name="Quality Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Quality Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Quality Scores</CardTitle>
              <CardDescription>Quality performance by campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignQualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="qualityScore" fill="#8884d8" name="Quality Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issue Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Types Distribution</CardTitle>
            <CardDescription>Breakdown of quality issues by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {issueTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quality Issues</CardTitle>
            <CardDescription>Latest quality control findings and resolutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{issue.type}</h4>
                      <Badge className={getSeverityBadge(issue.severity)}>
                        {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                      </Badge>
                      <Badge className={getStatusBadge(issue.status)}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{issue.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Campaign: {issue.campaign}</span>
                      <span>Reported by: {issue.reportedBy}</span>
                      <span>Date: {new Date(issue.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </QCMainLayout>
  );
}
