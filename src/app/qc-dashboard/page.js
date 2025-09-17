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
  Users
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

  const handleTaskClick = (taskId) => {
    router.push(`/qc-tasks/${taskId}`);
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
                    <Button variant="outline" size="sm">
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
      </div>
    </QCMainLayout>
  );
}
