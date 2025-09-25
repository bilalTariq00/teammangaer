"use client";

import { useState } from "react";
import QCMainLayout from "@/components/layout/QCMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  CheckSquare, 
  X, 
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from "lucide-react";

// Mock data for QC tasks with IP tracking
const mockQCTasks = [
  {
    id: 1,
    workerName: "Muhammad Shahood",
    workerEmail: "muhammad@joyapps.net",
    workerRole: "clicker",
    taskType: "clicker",
    taskName: "Click Task - Campaign A",
    campaign: "Summer Sale Campaign",
    ip: "2603:7081:2000:447c:44dc:1efe:6fd:fbe6",
    device: "iPhone",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    region: "US",
    regionDetails: "New York / Rome",
    allowed: false,
    reason: "distance_not_close:2538.1km",
    submission: "-",
    deltaTime: "-",
    redirectLogged: "13:25:28",
    redirectDate: "2025-09-12",
    submissionTime: "-",
    status: "pending_review",
    screenshots: [
      {
        id: 1,
        url: "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Form+Screenshot+1",
        description: "Form filled screenshot"
      },
      {
        id: 2,
        url: "https://via.placeholder.com/800x600/059669/FFFFFF?text=Confirmation+Page",
        description: "Confirmation page screenshot"
      }
    ],
    formFilled: "yes",
    additionalDetails: "Successfully completed the form with all required fields",
    qcRating: null,
    qcComments: "",
    qcReviewedAt: null
  },
  {
    id: 2,
    workerName: "Hasan Abbas",
    workerEmail: "hasan@joyapps.net",
    workerRole: "both",
    taskType: "viewer",
    taskName: "Viewer Task 1 - Session Review",
    campaign: "Holiday Special",
    ip: "192.168.1.100",
    device: "Desktop",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    region: "US",
    regionDetails: "California / Los Angeles",
    allowed: true,
    reason: "location_verified",
    submission: "completed",
    deltaTime: "2m 15s",
    redirectLogged: "14:30:45",
    redirectDate: "2025-09-12",
    submissionTime: "14:32:45",
    status: "pending_review",
    screenshots: [
      {
        id: 3,
        url: "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Session+Screenshot",
        description: "Session review screenshot"
      }
    ],
    pageVisitCount: "2",
    selectedReason: "Good user experience",
    additionalDetails: "Session was smooth and user-friendly",
    qcRating: null,
    qcComments: "",
    qcReviewedAt: null
  },
  {
    id: 3,
    workerName: "Adnan Amir",
    workerEmail: "adnan@joyapps.net",
    workerRole: "viewer",
    taskType: "viewer",
    taskName: "Viewer Task 2 - Search Review",
    campaign: "Black Friday",
    ip: "10.0.0.50",
    device: "Android",
    userAgent: "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    region: "UK",
    regionDetails: "London / Manchester",
    allowed: true,
    reason: "location_verified",
    submission: "completed",
    deltaTime: "1m 45s",
    redirectLogged: "15:15:20",
    redirectDate: "2025-09-12",
    submissionTime: "15:17:05",
    status: "completed",
    screenshots: [
      {
        id: 4,
        url: "https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Search+Results",
        description: "Search results screenshot"
      }
    ],
    pageVisitCount: "1",
    selectedReason: "Content was relevant",
    additionalDetails: "Search functionality worked well",
    qcRating: "good",
    qcComments: "Excellent work, all requirements met",
    qcReviewedAt: "2025-09-12T15:30:00Z"
  },
  {
    id: 4,
    workerName: "Waleed Bin Shakeel",
    workerEmail: "waleed@joyapps.net",
    workerRole: "clicker",
    taskType: "clicker",
    taskName: "Click Task - Product Review",
    campaign: "New Year Sale",
    ip: "172.16.0.25",
    device: "iPad",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    region: "CA",
    regionDetails: "Toronto / Vancouver",
    allowed: false,
    reason: "device_mismatch:expected_mobile",
    submission: "-",
    deltaTime: "-",
    redirectLogged: "16:45:10",
    redirectDate: "2025-09-12",
    submissionTime: "-",
    status: "pending_review",
    screenshots: [
      {
        id: 5,
        url: "https://via.placeholder.com/800x600/EF4444/FFFFFF?text=Product+Page",
        description: "Product page screenshot"
      }
    ],
    formFilled: "no",
    additionalDetails: "Product page was not accessible",
    qcRating: null,
    qcComments: "",
    qcReviewedAt: null
  },
  {
    id: 5,
    workerName: "Sarah Johnson",
    workerEmail: "sarah@joyapps.net",
    workerRole: "clicker",
    taskType: "clicker",
    taskName: "Click Task - Newsletter Signup",
    campaign: "Spring Collection",
    ip: "203.0.113.45",
    device: "iPhone",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
    region: "AU",
    regionDetails: "Sydney / Melbourne",
    allowed: true,
    reason: "location_verified",
    submission: "completed",
    deltaTime: "3m 20s",
    redirectLogged: "17:20:30",
    redirectDate: "2025-09-12",
    submissionTime: "17:23:50",
    status: "completed",
    screenshots: [
      {
        id: 6,
        url: "https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Newsletter+Form",
        description: "Newsletter signup form"
      },
      {
        id: 7,
        url: "https://via.placeholder.com/800x600/06B6D4/FFFFFF?text=Success+Page",
        description: "Success confirmation page"
      }
    ],
    formFilled: "yes",
    additionalDetails: "Newsletter signup completed successfully",
    qcRating: "good",
    qcComments: "Perfect execution, all screenshots clear",
    qcReviewedAt: "2025-09-12T17:45:00Z"
  },
  {
    id: 6,
    workerName: "Alex Rodriguez",
    workerEmail: "alex@joyapps.net",
    workerRole: "both",
    taskType: "viewer",
    taskName: "Viewer Task 1 - Content Analysis",
    campaign: "Tech Launch",
    ip: "198.51.100.75",
    device: "Desktop",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    region: "US",
    regionDetails: "Texas / Houston",
    allowed: true,
    reason: "location_verified",
    submission: "completed",
    deltaTime: "4m 10s",
    redirectLogged: "18:10:15",
    redirectDate: "2025-09-12",
    submissionTime: "18:14:25",
    status: "rejected",
    screenshots: [
      {
        id: 8,
        url: "https://via.placeholder.com/800x600/F97316/FFFFFF?text=Content+Analysis",
        description: "Content analysis screenshot"
      }
    ],
    pageVisitCount: "3",
    selectedReason: "Content needs improvement",
    additionalDetails: "Content quality was below expectations",
    qcRating: "bad",
    qcComments: "Content quality issues, needs improvement",
    qcReviewedAt: "2025-09-12T18:30:00Z"
  }
];

export default function QCTasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [showUserAgentModal, setShowUserAgentModal] = useState(false);
  const [selectedUserAgent, setSelectedUserAgent] = useState("");
  const [tasks, setTasks] = useState(mockQCTasks);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.workerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.ip.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesTaskType = taskTypeFilter === "all" || task.taskType === taskTypeFilter;
    return matchesSearch && matchesStatus && matchesTaskType;
  });


  const handleShowUserAgent = (userAgent) => {
    setSelectedUserAgent(userAgent);
    setShowUserAgentModal(true);
  };

  const handleQcAction = (task, rating) => {
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === task.id 
          ? {
              ...t,
              qcRating: rating,
              qcReviewedAt: new Date().toISOString(),
              status: rating === "good" ? "completed" : "rejected"
            }
          : t
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  return (
    <QCMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">QC Tasks</h1>
            <p className="text-muted-foreground">Review worker tasks with IP tracking and quality control</p>
          </div>
        </div>

        {/* Stats Cards */}
      

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search through tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by worker, task, campaign, or IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                <div>
                  <Label htmlFor="taskType">Task Type</Label>
                  <Select value={taskTypeFilter} onValueChange={setTaskTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="clicker">Clicker</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Task Review Table</CardTitle>
            <CardDescription>
              {filteredTasks.length} task(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Form Filled</TableHead>
                    <TableHead>Image 1</TableHead>
                    <TableHead>Image 2</TableHead>
                    <TableHead>Δ Time</TableHead>
                    <TableHead>Redirect Logged</TableHead>
                    <TableHead>Submission Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-xs">{task.ip}</TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handleShowUserAgent(task.userAgent)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {task.device}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.region}</div>
                          <div className="text-xs text-gray-600">{task.regionDetails}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={task.formFilled === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {task.formFilled || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.screenshots && task.screenshots[0] ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(task.screenshots[0].url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.screenshots && task.screenshots[1] ? (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(task.screenshots[1].url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{task.deltaTime}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{task.redirectLogged}</div>
                          <div className="text-xs text-gray-600">{task.redirectDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>{task.submissionTime}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(task.status)}>
                          {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {task.status === "pending_review" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQcAction(task, "good")}
                                className="text-green-600 hover:text-green-800"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Good
                              </Button>
                            <Button 
                              size="sm"
                                variant="outline"
                                onClick={() => handleQcAction(task, "bad")}
                                className="text-red-600 hover:text-red-800"
                            >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Bad
                            </Button>
                            </>
                          ) : (
                            <Badge className={task.qcRating === "good" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {task.qcRating === "good" ? "Good" : "Bad"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Agent Modal */}
        {showUserAgentModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">User Agent</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowUserAgentModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-mono break-all">{selectedUserAgent}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={() => setShowUserAgentModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </QCMainLayout>
  );
}