"use client";

import { useState } from "react";
import QCMainLayout from "@/components/layout/QCMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  FileCheck,
  Users,
  X,
  Calendar,
  User,
  MessageSquare,
  Star
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for QC assigned tasks
const mockAssignedTasks = [
  { 
    id: 1, 
    title: "Quality Check - Click Accuracy", 
    description: "Review click accuracy for Muhammad Shahood's recent tasks",
    priority: "high",
    status: "pending",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-16",
    worker: "Muhammad Shahood",
    taskCount: 25
  },
  { 
    id: 2, 
    title: "Form Fill Validation", 
    description: "Validate form fill quality for Alex Rodriguez's submissions",
    priority: "medium",
    status: "in_progress",
    assignedDate: "2024-01-14",
    dueDate: "2024-01-17",
    worker: "Alex Rodriguez",
    taskCount: 18
  },
  { 
    id: 3, 
    title: "Performance Review", 
    description: "Review overall performance metrics for Emma Wilson",
    priority: "low",
    status: "completed",
    assignedDate: "2024-01-13",
    dueDate: "2024-01-15",
    worker: "Emma Wilson",
    taskCount: 30
  },
  { 
    id: 4, 
    title: "Quality Audit - Trainee", 
    description: "Audit quality standards for new trainee Lisa Thompson",
    priority: "high",
    status: "pending",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-18",
    worker: "Lisa Thompson",
    taskCount: 12
  }
];

const mockQCStats = {
  totalTasks: 4,
  pendingTasks: 2,
  inProgressTasks: 1,
  completedTasks: 1,
  highPriorityTasks: 2,
  averageCompletionTime: 2.5,
  qualityScore: 94.2,
  workersReviewed: 4
};

export default function QCDashboard() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleTaskClick = (taskId) => {
    router.push(`/qc-tasks/${taskId}`);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setShowTaskModal(false);
  };

  const handleViewTasks = () => {
    router.push("/qc-tasks");
  };

  const handleViewReports = () => {
    router.push("/qc-reports");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
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
            <h1 className="text-3xl font-bold">QC Dashboard</h1>
            <p className="text-muted-foreground">Quality control tasks and performance monitoring</p>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQCStats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 font-medium">{mockQCStats.pendingTasks} pending</span>
              </p>
            </CardContent>
          </Card>

          {/* High Priority */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{mockQCStats.highPriorityTasks}</div>
              <p className="text-xs text-muted-foreground">
                Urgent tasks
              </p>
            </CardContent>
          </Card>

          {/* Quality Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockQCStats.qualityScore}%</div>
              <p className="text-xs text-muted-foreground">
                Average quality rating
              </p>
            </CardContent>
          </Card>

          {/* Workers Reviewed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workers Reviewed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQCStats.workersReviewed}</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
            <CardDescription>Your current quality control assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAssignedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Worker: {task.worker}</span>
                      <span>•</span>
                      <span>Tasks: {task.taskCount}</span>
                      <span>•</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(task);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest quality control activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed quality review for Emma Wilson</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Started validation for Alex Rodriguez</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Quality issue flagged for review</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New high-priority task assigned</p>
                    <p className="text-xs text-gray-500">8 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common quality control tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleViewTasks}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  View All Tasks
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleViewReports}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push("/qc-settings")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Review
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push("/qc-settings")}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Quality Standards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Detail Modal */}
        {showTaskModal && selectedTask && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Task Details</h2>
                <Button variant="ghost" size="sm" onClick={closeTaskModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Task Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{selectedTask.title}</h3>
                    <Badge className={getPriorityColor(selectedTask.priority)}>
                      {selectedTask.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedTask.status)}>
                      {selectedTask.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{selectedTask.description}</p>
                </div>

                {/* Task Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assignment Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span><strong>Worker:</strong> {selectedTask.worker}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span><strong>Task Count:</strong> {selectedTask.taskCount} tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span><strong>Assigned:</strong> {selectedTask.assignedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span><strong>Due Date:</strong> {selectedTask.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700">Task Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedTask.status === 'completed' ? 'bg-green-500' :
                          selectedTask.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-medium">
                          {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Priority: <span className="font-medium">{selectedTask.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Progress */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Progress Overview</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Task Completion</span>
                        <span className="text-sm text-gray-600">
                          {selectedTask.status === 'completed' ? '100%' : 
                           selectedTask.status === 'in_progress' ? '65%' : '0%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedTask.status === 'completed' ? 'bg-green-500' :
                            selectedTask.status === 'in_progress' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ 
                            width: selectedTask.status === 'completed' ? '100%' : 
                                   selectedTask.status === 'in_progress' ? '65%' : '0%'
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{selectedTask.taskCount}</div>
                        <div className="text-xs text-blue-700">Total Tasks</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {selectedTask.status === 'completed' ? selectedTask.taskCount : 
                           selectedTask.status === 'in_progress' ? Math.floor(selectedTask.taskCount * 0.65) : 0}
                        </div>
                        <div className="text-xs text-green-700">Completed</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {selectedTask.status === 'completed' ? 0 : 
                           selectedTask.status === 'in_progress' ? Math.ceil(selectedTask.taskCount * 0.35) : selectedTask.taskCount}
                        </div>
                        <div className="text-xs text-orange-700">Remaining</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Quality Metrics</h4>
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

                {/* Notes Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Notes & Comments
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {selectedTask.status === 'completed' 
                        ? 'Quality review completed successfully. All tasks met the required standards.'
                        : selectedTask.status === 'in_progress'
                        ? 'Quality review in progress. Currently evaluating task performance and accuracy.'
                        : 'Quality review pending. Awaiting task completion before evaluation.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={closeTaskModal}>
                  Close
                </Button>
                <Button onClick={() => {
                  closeTaskModal();
                  handleTaskClick(selectedTask.id);
                }}>
                  Go to Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </QCMainLayout>
  );
}
