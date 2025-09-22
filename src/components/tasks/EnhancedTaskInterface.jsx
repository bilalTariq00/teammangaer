"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Eye,
  MousePointer,
  Calendar,
  User,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Timer,
  CheckSquare,
  Square
} from "lucide-react";
import { useEnhancedTasks } from "@/contexts/EnhancedTaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function EnhancedTaskInterface() {
  const { user } = useAuth();
  const { 
    getTasksForUser, 
    getCurrentTask, 
    getNextTask, 
    startTask, 
    startLinkReview,
    completeLinkReview,
    completeSubtask,
    completeClickerTask,
    completeFinalSubmission,
    reloadLink,
    areAllSubtasksCompleted
  } = useEnhancedTasks();
  
  const [activeTab, setActiveTab] = useState("current");
  const [currentTask, setCurrentTask] = useState(null);
  const [nextTask, setNextTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [sessionInstructionsCollapsed, setSessionInstructionsCollapsed] = useState(true);
  const [taskInstructionsCollapsed, setTaskInstructionsCollapsed] = useState(true);
  const [subtaskNotes, setSubtaskNotes] = useState("");
  const [clickerNotes, setClickerNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");

  useEffect(() => {
    if (user?.id) {
      const userTasks = getTasksForUser(user.id);
      const current = getCurrentTask(user.id);
      const next = getNextTask(user.id);
      
      setCurrentTask(current);
      setNextTask(next);
      setCompletedTasks(userTasks.filter(task => task.status === "completed"));
    }
  }, [user?.id, getTasksForUser, getCurrentTask, getNextTask]);

  const handleStartTask = (taskId) => {
    startTask(taskId);
    setCurrentTask(getCurrentTask(user.id));
    setNextTask(getNextTask(user.id));
    toast.success("Task started!");
  };

  const handleStartLinkReview = (subtaskId, linkId) => {
    startLinkReview(currentTask.id, subtaskId, linkId);
    toast.success("Link review started! Timer is running.");
  };

  const handleCompleteLinkReview = (subtaskId, linkId, quality) => {
    const notes = quality === "good" ? "Good quality link" : "Poor quality link";
    completeLinkReview(currentTask.id, subtaskId, linkId, notes, quality);
    toast.success(`Link marked as ${quality}!`);
  };

  const handleCompleteSubtask = (subtaskId) => {
    if (!subtaskNotes.trim()) {
      toast.error("Please add submission notes for this subtask");
      return;
    }
    
    completeSubtask(currentTask.id, subtaskId, subtaskNotes);
    setSubtaskNotes("");
    toast.success("Subtask completed!");
  };

  const handleCompleteClickerTask = (quality) => {
    if (!clickerNotes.trim()) {
      toast.error("Please add submission notes for the clicker task");
      return;
    }
    
    completeClickerTask(currentTask.id, clickerNotes, quality);
    setClickerNotes("");
    toast.success("Clicker task completed!");
  };

  const handleFinalSubmission = () => {
    if (!finalNotes.trim()) {
      toast.error("Please add final submission notes");
      return;
    }
    
    if (!areAllSubtasksCompleted(currentTask)) {
      toast.error("Please complete all subtasks before final submission");
      return;
    }
    
    completeFinalSubmission(currentTask.id, finalNotes);
    setFinalNotes("");
    toast.success("Task completed successfully!");
    
    // Refresh task data
    const userTasks = getTasksForUser(user.id);
    setCurrentTask(getCurrentTask(user.id));
    setNextTask(getNextTask(user.id));
    setCompletedTasks(userTasks.filter(task => task.status === "completed"));
  };

  const handleReloadLink = (subtaskId, linkId) => {
    reloadLink(currentTask.id, subtaskId, linkId);
    toast.success("Link reloaded with new masked URL!");
  };

  const openMaskedLink = (realUrl) => {
    // In a real implementation, this would make an AJAX call to get the real URL
    window.open(realUrl, '_blank');
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Task System</h2>
          <p className="text-gray-600">Complete your assigned tasks with detailed tracking</p>
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
          <CardContent className="p4">
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
                <p className="text-lg font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className="space-y-6">
          {/* Task Header */}
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

          {/* Instructions */}
          <div className="space-y-4">
            {/* Session Instructions */}
            <Collapsible 
              open={!sessionInstructionsCollapsed} 
              onOpenChange={setSessionInstructionsCollapsed}
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    {sessionInstructionsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {currentTask.sessionInstructions?.title || "Session Instructions"}
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {currentTask.sessionInstructions?.content || "No session instructions available."}
                    </p>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Task Instructions */}
            <Collapsible 
              open={!taskInstructionsCollapsed} 
              onOpenChange={setTaskInstructionsCollapsed}
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    {taskInstructionsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {currentTask.taskInstructions?.title || "Task Instructions"}
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {currentTask.taskInstructions?.content || "No task instructions available."}
                    </p>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Subtasks */}
          <div className="space-y-6">
            {currentTask.subtasks?.map((subtask, subtaskIndex) => (
              <Card key={subtask.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckSquare className={`h-5 w-5 ${subtask.status === "completed" ? "text-green-600" : "text-gray-400"}`} />
                      <div>
                        <CardTitle className="text-lg">{subtask.title}</CardTitle>
                        <CardDescription>
                          {subtask.links.length} links to review
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={subtask.status === "completed" ? "default" : "outline"}>
                      {subtask.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Links */}
                  {subtask.links.map((link, linkIndex) => (
                    <Card key={link.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{link.title}</h4>
                          <div className="flex items-center gap-2">
                            {link.completed ? (
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Masked URL:</span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openMaskedLink(link.realUrl)}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open Link
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReloadLink(subtask.id, link.id)}
                                className="flex items-center gap-1"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Reload
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 break-all">{link.displayUrl}</p>
                          <div className="mt-2">
                            <span className="font-medium">Proxy:</span>
                            <p className="text-sm text-gray-600">{link.proxy}</p>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium">Instructions:</span>
                            <p className="text-sm text-gray-600">{link.instructions}</p>
                          </div>
                        </div>

                        {!link.completed && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4" />
                              <span className="text-sm">Time Required: {link.timeRequired}s</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleStartLinkReview(subtask.id, link.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={link.status === "in_progress"}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start Review
                              </Button>
                              
                              <Button
                                onClick={() => handleCompleteLinkReview(subtask.id, link.id, "good")}
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                disabled={!link.status === "in_progress"}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Good
                              </Button>
                              
                              <Button
                                onClick={() => handleCompleteLinkReview(subtask.id, link.id, "bad")}
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                disabled={!link.status === "in_progress"}
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Mark Bad
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {/* Subtask Submission */}
                  {subtask.links.every(link => link.completed) && !subtask.submission.completed && (
                    <Card className="p-4 bg-green-50">
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-800">All links completed! Submit this subtask:</h4>
                        <div>
                          <Label htmlFor={`subtask-notes-${subtask.id}`}>Submission Notes *</Label>
                          <Textarea
                            id={`subtask-notes-${subtask.id}`}
                            value={subtaskNotes}
                            onChange={(e) => setSubtaskNotes(e.target.value)}
                            placeholder="Describe your review of this subtask..."
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <Button
                          onClick={() => handleCompleteSubtask(subtask.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Subtask
                        </Button>
                      </div>
                    </Card>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Clicker Task */}
            {currentTask.clickerTask && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MousePointer className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{currentTask.clickerTask.title}</CardTitle>
                        <CardDescription>Click analysis task</CardDescription>
                      </div>
                    </div>
                    <Badge variant={currentTask.clickerTask.status === "completed" ? "default" : "outline"}>
                      {currentTask.clickerTask.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentTask.clickerTask.links.map((link) => (
                    <Card key={link.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{link.title}</h4>
                          <div className="flex items-center gap-2">
                            {link.completed ? (
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Masked URL:</span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openMaskedLink(link.realUrl)}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open Link
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReloadLink("clicker", link.id)}
                                className="flex items-center gap-1"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Reload
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 break-all">{link.displayUrl}</p>
                          <div className="mt-2">
                            <span className="font-medium">Proxy:</span>
                            <p className="text-sm text-gray-600">{link.proxy}</p>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium">Instructions:</span>
                            <p className="text-sm text-gray-600">{link.instructions}</p>
                          </div>
                        </div>

                        {!link.completed && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4" />
                              <span className="text-sm">Time Required: {link.timeRequired}s</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleStartLinkReview("clicker", link.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start Click Analysis
                              </Button>
                            </div>
                          </div>
                        )}

                        {link.completed && !currentTask.clickerTask.submission.completed && (
                          <Card className="p-4 bg-blue-50">
                            <div className="space-y-3">
                              <h4 className="font-medium text-blue-800">Click analysis completed! Submit this task:</h4>
                              <div>
                                <Label htmlFor="clicker-notes">Submission Notes *</Label>
                                <Textarea
                                  id="clicker-notes"
                                  value={clickerNotes}
                                  onChange={(e) => setClickerNotes(e.target.value)}
                                  placeholder="Describe your click analysis..."
                                  rows={3}
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleCompleteClickerTask("good")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Good & Submit
                                </Button>
                                <Button
                                  onClick={() => handleCompleteClickerTask("bad")}
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Mark Bad & Submit
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Final Submission */}
            {areAllSubtasksCompleted(currentTask) && !currentTask.finalSubmission.completed && (
              <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-green-800">All Tasks Completed!</CardTitle>
                  <CardDescription>Submit your final review and complete the task</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="final-notes">Final Submission Notes *</Label>
                    <Textarea
                      id="final-notes"
                      value={finalNotes}
                      onChange={(e) => setFinalNotes(e.target.value)}
                      placeholder="Provide your overall assessment and final feedback..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleFinalSubmission}
                    className="bg-green-600 hover:bg-green-700 w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Final Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Next Task */}
      {nextTask && (
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
                Start Next Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
