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
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Eye, 
  CheckSquare, 
  X, 
  Star, 
  MessageSquare, 
  Calendar, 
  User, 
  Target,
  MousePointer,
  Eye as EyeIcon,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  FileText,
  Download,
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
  const [workerFilter, setWorkerFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [qcComments, setQcComments] = useState("");
  const [qcRating, setQcRating] = useState("");

  const filteredTasks = mockQCTasks.filter(task => {
    const matchesSearch = task.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.workerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.ip.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesTaskType = taskTypeFilter === "all" || task.taskType === taskTypeFilter;
    const matchesWorker = workerFilter === "all" || task.workerEmail === workerFilter;
    return matchesSearch && matchesStatus && matchesTaskType && matchesWorker;
  });

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setQcComments(task.qcComments || "");
    setQcRating(task.qcRating || "");
    setShowTaskModal(true);
  };

  const handleQcSubmit = () => {
    if (!qcRating) {
      alert("Please select a rating (Good or Bad)");
      return;
    }

    // Update the task with QC rating
    const taskIndex = mockQCTasks.findIndex(t => t.id === selectedTask.id);
    if (taskIndex !== -1) {
      mockQCTasks[taskIndex] = {
        ...selectedTask,
        qcRating,
        qcComments,
        qcReviewedAt: new Date().toISOString(),
        status: qcRating === "good" ? "completed" : "rejected"
      };
    }

    setShowTaskModal(false);
    setSelectedTask(null);
    setQcComments("");
    setQcRating("");
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

  const getTaskTypeIcon = (taskType) => {
    switch (taskType) {
      case "clicker":
        return <MousePointer className="h-4 w-4 text-blue-600" />;
      case "viewer":
        return <EyeIcon className="h-4 w-4 text-green-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTaskTypeBadge = (taskType) => {
    switch (taskType) {
      case "clicker":
        return "bg-blue-100 text-blue-800";
      case "viewer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAllowedBadge = (allowed) => {
    return allowed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const uniqueWorkers = [...new Set(mockQCTasks.map(task => task.workerEmail))];

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
                <div>
                  <Label htmlFor="worker">Worker</Label>
                  <Select value={workerFilter} onValueChange={setWorkerFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Workers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Workers</SelectItem>
                      {uniqueWorkers.map(worker => (
                        <SelectItem key={worker} value={worker}>{worker}</SelectItem>
                      ))}
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
                    <TableHead>Worker</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Allowed</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Submission</TableHead>
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
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.workerName}</div>
                          <div className="text-sm text-gray-600">{task.workerEmail}</div>
                          <Badge className={getTaskTypeBadge(task.workerRole)}>
                            {task.workerRole}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTaskTypeIcon(task.taskType)}
                          <div>
                            <div className="font-medium">{task.taskName}</div>
                            <div className="text-sm text-gray-600">{task.campaign}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{task.ip}</TableCell>
                      <TableCell>{task.device}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.region}</div>
                          <div className="text-xs text-gray-600">{task.regionDetails}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAllowedBadge(task.allowed)}>
                          {task.allowed ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-32 truncate" title={task.reason}>
                        {task.reason}
                      </TableCell>
                      <TableCell>{task.submission}</TableCell>
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
                        <Button 
                          onClick={() => handleViewTask(task)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Task Review Modal */}
        {showTaskModal && selectedTask && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Review Task</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowTaskModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Task Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Worker Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {selectedTask.workerName}</p>
                      <p><strong>Email:</strong> {selectedTask.workerEmail}</p>
                      <p><strong>Role:</strong> {selectedTask.workerRole}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Task Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Task:</strong> {selectedTask.taskName}</p>
                      <p><strong>Type:</strong> {selectedTask.taskType}</p>
                      <p><strong>Campaign:</strong> {selectedTask.campaign}</p>
                    </div>
                  </div>
                </div>

                {/* IP Tracking Info */}
                <div>
                  <h3 className="font-semibold mb-3">IP Tracking Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p><strong>IP Address:</strong></p>
                      <p className="font-mono text-xs">{selectedTask.ip}</p>
                    </div>
                    <div>
                      <p><strong>Device:</strong></p>
                      <p>{selectedTask.device}</p>
                    </div>
                    <div>
                      <p><strong>Region:</strong></p>
                      <p>{selectedTask.region} - {selectedTask.regionDetails}</p>
                    </div>
                    <div>
                      <p><strong>Allowed:</strong></p>
                      <Badge className={getAllowedBadge(selectedTask.allowed)}>
                        {selectedTask.allowed ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <p><strong>Reason:</strong></p>
                      <p className="text-xs">{selectedTask.reason}</p>
                    </div>
                    <div>
                      <p><strong>Submission:</strong></p>
                      <p>{selectedTask.submission}</p>
                    </div>
                    <div>
                      <p><strong>Δ Time:</strong></p>
                      <p>{selectedTask.deltaTime}</p>
                    </div>
                    <div>
                      <p><strong>Redirect Logged:</strong></p>
                      <p>{selectedTask.redirectLogged} - {selectedTask.redirectDate}</p>
                    </div>
                  </div>
                </div>

                {/* Screenshots */}
                {selectedTask.screenshots && selectedTask.screenshots.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Screenshots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTask.screenshots.map((screenshot) => (
                        <div key={screenshot.id} className="border rounded-lg p-3">
                          <img 
                            src={screenshot.url} 
                            alt={screenshot.description}
                            className="w-full h-48 object-cover rounded mb-2"
                          />
                          <p className="text-sm text-gray-600 mb-2">{screenshot.description}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(screenshot.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Task Details */}
                <div>
                  <h3 className="font-semibold mb-3">Task Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p><strong>Description:</strong> {selectedTask.taskName}</p>
                    {selectedTask.additionalDetails && (
                      <p><strong>Additional Details:</strong> {selectedTask.additionalDetails}</p>
                    )}
                    {selectedTask.formFilled && (
                      <p><strong>Form Filled:</strong> {selectedTask.formFilled}</p>
                    )}
                    {selectedTask.pageVisitCount && (
                      <p><strong>Pages Visited:</strong> {selectedTask.pageVisitCount}</p>
                    )}
                    {selectedTask.selectedReason && (
                      <p><strong>Reason:</strong> {selectedTask.selectedReason}</p>
                    )}
                  </div>
                </div>

                {/* QC Review */}
                <div>
                  <h3 className="font-semibold mb-3">QC Review</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="qcRating">Rating *</Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          type="button"
                          variant={qcRating === "good" ? "default" : "outline"}
                          onClick={() => setQcRating("good")}
                          className="flex items-center gap-2"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Good
                        </Button>
                        <Button
                          type="button"
                          variant={qcRating === "bad" ? "default" : "outline"}
                          onClick={() => setQcRating("bad")}
                          className="flex items-center gap-2"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          Bad
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="qcComments">Comments</Label>
                      <Textarea
                        id="qcComments"
                        placeholder="Add your QC comments here..."
                        value={qcComments}
                        onChange={(e) => setQcComments(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleQcSubmit}>
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </QCMainLayout>
  );
}