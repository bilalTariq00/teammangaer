"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, AlertCircle, ExternalLink, Copy, Send, Play, MousePointer, Timer, RefreshCw, Upload, Clock, X } from "lucide-react";
import { useEnhancedTasks } from "@/contexts/EnhancedTaskContext";
import { toast } from "sonner";

export default function UserTaskFlow({ currentTask, onTaskComplete }) {
  const { 
    startLinkReview,
    completeLinkReview,
    completeSubtask,
    completeClickerTask,
    completeFinalSubmission,
    reloadLink,
    areAllSubtasksCompleted
  } = useEnhancedTasks();
  
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [subtaskNotes, setSubtaskNotes] = useState("");
  const [clickerNotes, setClickerNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [screenshots, setScreenshots] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Task submission form states
  const [taskStatus, setTaskStatus] = useState("not-started");
  const [completionReason, setCompletionReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkClosed, setLinkClosed] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      toast.error("Time expired! Please reload the link and try again.");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartLinkReview = (subtaskId, linkId) => {
    startLinkReview(currentTask.id, subtaskId, linkId);
    setTimeRemaining(300); // 5 minutes timer
    setIsTimerActive(true);
    toast.success("Link review started! Timer is running.");
  };

  const handleCompleteLinkReview = (subtaskId, linkId, quality) => {
    const notes = quality === "good" ? "Good quality link" : "Poor quality link";
    completeLinkReview(currentTask.id, subtaskId, linkId, notes, quality);
    setIsTimerActive(false);
    setTimeRemaining(null);
    toast.success(`Link marked as ${quality}!`);
  };

  const handleScreenshotUpload = (subtaskId, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshots(prev => ({
          ...prev,
          [subtaskId]: e.target.result
        }));
        toast.success("Screenshot uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = (subtaskId) => {
    setScreenshots(prev => {
      const newScreenshots = { ...prev };
      delete newScreenshots[subtaskId];
      return newScreenshots;
    });
    toast.success("Screenshot removed!");
  };

  const handleCompleteSubtask = (subtaskId) => {
    if (!subtaskNotes.trim()) {
      toast.error("Please add submission notes for this subtask");
      return;
    }
    
    if (!screenshots[subtaskId]) {
      toast.error("Please upload a screenshot for this subtask");
      return;
    }
    
    completeSubtask(currentTask.id, subtaskId, subtaskNotes, screenshots[subtaskId]);
    setSubtaskNotes("");
    toast.success("Subtask completed!");
    
    // Move to next subtask
    const nextSubtaskIndex = currentSubtaskIndex + 1;
    if (nextSubtaskIndex < currentTask.subtasks.length) {
      setCurrentSubtaskIndex(nextSubtaskIndex);
      setCurrentLinkIndex(0);
    }
  };

  const handleCompleteClickerTask = (quality) => {
    if (!clickerNotes.trim()) {
      toast.error("Please add submission notes for the clicker task");
      return;
    }
    
    if (!screenshots.clicker) {
      toast.error("Please upload a screenshot for the clicker task");
      return;
    }
    
    completeClickerTask(currentTask.id, clickerNotes, quality, screenshots.clicker);
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
    
    if (onTaskComplete) {
      onTaskComplete();
    }
  };

  const handleReloadLink = (subtaskId, linkId) => {
    reloadLink(currentTask.id, subtaskId, linkId);
    setTimeRemaining(300); // Reset timer
    setIsTimerActive(true);
    toast.success("Link reloaded with new masked URL!");
  };

  const openMaskedLink = (realUrl) => {
    window.open(realUrl, '_blank');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleTaskSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Task submitted:", {
      taskStatus,
      completionReason,
      additionalDetails,
      pageCount,
      linkClosed
    });
    
    setIsSubmitting(false);
    
    // Reset form
    setTaskStatus("not-started");
    setCompletionReason("");
    setAdditionalDetails("");
    setPageCount("");
    setLinkClosed(false);
  };

  if (!currentTask) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Task</h3>
          <p className="text-gray-500">
            You don't have any active tasks at the moment. Check back later for new assignments.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentSubtask = currentTask.subtasks?.[currentSubtaskIndex];
  const allSubtasksCompleted = currentTask.subtasks?.every(subtask => subtask.submission.completed) || false;
  const showClickerTask = allSubtasksCompleted && currentTask.clickerTask;

  return (
    <div className="space-y-6">
      {/* Task Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{currentTask.title}</h3>
          <p className="text-gray-600">{currentTask.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            {currentTask.type === "clicker" ? "Clicker Task" : "Viewer Task"}
          </Badge>
          <Badge variant="outline">
            Expires: {new Date(currentTask.expiryDate).toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress: {currentSubtaskIndex + 1} of {currentTask.subtasks?.length || 0} viewer tasks</span>
          <span className="text-gray-500">
            {allSubtasksCompleted ? "Viewer tasks completed" : "In progress"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSubtaskIndex + (allSubtasksCompleted ? 1 : 0)) / (currentTask.subtasks?.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Viewer Subtask */}
      {currentSubtask && !allSubtasksCompleted && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className={`h-6 w-6 ${currentSubtask.submission.completed ? "text-green-600" : "text-gray-400"}`} />
                <div>
                  <CardTitle className="text-lg">{currentSubtask.title}</CardTitle>
                  <CardDescription>
                    {currentSubtask.links.length} links to review
                  </CardDescription>
                </div>
              </div>
              <Badge variant={currentSubtask.submission.completed ? "default" : "outline"}>
                {currentSubtask.submission.completed ? "Completed" : "In Progress"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Links */}
            {currentSubtask.links.map((link, linkIndex) => (
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
                            onClick={() => handleReloadLink(currentSubtask.id, link.id)}
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
                        {timeRemaining && (
                          <Badge variant="outline" className="ml-auto">
                            Time Left: {formatTime(timeRemaining)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleStartLinkReview(currentSubtask.id, link.id)}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                          disabled={link.status === "in_progress"}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Review
                        </Button>
                        
                        <Button
                          onClick={() => handleCompleteLinkReview(currentSubtask.id, link.id, "good")}
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50 flex-1"
                          disabled={link.status !== "in_progress"}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Good
                        </Button>
                        
                        <Button
                          onClick={() => handleCompleteLinkReview(currentSubtask.id, link.id, "bad")}
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

            {/* Subtask Submission Form - Like the image */}
            {currentSubtask.links.every(link => link.completed) && !currentSubtask.submission.completed && (
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800 text-lg">All links completed! Submit this subtask:</h4>
                  </div>
                  
                  {/* Task Status Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Select your task status:</Label>
                    <RadioGroup value={taskStatus} onValueChange={setTaskStatus}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="completed" id="completed" />
                        <Label htmlFor="completed" className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Task Completed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-completed" id="not-completed" />
                        <Label htmlFor="not-completed" className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          Task Not Completed
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Page Count (only show if completed) */}
                  {taskStatus === "completed" && (
                    <div className="space-y-2">
                      <Label htmlFor="page-count">Number of pages completed</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="page-count"
                          type="number"
                          value={pageCount}
                          onChange={(e) => setPageCount(e.target.value)}
                          placeholder="Enter number of pages"
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">pages</span>
                      </div>
                    </div>
                  )}

                  {/* Completion Reason (only show if not completed) */}
                  {taskStatus === "not-completed" && (
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Select the reason:</Label>
                      <RadioGroup value={completionReason} onValueChange={setCompletionReason}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="network-error" id="network-error" />
                          <Label htmlFor="network-error">Network error</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="environment-check-failed" id="environment-check-failed" />
                          <Label htmlFor="environment-check-failed">Environment check failed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="proxy-issue" id="proxy-issue" />
                          <Label htmlFor="proxy-issue">Proxy issue</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="link-opened-mistake" id="link-opened-mistake" />
                          <Label htmlFor="link-opened-mistake">Link opened by mistake</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Screenshot Upload - MANDATORY */}
                  <div>
                    <Label className="text-base font-medium">Screenshot Upload * (Required)</Label>
                    <div className="mt-2 space-y-2">
                      {screenshots[currentSubtask.id] ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={screenshots[currentSubtask.id]} 
                            alt="Screenshot" 
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeScreenshot(currentSubtask.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Upload screenshot for this subtask</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleScreenshotUpload(currentSubtask.id, e)}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-2">
                    <Label htmlFor="additional-details">Add any details that might help (optional)</Label>
                    <Textarea
                      id="additional-details"
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder="Enter any additional details..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Submission Info */}
                  <div className="text-sm text-gray-600">
                    If there is a recent link visit for your exit IP, we&apos;ll attach it; otherwise the submission is saved without a visit.
                  </div>

                  {/* Submit Button */}
                  <Button 
                    onClick={handleCompleteSubtask}
                    disabled={!screenshots[currentSubtask.id] || (taskStatus === "not-completed" && !completionReason) || (taskStatus === "completed" && !pageCount)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Task
                  </Button>
                </div>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Clicker Task - Only shows after all viewer tasks are completed */}
      {showClickerTask && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MousePointer className="h-6 w-6 text-purple-600" />
                <div>
                  <CardTitle className="text-lg">{currentTask.clickerTask.title}</CardTitle>
                  <CardDescription>Click analysis task - Complete after viewer tasks</CardDescription>
                </div>
              </div>
              <Badge variant={currentTask.clickerTask.submission.completed ? "default" : "outline"}>
                {currentTask.clickerTask.submission.completed ? "Completed" : "Ready"}
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
                        {timeRemaining && (
                          <Badge variant="outline" className="ml-auto">
                            Time Left: {formatTime(timeRemaining)}
                          </Badge>
                        )}
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
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                          <h4 className="font-medium text-purple-800 text-lg">Click analysis completed! Submit this task:</h4>
                        </div>
                        
                        {/* Task Status Selection */}
                        <div className="space-y-4">
                          <Label className="text-base font-semibold">Select your task status:</Label>
                          <RadioGroup value={taskStatus} onValueChange={setTaskStatus}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="completed" id="clicker-completed" />
                              <Label htmlFor="clicker-completed" className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Task Completed
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="not-completed" id="clicker-not-completed" />
                              <Label htmlFor="clicker-not-completed" className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                Task Not Completed
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Page Count (only show if completed) */}
                        {taskStatus === "completed" && (
                          <div className="space-y-2">
                            <Label htmlFor="clicker-page-count">Number of pages completed</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="clicker-page-count"
                                type="number"
                                value={pageCount}
                                onChange={(e) => setPageCount(e.target.value)}
                                placeholder="Enter number of pages"
                                className="flex-1"
                              />
                              <span className="text-sm text-gray-500">pages</span>
                            </div>
                          </div>
                        )}

                        {/* Completion Reason (only show if not completed) */}
                        {taskStatus === "not-completed" && (
                          <div className="space-y-4">
                            <Label className="text-base font-semibold">Select the reason:</Label>
                            <RadioGroup value={completionReason} onValueChange={setCompletionReason}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="network-error" id="clicker-network-error" />
                                <Label htmlFor="clicker-network-error">Network error</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="environment-check-failed" id="clicker-environment-check-failed" />
                                <Label htmlFor="clicker-environment-check-failed">Environment check failed</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="proxy-issue" id="clicker-proxy-issue" />
                                <Label htmlFor="clicker-proxy-issue">Proxy issue</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="link-opened-mistake" id="clicker-link-opened-mistake" />
                                <Label htmlFor="clicker-link-opened-mistake">Link opened by mistake</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="clicker-other" />
                                <Label htmlFor="clicker-other">Other</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        {/* Screenshot Upload - MANDATORY */}
                        <div>
                          <Label className="text-base font-medium">Screenshot Upload * (Required)</Label>
                          <div className="mt-2 space-y-2">
                            {screenshots.clicker ? (
                              <div className="flex items-center gap-2">
                                <img 
                                  src={screenshots.clicker} 
                                  alt="Screenshot" 
                                  className="w-20 h-20 object-cover rounded border"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeScreenshot("clicker")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">Upload screenshot for clicker task</p>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleScreenshotUpload("clicker", e)}
                                  className="text-sm"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-2">
                          <Label htmlFor="clicker-additional-details">Add any details that might help (optional)</Label>
                          <Textarea
                            id="clicker-additional-details"
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            placeholder="Enter any additional details..."
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Submission Info */}
                        <div className="text-sm text-gray-600">
                          If there is a recent link visit for your exit IP, we&apos;ll attach it; otherwise the submission is saved without a visit.
                        </div>
                        
                        {/* Submit Button */}
                        <Button
                          onClick={() => handleCompleteClickerTask("good")}
                          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                          disabled={!screenshots.clicker || (taskStatus === "not-completed" && !completionReason) || (taskStatus === "completed" && !pageCount)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit Task
                        </Button>
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
      {areAllSubtasksCompleted(currentTask) && currentTask.clickerTask?.submission?.completed && !currentTask.finalSubmission.completed && (
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
    </div>
  );
}