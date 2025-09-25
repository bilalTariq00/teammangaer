"use client";

import { useState, useMemo } from "react";
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
  Table,
  CheckCircle
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
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { usePerformance } from "@/contexts/PerformanceContext";
import { Textarea } from "@/components/ui/textarea";

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
  const { user } = useAuth();
  const { users } = useUsers();
  const {
    performanceLevels,
    markDailyPerformance,
    getTeamPerformance,
    isPerformanceMarkedToday,
    getPerformanceLevelDetails,
    getWorkerPerformanceHistory,
    getWorkerPerformanceStats
  } = usePerformance();

  const today = new Date().toISOString().split('T')[0];
  const managerId = user?.id;
  const teamMembers = useMemo(() => {
    const manager = users.find(u => u.id === managerId);
    if (!manager?.assignedUsers) return [];
    return manager.assignedUsers
      .map(id => users.find(u => u.id === id))
      .filter(Boolean);
  }, [users, managerId]);

  // Dummy fallback metrics for assigned users when no history exists
  const dummyPerfByUserId = useMemo(() => ({
    5: { performance: 88, quality: 91, efficiency: 85, tasksCompleted: 32, statusLabel: 'Good' },
    6: { performance: 85, quality: 87, efficiency: 82, tasksCompleted: 28, statusLabel: 'Good' },
    7: { performance: 78, quality: 80, efficiency: 75, tasksCompleted: 15, statusLabel: 'Needs Improvement' }
  }), []);

  const [ratingsByUser, setRatingsByUser] = useState({});
  const [notesByUser, setNotesByUser] = useState({});

  const handleMark = (worker) => {
    const rating = ratingsByUser[worker.id] || 'average';
    const notes = notesByUser[worker.id] || '';
    markDailyPerformance(worker.id, managerId, user?.name || 'Manager', rating, notes);
  };

  // Today summary
  const teamToday = useMemo(() => getTeamPerformance(managerId, today), [getTeamPerformance, managerId, today]);
  const markedCount = (teamToday || []).filter(t => !!t.performance).length;

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

        {/* Status banner: No Performance Marked Today */}
        {teamMembers.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {markedCount === 0 ? 'No Performance Marked Today' : 'Today\'s Performance Progress'}
                  </CardTitle>
                  <CardDescription>
                    {markedCount === 0
                      ? 'Start marking performance for your team members to track their daily progress and help them improve.'
                      : `${markedCount} of ${teamMembers.length} team members marked today.`}
                  </CardDescription>
                  
                  {markedCount === 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Quick Start Guide
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Use the table below to mark performance for each team member</li>
                          <li>• Click the emoji buttons (🌟👍😐👎💔) to rate performance</li>
                          <li>• Add review notes for specific feedback</li>
                          <li>• Click the save button to record each rating</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Performance Rating Criteria
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🌟</span>
                              <span className="font-medium text-gray-700">Excellent</span>
                            </div>
                            <p className="text-gray-600 text-xs">Exceeds expectations, outstanding work quality</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">👍</span>
                              <span className="font-medium text-gray-700">Good</span>
                            </div>
                            <p className="text-gray-600 text-xs">Meets expectations, consistent performance</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">😐</span>
                              <span className="font-medium text-gray-700">Average</span>
                            </div>
                            <p className="text-gray-600 text-xs">Adequate performance, room for improvement</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">👎</span>
                              <span className="font-medium text-gray-700">Bad</span>
                            </div>
                            <p className="text-gray-600 text-xs">Below expectations, needs improvement</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Best Practice</p>
                            <p className="text-xs text-yellow-700">Mark performance at the end of each shift to ensure accurate and timely feedback for your team members.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Marked: {markedCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>Remaining: {teamMembers.length - markedCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Total: {teamMembers.length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {markedCount > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round((markedCount / Math.max(teamMembers.length, 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(markedCount / Math.max(teamMembers.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Daily Performance Marking */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Performance</CardTitle>
            <CardDescription>Mark today’s performance for your team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.length === 0 ? (
              <div className="text-sm text-muted-foreground">No team members assigned.</div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const marked = isPerformanceMarkedToday(member.id);
                  const history = getWorkerPerformanceHistory(member.id, 7);
                  const level = getPerformanceLevelDetails(ratingsByUser[member.id] || 'average');
                  return (
                    <Card key={member.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-base">{member.name}</CardTitle>
                              <CardDescription>{member.email}</CardDescription>
                            </div>
                          </div>
                          {marked ? (
                            <Badge className="bg-green-100 text-green-800">Marked Today</Badge>
                          ) : (
                            <Badge variant="outline">Not Marked</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-sm font-medium">Rating</label>
                            <Select
                              value={ratingsByUser[member.id] || "average"}
                              onValueChange={(val) => setRatingsByUser(prev => ({ ...prev, [member.id]: val }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {performanceLevels.map(level => (
                                  <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                              value={notesByUser[member.id] || ''}
                              onChange={(e) => setNotesByUser(prev => ({ ...prev, [member.id]: e.target.value }))}
                              placeholder="Add optional notes for today"
                              className="min-h-[40px]"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className={`text-xs ${level.color}`}>Selected: {getPerformanceLevelDetails(ratingsByUser[member.id] || 'average').label}</div>
                          <Button onClick={() => handleMark(member)} disabled={marked}>
                            {marked ? 'Already Marked' : 'Mark Today'}
                          </Button>
                        </div>
                        {history.length > 0 && (
                          <div className="pt-2">
                            <div className="text-xs text-muted-foreground mb-1">Last 7 days</div>
                            <div className="flex flex-wrap gap-2">
                              {history.map(h => (
                                <Badge key={`${member.id}-${h.date}`} variant="outline">
                                  {h.date}: {getPerformanceLevelDetails(h.rating).label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Team Members</CardTitle>
            <CardDescription>Your team members for whom you can mark performance</CardDescription>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <div className="text-sm text-muted-foreground">No team members assigned.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Today</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((m) => {
                      const marked = isPerformanceMarkedToday(m.id);
                      const rec = (teamToday || []).find(t => t.user?.id === m.id)?.performance;
                      const label = rec ? getPerformanceLevelDetails(rec.rating).label : null;
                      return (
                        <tr key={m.id} className="border-b">
                          <td className="py-3 px-4 font-medium">{m.name}</td>
                          <td className="py-3 px-4 text-gray-600">{m.email}</td>
                          <td className="py-3 px-4 text-gray-600">{m.workerType?.replace('-', ' ') || '—'}</td>
                          <td className="py-3 px-4">
                            {marked ? (
                              <Badge className="bg-green-100 text-green-800">{label || 'Marked'}</Badge>
                            ) : (
                              <Badge variant="outline">Not Marked</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

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

        {/* Key Metrics (live today where possible) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.length > 0 && teamToday.length > 0
                  ? (() => {
                      const ratingValues = { excellent: 95, good: 85, average: 75, bad: 60, worst: 45 };
                      const scores = teamToday.filter(t => t.performance).map(t => ratingValues[t.performance.rating] || 75);
                      return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                    })()
                  : Math.round(teamPerformanceData.reduce((sum, m) => sum + m.performance, 0) / teamPerformanceData.length)}%
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +3.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marked Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {markedCount}/{teamMembers.length}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                Today’s marked performance
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
                {teamMembers.length > 0 && teamToday.length > 0
                  ? (() => {
                      const ratingValues = { excellent: 95, good: 88, average: 75, bad: 62, worst: 50 };
                      const scores = teamToday.filter(t => t.performance).map(t => ratingValues[t.performance.rating] || 75);
                      return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                    })()
                  : Math.round(teamPerformanceData.reduce((sum, m) => sum + m.qualityScore, 0) / teamPerformanceData.length)}%
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
                {teamMembers.length > 0 && teamToday.length > 0
                  ? (() => {
                      const ratingValues = { excellent: 94, good: 86, average: 78, bad: 65, worst: 52 };
                      const scores = teamToday.filter(t => t.performance).map(t => ratingValues[t.performance.rating] || 75);
                      return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                    })()
                  : Math.round(teamPerformanceData.reduce((sum, m) => sum + m.efficiency, 0) / teamPerformanceData.length)}%
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

        {/* Individual Performance Table (Assigned Users) */}
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
                  {teamMembers.length === 0 && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-muted-foreground" colSpan={6}>No team members assigned.</td>
                    </tr>
                  )}
                  {teamMembers.map((m) => {
                    // Compute 30-day stats from context ratings
                    const stats = getWorkerPerformanceStats(m.id, 30);
                    let perfPct = Math.round((Number(stats.averageRating || 0) / 5) * 100);
                    let qualityPct = Math.max(0, Math.min(100, perfPct + 2));
                    let efficiencyPct = Math.max(0, Math.min(100, perfPct - 3));
                    let tasksCompleted = stats.totalDays; // treat marked days as completed tasks proxy

                    // If no data, use dummy fallback for assigned users
                    if (stats.totalDays === 0 && dummyPerfByUserId[m.id]) {
                      const d = dummyPerfByUserId[m.id];
                      perfPct = d.performance;
                      qualityPct = d.quality;
                      efficiencyPct = d.efficiency;
                      tasksCompleted = d.tasksCompleted;
                    }

                    const statusLabel = perfPct >= 90 ? "Excellent" : perfPct >= 80 ? "Good" : "Needs Improvement";
                    const statusClass = perfPct >= 90 ? "bg-green-100 text-green-800" : perfPct >= 80 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
                    return (
                      <tr key={m.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{m.name}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getPerformanceColor(perfPct)}`}>{perfPct}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getPerformanceColor(qualityPct)}`}>{qualityPct}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getPerformanceColor(efficiencyPct)}`}>{efficiencyPct}%</span>
                        </td>
                        <td className="py-3 px-4">{tasksCompleted}</td>
                        <td className="py-3 px-4">
                          <Badge className={statusClass}>{statusLabel}</Badge>
                        </td>
                      </tr>
                    );
                  })}
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
                      {new Date(achievement.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })}
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
