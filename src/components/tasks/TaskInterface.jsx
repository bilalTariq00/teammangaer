"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Eye,
  MousePointer,
  Calendar,
  User
} from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import ClickerTask from "./ClickerTask";
import ViewerTask from "./ViewerTask";
import { toast } from "sonner";

export default function TaskInterface() {
  const { user } = useAuth();
  const { 
    getTasksForUser, 
    getCurrentTask, 
    getNextTask, 
    startTask, 
    isTaskExpired 
  } = useTasks();
  
  const [activeTab, setActiveTab] = useState("current");
  const [currentTask, setCurrentTask] = useState(null);
  const [nextTask, setNextTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expiredTasks, setExpiredTasks] = useState([]);

  useEffect(() => {
    if (user?.id) {
      const userTasks = getTasksForUser(user.id);
      const current = getCurrentTask(user.id);
      const next = getNextTask(user.id);
      
      setCurrentTask(current);
      setNextTask(next);
      setCompletedTasks(userTasks.filter(task => task.status === "completed"));
      setExpiredTasks(userTasks.filter(task => isTaskExpired(task)));
    }
  }, [user?.id, getTasksForUser, getCurrentTask, getNextTask, isTaskExpired]);

  const handleStartTask = (taskId) => {
    startTask(taskId);
    setCurrentTask(getCurrentTask(user.id));
    setNextTask(getNextTask(user.id));
    toast.success("Task started!");
  };

  const handleTaskComplete = () => {
    // Refresh task data
    const userTasks = getTasksForUser(user.id);
    setCurrentTask(getCurrentTask(user.id));
    setNextTask(getNextTask(user.id));
    setCompletedTasks(userTasks.filter(task => task.status === "completed"));
    
    toast.success("Task completed! Moving to next task...");
  };

  const getTaskIcon = (type) => {
    return type === "clicker" ? MousePointer : Eye;
  };

  const getTaskColor = (type) => {
    return type === "clicker" ? "text-blue-600" : "text-purple-600";
  };

  const getTaskBadgeColor = (type) => {
    return type === "clicker" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTaskOverdue = (task) => {
    return new Date(task.expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <p className="text-gray-600">Complete your assigned tasks</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>{user?.name}</span>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Task</p>
                <p className="text-lg font-bold">{currentTask ? "1" : "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Next Task</p>
                <p className="text-lg font-bold">{nextTask ? "1" : "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-lg font-bold">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-lg font-bold">{expiredTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Task</TabsTrigger>
          <TabsTrigger value="next">Next Task</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        {/* Current Task Tab */}
        <TabsContent value="current" className="space-y-6">
          {currentTask ? (
            <div className="space-y-6">
              {/* Task Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {React.createElement(getTaskIcon(currentTask.type), { 
                        className: `h-6 w-6 ${getTaskColor(currentTask.type)}` 
                      })}
                      <div>
                        <CardTitle className="text-xl">{currentTask.title}</CardTitle>
                        <CardDescription>{currentTask.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getTaskBadgeColor(currentTask.type)}>
                      {currentTask.type === "clicker" ? "Clicker Task" : "Viewer Task"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Expires: {formatDate(currentTask.expiryDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <span>Priority: {currentTask.priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Status: {currentTask.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Task Component */}
              {currentTask.type === "clicker" ? (
                <ClickerTask 
                  task={currentTask} 
                  onTaskComplete={handleTaskComplete}
                />
              ) : (
                <ViewerTask 
                  task={currentTask} 
                  onTaskComplete={handleTaskComplete}
                />
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Task</h3>
                <p className="text-gray-500">
                  You don't have any active tasks at the moment. Check the "Next Task" tab for upcoming assignments.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Next Task Tab */}
        <TabsContent value="next" className="space-y-6">
          {nextTask ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {React.createElement(getTaskIcon(nextTask.type), { 
                      className: `h-6 w-6 ${getTaskColor(nextTask.type)}` 
                    })}
                    <div>
                      <CardTitle className="text-xl">{nextTask.title}</CardTitle>
                      <CardDescription>{nextTask.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getTaskBadgeColor(nextTask.type)}>
                    {nextTask.type === "clicker" ? "Clicker Task" : "Viewer Task"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Expires: {formatDate(nextTask.expiryDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span>Priority: {nextTask.priority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Status: {nextTask.status}</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleStartTask(nextTask.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Next Task</h3>
                <p className="text-gray-500">
                  You don't have any upcoming tasks assigned. Check back later for new assignments.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Completed Tasks Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {React.createElement(getTaskIcon(task.type), { 
                        className: `h-6 w-6 ${getTaskColor(task.type)}` 
                      })}
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTaskBadgeColor(task.type)}>
                        {task.type === "clicker" ? "Clicker Task" : "Viewer Task"}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        Completed
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Completed: {formatDate(task.completedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Expired: {formatDate(task.expiryDate)}</span>
                    </div>
                  </div>
                  
                  {task.submissionDetails?.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Submission Notes:</p>
                      <p className="text-sm text-gray-600">{task.submissionDetails.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Tasks</h3>
                <p className="text-gray-500">
                  You haven't completed any tasks yet. Start working on your current task!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Expired Tasks Tab */}
        <TabsContent value="expired" className="space-y-4">
          {expiredTasks.length > 0 ? (
            expiredTasks.map((task) => (
              <Card key={task.id} className="border-red-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {React.createElement(getTaskIcon(task.type), { 
                        className: `h-6 w-6 ${getTaskColor(task.type)}` 
                      })}
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTaskBadgeColor(task.type)}>
                        {task.type === "clicker" ? "Clicker Task" : "Viewer Task"}
                      </Badge>
                      <Badge variant="outline" className="text-red-600">
                        Expired
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-red-600 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>This task has expired and cannot be completed</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Expired: {formatDate(task.expiryDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <span>Priority: {task.priority}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Expired Tasks</h3>
                <p className="text-gray-500">
                  Great! You don't have any expired tasks. Keep up the good work!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
