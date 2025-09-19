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
  Filter,
  X,
  User,
  Target,
  MessageSquare,
  Clock,
  AlertCircle
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
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

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

  // Handle view issue details
  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setShowIssueModal(true);
  };

  // Close issue modal
  const closeIssueModal = () => {
    setSelectedIssue(null);
    setShowIssueModal(false);
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewIssue(issue)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issue Detail Modal */}
        {showIssueModal && selectedIssue && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Quality Issue Details</h2>
                <Button variant="ghost" size="sm" onClick={closeIssueModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Issue Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{selectedIssue.type}</h3>
                    <Badge className={getSeverityBadge(selectedIssue.severity)}>
                      {selectedIssue.severity.charAt(0).toUpperCase() + selectedIssue.severity.slice(1)}
                    </Badge>
                    <Badge className={getStatusBadge(selectedIssue.status)}>
                      {selectedIssue.status.charAt(0).toUpperCase() + selectedIssue.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{selectedIssue.description}</p>
                </div>

                {/* Issue Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Issue Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span><strong>Campaign:</strong> {selectedIssue.campaign}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span><strong>Reported by:</strong> {selectedIssue.reportedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span><strong>Date:</strong> {new Date(selectedIssue.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700">Issue Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedIssue.status === 'resolved' ? 'bg-green-500' :
                          selectedIssue.status === 'in_progress' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium">
                          {selectedIssue.status.charAt(0).toUpperCase() + selectedIssue.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Severity: <span className="font-medium">{selectedIssue.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue Impact */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Impact Assessment</h4>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {selectedIssue.severity === 'high' ? 'High' : selectedIssue.severity === 'medium' ? 'Medium' : 'Low'}
                      </div>
                      <div className="text-xs text-red-700">Severity Level</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedIssue.type === 'Click Quality' ? '15' : 
                         selectedIssue.type === 'Form Issues' ? '8' : 
                         selectedIssue.type === 'Bot Detection' ? '22' : '12'}
                      </div>
                      <div className="text-xs text-blue-700">Affected Tasks</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {selectedIssue.status === 'resolved' ? '0' : 
                         selectedIssue.status === 'in_progress' ? '3' : '5'}
                      </div>
                      <div className="text-xs text-orange-700">Days Open</div>
                    </div>
                  </div>
                </div>

                {/* Issue Timeline */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Issue Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Issue Reported</p>
                        <p className="text-xs text-gray-500">by {selectedIssue.reportedBy} on {new Date(selectedIssue.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {selectedIssue.status === 'in_progress' && (
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Issue Under Investigation</p>
                          <p className="text-xs text-gray-500">Started 2 days ago</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedIssue.status === 'resolved' && (
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Issue Resolved</p>
                          <p className="text-xs text-gray-500">Resolved 1 day ago</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Issue Description */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Detailed Description
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {selectedIssue.type === 'Click Quality' && 
                        "Detailed analysis shows inconsistent click patterns across multiple user sessions. The issue appears to be related to timing variations and user behavior anomalies that deviate from expected patterns. Further investigation is needed to identify the root cause and implement appropriate corrective measures."
                      }
                      {selectedIssue.type === 'Form Issues' && 
                        "Form validation errors are causing significant user drop-offs during the submission process. The errors appear to be related to client-side validation conflicts and server-side processing delays. Immediate attention is required to prevent further user experience degradation."
                      }
                      {selectedIssue.type === 'Bot Detection' && 
                        "Automated traffic patterns have been identified that match known bot signatures. The traffic shows characteristics of non-human behavior including rapid, repetitive actions and unusual timing patterns. Security measures need to be implemented to prevent further automated access."
                      }
                      {selectedIssue.type === 'User Experience' && 
                        "User experience issues have been reported that are affecting overall satisfaction and task completion rates. The problems appear to be related to interface responsiveness and navigation flow. UX improvements are needed to enhance user engagement."
                      }
                    </p>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Recommended Actions</h4>
                  <div className="space-y-2">
                    {selectedIssue.severity === 'high' && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Immediate Action Required</p>
                          <p className="text-xs text-red-700">This high-severity issue requires immediate attention and resolution within 24 hours.</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Next Steps</p>
                        <p className="text-xs text-blue-700">
                          {selectedIssue.status === 'open' && 'Assign to development team for investigation and resolution.'}
                          {selectedIssue.status === 'in_progress' && 'Continue monitoring progress and provide updates to stakeholders.'}
                          {selectedIssue.status === 'resolved' && 'Verify resolution and monitor for any recurrence of the issue.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={closeIssueModal}>
                  Close
                </Button>
                <Button onClick={() => {
                  // You can add action functionality here later
                  console.log('Action taken on issue:', selectedIssue.id);
                }}>
                  Take Action
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </QCMainLayout>
  );
}
