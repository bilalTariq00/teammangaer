"use client";

import { useState } from "react";
import ManagerMainLayout from "@/components/layout/ManagerMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target,
  Download,
  Calendar,
  Award,
  Clock,
  FileText,
  Table
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, Table as DocxTable, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";
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
  Cell,
  AreaChart,
  Area
} from "recharts";

// Mock data for team performance
const teamPerformanceData = [
  { name: "Muhammad Shahood", performance: 92, tasksCompleted: 45, qualityScore: 94, efficiency: 88 },
  { name: "Hasan Abbas", performance: 88, tasksCompleted: 32, qualityScore: 91, efficiency: 85 },
  { name: "Adnan Amir", performance: 85, tasksCompleted: 28, qualityScore: 87, efficiency: 82 },
  { name: "Waleed Bin Shakeel", performance: 78, tasksCompleted: 15, qualityScore: 80, efficiency: 75 }
];

const monthlyTrendData = [
  { month: "Jan", teamPerformance: 85, tasksCompleted: 120, qualityScore: 88, efficiency: 82 },
  { month: "Feb", teamPerformance: 87, tasksCompleted: 135, qualityScore: 90, efficiency: 84 },
  { month: "Mar", teamPerformance: 89, tasksCompleted: 150, qualityScore: 91, efficiency: 86 },
  { month: "Apr", teamPerformance: 88, tasksCompleted: 142, qualityScore: 89, efficiency: 85 },
  { month: "May", teamPerformance: 91, tasksCompleted: 165, qualityScore: 93, efficiency: 88 },
  { month: "Jun", teamPerformance: 90, tasksCompleted: 158, qualityScore: 92, efficiency: 87 }
];

const campaignPerformanceData = [
  { name: "Summer Sale", teamScore: 94, tasksCompleted: 45, qualityIssues: 2, efficiency: 92 },
  { name: "Holiday Special", teamScore: 88, tasksCompleted: 38, qualityIssues: 5, efficiency: 85 },
  { name: "Black Friday", teamScore: 96, tasksCompleted: 52, qualityIssues: 1, efficiency: 94 },
  { name: "New Year Sale", teamScore: 82, tasksCompleted: 28, qualityIssues: 8, efficiency: 78 }
];

const skillDistributionData = [
  { name: "Click Quality", value: 35, color: "#8884d8" },
  { name: "Form Analysis", value: 25, color: "#82ca9d" },
  { name: "Bot Detection", value: 20, color: "#ffc658" },
  { name: "User Experience", value: 15, color: "#ff7300" },
  { name: "Data Analysis", value: 5, color: "#ff0000" }
];

const recentAchievements = [
  {
    id: 1,
    member: "Muhammad Shahood",
    achievement: "Top Performer",
    description: "Achieved highest quality score this month",
    date: "2024-01-20",
    type: "performance"
  },
  {
    id: 2,
    member: "Hasan Abbas",
    achievement: "Task Master",
    description: "Completed most tasks this week",
    date: "2024-01-19",
    type: "productivity"
  },
  {
    id: 3,
    member: "Adnan Amir",
    achievement: "Quality Champion",
    description: "Zero quality issues in assigned tasks",
    date: "2024-01-18",
    type: "quality"
  }
];

export default function ManagerPerformancePage() {
  const [timeRange, setTimeRange] = useState("6months");
  const [viewType, setViewType] = useState("overview");

  const getAchievementIcon = (type) => {
    switch (type) {
      case "performance":
        return <Award className="h-4 w-4 text-yellow-600" />;
      case "productivity":
        return <Target className="h-4 w-4 text-blue-600" />;
      case "quality":
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      default:
        return <Award className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-600";
    if (performance >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const exportToCSV = () => {
    const csvData = [
      // Headers
      ["Team Member", "Performance (%)", "Quality Score (%)", "Efficiency (%)", "Tasks Completed", "Status"],
      // Data rows
      ...teamPerformanceData.map(member => [
        member.name,
        member.performance,
        member.qualityScore,
        member.efficiency,
        member.tasksCompleted,
        member.performance >= 90 ? "Excellent" : member.performance >= 80 ? "Good" : "Needs Improvement"
      ])
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `team-performance-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Team Performance Report",
                bold: true,
                size: 32,
              }),
            ],
            alignment: "center",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on: ${new Date().toLocaleDateString()}`,
                size: 20,
              }),
            ],
            alignment: "center",
          }),
          new Paragraph({ text: "" }), // Empty line
          
          // Summary metrics
          new Paragraph({
            children: [
              new TextRun({
                text: "Summary Metrics",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Average Team Performance: ${Math.round(teamPerformanceData.reduce((sum, m) => sum + m.performance, 0) / teamPerformanceData.length)}%`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total Tasks Completed: ${teamPerformanceData.reduce((sum, m) => sum + m.tasksCompleted, 0)}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Average Quality Score: ${Math.round(teamPerformanceData.reduce((sum, m) => sum + m.qualityScore, 0) / teamPerformanceData.length)}%`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Team Efficiency: ${Math.round(teamPerformanceData.reduce((sum, m) => sum + m.efficiency, 0) / teamPerformanceData.length)}%`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Empty line
          
          // Individual performance table
          new Paragraph({
            children: [
              new TextRun({
                text: "Individual Performance Details",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new DocxTable({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Team Member")] }),
                  new TableCell({ children: [new Paragraph("Performance (%)")] }),
                  new TableCell({ children: [new Paragraph("Quality Score (%)")] }),
                  new TableCell({ children: [new Paragraph("Efficiency (%)")] }),
                  new TableCell({ children: [new Paragraph("Tasks Completed")] }),
                  new TableCell({ children: [new Paragraph("Status")] }),
                ],
              }),
              // Data rows
              ...teamPerformanceData.map(member => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(member.name)] }),
                    new TableCell({ children: [new Paragraph(member.performance.toString())] }),
                    new TableCell({ children: [new Paragraph(member.qualityScore.toString())] }),
                    new TableCell({ children: [new Paragraph(member.efficiency.toString())] }),
                    new TableCell({ children: [new Paragraph(member.tasksCompleted.toString())] }),
                    new TableCell({ 
                      children: [new Paragraph(
                        member.performance >= 90 ? "Excellent" : 
                        member.performance >= 80 ? "Good" : "Needs Improvement"
                      )] 
                    }),
                  ],
                })
              ),
            ],
          }),
          new Paragraph({ text: "" }), // Empty line
          
          // Recent achievements
          new Paragraph({
            children: [
              new TextRun({
                text: "Recent Team Achievements",
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...recentAchievements.map(achievement => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${achievement.achievement} - ${achievement.member}`,
                  bold: true,
                  size: 20,
                }),
              ],
            })
          ),
          ...recentAchievements.map(achievement => 
            new Paragraph({
              children: [
                new TextRun({
                  text: achievement.description,
                  size: 18,
                }),
              ],
            })
          ),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `team-performance-report-${new Date().toISOString().split('T')[0]}.docx`);
  };

  return (
    <ManagerMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Performance</h1>
            <p className="text-muted-foreground">Comprehensive analytics and insights for your team</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <Table className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToWord}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Filters</CardTitle>
            <CardDescription>Customize your team performance analysis</CardDescription>
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
                <label className="text-sm font-medium">View Type</label>
                <Select value={viewType} onValueChange={setViewType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select view type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="detailed">Detailed Analysis</SelectItem>
                    <SelectItem value="campaigns">Campaign Focus</SelectItem>
                    <SelectItem value="individual">Individual Performance</SelectItem>
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
              <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(teamPerformanceData.reduce((sum, m) => sum + m.performance, 0) / teamPerformanceData.length)}%
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +3.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamPerformanceData.reduce((sum, m) => sum + m.tasksCompleted, 0)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +15 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Quality Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(teamPerformanceData.reduce((sum, m) => sum + m.qualityScore, 0) / teamPerformanceData.length)}%
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(teamPerformanceData.reduce((sum, m) => sum + m.efficiency, 0) / teamPerformanceData.length)}%
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +1.8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Team Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Trend</CardTitle>
              <CardDescription>Monthly team performance progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="teamPerformance" stackId="1" stroke="#8884d8" fill="#8884d8" name="Team Performance" />
                    <Area type="monotone" dataKey="qualityScore" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Quality Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Individual Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Performance</CardTitle>
              <CardDescription>Team members&apos; performance comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="performance" fill="#8884d8" name="Performance" />
                    <Bar dataKey="qualityScore" fill="#82ca9d" name="Quality Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Team performance across different campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="teamScore" fill="#8884d8" name="Team Score" />
                  <Bar dataKey="efficiency" fill="#82ca9d" name="Efficiency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Team Skills Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Team Skills Distribution</CardTitle>
            <CardDescription>Breakdown of team expertise and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Individual Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Performance Details</CardTitle>
            <CardDescription>Detailed performance metrics for each team member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Team Member</th>
                    <th className="text-left py-3 px-4">Performance</th>
                    <th className="text-left py-3 px-4">Quality Score</th>
                    <th className="text-left py-3 px-4">Efficiency</th>
                    <th className="text-left py-3 px-4">Tasks Completed</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformanceData.map((member, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{member.name}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getPerformanceColor(member.qualityScore)}`}>
                          {member.qualityScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getPerformanceColor(member.efficiency)}`}>
                          {member.efficiency}%
                        </span>
                      </td>
                      <td className="py-3 px-4">{member.tasksCompleted}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          member.performance >= 90 ? "bg-green-100 text-green-800" :
                          member.performance >= 80 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {member.performance >= 90 ? "Excellent" :
                           member.performance >= 80 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Team Achievements</CardTitle>
            <CardDescription>Latest accomplishments and milestones from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getAchievementIcon(achievement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{achievement.achievement}</h4>
                      <Badge variant="secondary">{achievement.member}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerMainLayout>
  );
}
