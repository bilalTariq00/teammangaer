"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Eye,
  MousePointer,
  Calendar,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Timer,
  CheckSquare,
  Square,
  Send,
  Copy
} from "lucide-react";
import { useEnhancedTasks } from "@/contexts/EnhancedTaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function EnhancedTaskFlow() {
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
  
  const [currentTask, setCurrentTask] = useState(null);
  const [nextTask, setNextTask] = useState(null);
  const [sessionInstructionsCollapsed, setSessionInstructionsCollapsed] = useState(true);
  const [taskInstructionsCollapsed, setTaskInstructionsCollapsed] = useState(true);
  const [subtaskNotes, setSubtaskNotes] = useState("");
  const [clickerNotes, setClickerNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);

  useEffect(() => {
    if (user?.id) {
      const baseTasks = getTasksForUser(user.id);
      const filtered = (user.taskRole === "viewer")
        ? baseTasks.filter(t => t.type === "viewer")
        : (user.taskRole === "clicker")
          ? baseTasks.filter(t => t.type === "clicker")
          : baseTasks;

      const active = filtered.filter(t => t.status === "assigned" || t.status === "in_progress");
      setCurrentTask(active[0] || null);
      setNextTask(active[1] || null);
    }
  }, [user?.id, user?.taskRole, getTasksForUser, getCurrentTask, getNextTask]);

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
  };

  const handleReloadLink = (subtaskId, linkId) => {
    reloadLink(currentTask.id, subtaskId, linkId);
    toast.success("Link reloaded with new masked URL!");
  };

  const openMaskedLink = (realUrl) => {
    // In a real implementation, this would make an AJAX call to get the real URL
    window.open(realUrl, '_blank');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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

  if (!currentTask) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Task</h3>
            <p className="text-gray-500">
              You don't have any active tasks at the moment. Check back later for new assignments.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canSeeViewer = user?.taskRole === "viewer" || user?.taskRole === "both" || !user?.taskRole;
  const canSeeClicker = user?.taskRole === "clicker" || user?.taskRole === "both" || !user?.taskRole;

  return (
    <div className="space-y-6">
      {/* Task Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{currentTask.title}</CardTitle>
              <CardDescription className="text-base">{currentTask.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {currentTask.type === "clicker" ? "Clicker Task" : "Viewer Task"}
              </Badge>
              <Badge variant="outline" className="text-orange-600">
                {currentTask.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Expires: {formatDate(currentTask.expiryDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Status: {currentTask.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <span>Priority: {currentTask.priority}</span>
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
            <Button variant="outline" className="w-full justify-between h-12">
              <span className="flex items-center gap-2">
                {sessionInstructionsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {currentTask.sessionInstructions?.title || "Session Task Instructions"}
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
            <Button variant="outline" className="w-full justify-between h-12">
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

      {/* Subtasks (viewer) */}
      {canSeeViewer && (
      <div className="space-y-6">
        {currentTask.subtasks?.map((subtask, subtaskIndex) => (
          <Card key={subtask.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className={`h-6 w-6 ${subtask.status === "completed" ? "text-green-600" : "text-gray-400"}`} />
                  <div>
                    <CardTitle className="text-xl">{subtask.title}</CardTitle>
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
                <Card key={link.id} className="p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-lg">{link.title}</h4>
                      <div className="flex items-center gap-2">
                        {link.completed ? (
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(link.displayUrl)}
                              className="flex items-center gap-1"
                            >
                              <Copy className="h-4 w-4" />
                              Copy
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 break-all font-mono bg-gray-100 p-2 rounded">
                          {link.displayUrl}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">Proxy:</span>
                            <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
                              {link.proxy}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Instructions:</span>
                            <p className="text-sm text-gray-600 mt-1">{link.instructions}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!link.completed && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Timer className="h-4 w-4" />
                          <span>Time Required: {link.timeRequired} seconds</span>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleStartLinkReview(subtask.id, link.id)}
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                            disabled={link.status === "in_progress"}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Review
                          </Button>
                          
                          <Button
                            onClick={() => handleCompleteLinkReview(subtask.id, link.id, "good")}
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50 flex-1"
                            disabled={link.status !== "in_progress"}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Good
                          </Button>
                          
                          <Button
                            onClick={() => handleCompleteLinkReview(subtask.id, link.id, "bad")}
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                            disabled={link.status !== "in_progress"}
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
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-800 text-lg">All links completed! Submit this subtask:</h4>
                    </div>
                    <div>
                      <Label htmlFor={`subtask-notes-${subtask.id}`} className="text-base font-medium">Submission Notes *</Label>
                      <Textarea
                        id={`subtask-notes-${subtask.id}`}
                        value={subtaskNotes}
                        onChange={(e) => setSubtaskNotes(e.target.value)}
                        placeholder="Describe your review of this subtask..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={() => handleCompleteSubtask(subtask.id)}
                      className="bg-green-600 hover:bg-green-700 w-full h-12"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Subtask
                    </Button>
                  </div>
                </Card>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Clicker Task */}
        {canSeeClicker && currentTask.clickerTask && (
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MousePointer className="h-6 w-6 text-purple-600" />
                  <div>
                    <CardTitle className="text-xl">{currentTask.clickerTask.title}</CardTitle>
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
                <Card key={link.id} className="p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-lg">{link.title}</h4>
                      <div className="flex items-center gap-2">
                        {link.completed ? (
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(link.displayUrl)}
                              className="flex items-center gap-1"
                            >
                              <Copy className="h-4 w-4" />
                              Copy
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 break-all font-mono bg-gray-100 p-2 rounded">
                          {link.displayUrl}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">Proxy:</span>
                            <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
                              {link.proxy}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Instructions:</span>
                            <p className="text-sm text-gray-600 mt-1">{link.instructions}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!link.completed && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Timer className="h-4 w-4" />
                          <span>Time Required: {link.timeRequired} seconds</span>
                        </div>
                        
                        <Button
                          onClick={() => handleStartLinkReview("clicker", link.id)}
                          className="bg-purple-600 hover:bg-purple-700 w-full h-12"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Click Analysis
                        </Button>
                      </div>
                    )}

                    {link.completed && !currentTask.clickerTask.submission.completed && (
                      <Card className="p-6 bg-purple-50 border-purple-200">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                            <h4 className="font-medium text-purple-800 text-lg">Click analysis completed! Submit this task:</h4>
                          </div>
                          <div>
                            <Label htmlFor="clicker-notes" className="text-base font-medium">Submission Notes *</Label>
                            <Textarea
                              id="clicker-notes"
                              value={clickerNotes}
                              onChange={(e) => setClickerNotes(e.target.value)}
                              placeholder="Describe your click analysis..."
                              rows={4}
                              className="mt-2"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleCompleteClickerTask("good")}
                              className="bg-green-600 hover:bg-green-700 flex-1 h-12"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Good & Submit
                            </Button>
                            <Button
                              onClick={() => handleCompleteClickerTask("bad")}
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 flex-1 h-12"
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
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 text-xl">All Tasks Completed!</CardTitle>
              <CardDescription className="text-green-700">Submit your final review and complete the task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="final-notes" className="text-base font-medium">Final Submission Notes *</Label>
                <Textarea
                  id="final-notes"
                  value={finalNotes}
                  onChange={(e) => setFinalNotes(e.target.value)}
                  placeholder="Provide your overall assessment and final feedback..."
                  rows={4}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleFinalSubmission}
                className="bg-green-600 hover:bg-green-700 w-full h-12"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Final Task
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Next Task Button */}
        {currentTask.finalSubmission.completed && nextTask && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-medium text-green-800">Task Completed Successfully!</h3>
              </div>
              <p className="text-gray-600">Ready for the next task?</p>
              <Button
                onClick={() => handleStartTask(nextTask.id)}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Next Task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}
