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
import { CheckCircle, Clock, AlertCircle, Search, Filter, Eye, CheckSquare, X, Star, MessageSquare, Calendar, User, Target } from "lucide-react";

// Mock data for QC tasks
const mockQCTasks = [
  {
    id: 1,
    taskName: "Review Click Quality - Campaign A",
    assignedTo: "Muhammad Shahood",
    campaign: "Summer Sale Campaign",
    priority: "high",
    status: "pending",
    dueDate: "2024-01-15",
    description: "Review click quality and accuracy for Summer Sale Campaign",
    completedClicks: 45,
    totalClicks: 100,
    qualityScore: null
  },
  {
    id: 2,
    taskName: "Audit Form Submissions",
    assignedTo: "Hasan Abbas",
    campaign: "Holiday Special",
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-01-18",
    description: "Audit form submission quality and user experience",
    completedClicks: 23,
    totalClicks: 50,
    qualityScore: 87
  },
  {
    id: 3,
    taskName: "Validate Click Patterns",
    assignedTo: "Adnan Amir",
    campaign: "Black Friday",
    priority: "low",
    status: "completed",
    dueDate: "2024-01-10",
    description: "Validate click patterns and identify anomalies",
    completedClicks: 80,
    totalClicks: 80,
    qualityScore: 92
  },
  {
    id: 4,
    taskName: "Review Bot Detection",
    assignedTo: "Waleed Bin Shakeel",
    campaign: "New Year Sale",
    priority: "high",
    status: "pending",
    dueDate: "2024-01-20",
    description: "Review and validate bot detection algorithms",
    completedClicks: 0,
    totalClicks: 75,
    qualityScore: null
  }
];

export default function QCTasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewComments, setReviewComments] = useState("");

  const filteredTasks = mockQCTasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800"
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return variants[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Handle view task
  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  // Handle review task
  const handleReviewTask = (task) => {
    setSelectedTask(task);
    setReviewScore(task.qualityScore || 0);
    setReviewComments("");
    setShowReviewModal(true);
  };

  // Close modals
  const closeViewModal = () => {
    setSelectedTask(null);
    setShowViewModal(false);
  };

  const closeReviewModal = () => {
    setSelectedTask(null);
    setShowReviewModal(false);
    setReviewScore(0);
    setReviewComments("");
  };

  // Submit review
  const handleSubmitReview = () => {
    if (selectedTask) {
      // Update the task with review score and comments
      console.log(`Review submitted for task ${selectedTask.id}:`, {
        score: reviewScore,
        comments: reviewComments
      });
      
      // Here you would typically update the task in your state or send to API
      // For now, we'll just close the modal
      closeReviewModal();
    }
  };

  return (
    <QCMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground">Manage and review assigned quality control tasks</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQCTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockQCTasks.filter(t => t.status === "completed").length} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQCTasks.filter(t => t.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQCTasks.filter(t => t.status === "in_progress").length}</div>
              <p className="text-xs text-muted-foreground">
                Currently reviewing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Task Filters</CardTitle>
            <CardDescription>Filter and search through your assigned tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Tasks</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by task name, assignee, or campaign..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
            <CardDescription>
              {filteredTasks.length} task(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.taskName}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{task.assignedTo}</TableCell>
                      <TableCell>{task.campaign}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <Badge className={getStatusBadge(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(task.completedClicks / task.totalClicks) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {task.completedClicks}/{task.totalClicks}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTask(task)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {task.status !== "completed" && (
                            <Button 
                              size="sm"
                              onClick={() => handleReviewTask(task)}
                            >
                              <CheckSquare className="h-4 w-4 mr-1" />
                              Review
                            </Button>
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

        {/* View Task Modal */}
        {showViewModal && selectedTask && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Task Details</h2>
                <Button variant="ghost" size="sm" onClick={closeViewModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedTask.taskName}</h3>
                    <p className="text-muted-foreground mt-1">{selectedTask.description}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assignment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span><strong>Assigned To:</strong> {selectedTask.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span><strong>Campaign:</strong> {selectedTask.campaign}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700">Status & Priority</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedTask.status)}
                          <Badge className={getStatusBadge(selectedTask.status)}>
                            {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <Badge className={getPriorityBadge(selectedTask.priority)}>
                            {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700">Progress</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion Progress</span>
                        <span>{selectedTask.completedClicks}/{selectedTask.totalClicks} clicks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ width: `${(selectedTask.completedClicks / selectedTask.totalClicks) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((selectedTask.completedClicks / selectedTask.totalClicks) * 100)}% complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={closeViewModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Review Task Modal */}
        {showReviewModal && selectedTask && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Review Task</h2>
                <Button variant="ghost" size="sm" onClick={closeReviewModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Task Information */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{selectedTask.taskName}</h3>
                  <p className="text-muted-foreground">{selectedTask.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Assigned to:</span>
                    <Badge variant="outline">{selectedTask.assignedTo}</Badge>
                  </div>
                </div>

                {/* Quality Score */}
                <div className="space-y-3">
                  <Label htmlFor="qualityScore" className="text-sm font-semibold">
                    Quality Score (0-100)
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="qualityScore"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewScore}
                      onChange={(e) => setReviewScore(parseInt(e.target.value) || 0)}
                      className="w-32"
                      placeholder="Enter score"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${reviewScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{reviewScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Review Comments */}
                <div className="space-y-3">
                  <Label htmlFor="reviewComments" className="text-sm font-semibold">
                    Review Comments
                  </Label>
                  <textarea
                    id="reviewComments"
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Enter your review comments and feedback..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quality Indicators */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Quality Indicators</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Click Accuracy</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Form Quality</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>User Experience</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Overall Quality</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={closeReviewModal}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview}>
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
