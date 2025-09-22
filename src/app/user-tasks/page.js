"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserMainLayout from "@/components/layout/UserMainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Play, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEnhancedTasks } from "@/contexts/EnhancedTaskContext";
import IPInstructions from "@/components/tasks/IPInstructions";
import TaskInstructions from "@/components/tasks/TaskInstructions";
import SessionInstructions from "@/components/tasks/SessionInstructions";
import TaskSubmission from "@/components/tasks/TaskSubmission";
import ViewerTask from "@/components/tasks/ViewerTask";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function UserTasksPage() {
  const { user } = useAuth();
  const { isAttendanceMarkedToday } = useAttendance();
  const { 
    getCurrentTask, 
    getNextTask, 
    startTask, 
    startLinkReview,
    completeLinkReview,
    completeSubtask,
    completeClickerTask,
    completeFinalSubmission,
    reloadLink,
    areAllSubtasksCompleted,
    resetTasks
  } = useEnhancedTasks();
  const router = useRouter();
  
  const [currentTask, setCurrentTask] = useState(null);
  const [nextTask, setNextTask] = useState(null);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTaskType, setCurrentTaskType] = useState('viewer'); // viewer, clicker
  const [taskSubmissionCollapsed, setTaskSubmissionCollapsed] = useState(false);
  const [viewerTask1Status, setViewerTask1Status] = useState('notCompleted');
  const [viewerTask2Status, setViewerTask2Status] = useState('notCompleted');
  const [clickerTaskStatus, setClickerTaskStatus] = useState('notCompleted');
  const [selectedReason1, setSelectedReason1] = useState('');
  const [selectedReason2, setSelectedReason2] = useState('');
  const [selectedReasonClicker, setSelectedReasonClicker] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [pageVisitCount, setPageVisitCount] = useState('');
  const [currentViewerTask, setCurrentViewerTask] = useState(1); // 1 or 2
  const [task1Submitted, setTask1Submitted] = useState(false);
  const [task2Submitted, setTask2Submitted] = useState(false);
  const [clickerSubmitted, setClickerSubmitted] = useState(false);
  const [expireTime, setExpireTime] = useState(null);
  const [countdownStarted, setCountdownStarted] = useState(false);

  // Check if attendance is marked for today
  useEffect(() => {
    if (user && (user.role === 'worker' || user.role === 'user')) {
      const attendanceMarked = isAttendanceMarkedToday(user.id);
      if (!attendanceMarked) {
        router.push('/user-dashboard');
      }
    }
  }, [user, isAttendanceMarkedToday, router]);

  // Load current task
  useEffect(() => {
    if (user?.id) {
      console.log("User ID:", user.id);
      console.log("User:", user);
      const current = getCurrentTask(user.id);
      const next = getNextTask(user.id);
      console.log("Current task:", current);
      console.log("Next task:", next);
      setCurrentTask(current);
      setNextTask(next);
    }
  }, [user?.id, getCurrentTask, getNextTask]);

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

  const handleStartTask = (taskId) => {
    startTask(taskId);
    setCurrentTask(getCurrentTask(user.id));
    setNextTask(getNextTask(user.id));
    toast.success("Task started!");
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


  const handleSubtaskSubmit = async (submissionData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the subtask
    completeSubtask(currentTask.id, currentTask.subtasks[currentSubtaskIndex].id, submissionData.additionalDetails, submissionData.screenshot);
    
    toast.success("Task submitted successfully!");
    setIsSubmitting(false);
    
    // Move to next task type
    if (currentTaskType === 'viewer1') {
      setCurrentTaskType('viewer2');
      setCurrentSubtaskIndex(0);
      setTaskStatus('notCompleted');
      setSelectedReason('');
      setAdditionalDetails('');
      setScreenshot(null);
      setPageVisitCount('');
      toast.success("Viewer Task 1 completed! Moving to Viewer Task 2 with new data.");
    } else if (currentTaskType === 'viewer2') {
      setCurrentTaskType('clicker');
      setCurrentSubtaskIndex(0);
      setTaskStatus('notCompleted');
      setSelectedReason('');
      setAdditionalDetails('');
      setScreenshot(null);
      setPageVisitCount('');
      toast.success("Viewer Task 2 completed! Moving to Clicker Task with new data.");
    } else {
      // Clicker task completed, reset to viewer1
      setCurrentTaskType('viewer1');
      setCurrentSubtaskIndex(0);
      setTaskStatus('notCompleted');
      setSelectedReason('');
      setAdditionalDetails('');
      setScreenshot(null);
      setPageVisitCount('');
      toast.success("Clicker Task completed! Starting new cycle with Viewer Task 1.");
    }
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Refresh task data
    setCurrentTask(getCurrentTask(user.id));
    setNextTask(getNextTask(user.id));
  };

  const handleClickerSubmit = async (submissionData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the clicker task
    completeClickerTask(currentTask.id, submissionData.additionalDetails, "good", submissionData.screenshot);
    
    toast.success("Clicker task completed! All tasks finished.");
    setIsSubmitting(false);
    
    // Reset to start over or move to next task
    setCurrentTaskType('viewer1');
    setCurrentSubtaskIndex(0);
    setTaskStatus('notCompleted');
    setSelectedReason('');
    setAdditionalDetails('');
    setScreenshot(null);
    setPageVisitCount('');
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Refresh task data
    setCurrentTask(getCurrentTask(user.id));
    setNextTask(getNextTask(user.id));
  };

  const handleLinkClosed = () => {
    toast.info("Link closed by mistake - you can continue with the task");
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScreenshot(file);
      toast.success("Screenshot uploaded successfully!");
    }
  };

  const isFormValid = (taskNumber) => {
    const taskStatus = taskNumber === 1 ? viewerTask1Status : viewerTask2Status;
    const selectedReason = taskNumber === 1 ? selectedReason1 : selectedReason2;
    
    if (taskStatus === 'completed') {
      return screenshot && pageVisitCount;
    } else if (taskStatus === 'notCompleted') {
      return selectedReason;
    }
    return false;
  };

  const isClickerFormValid = () => {
    if (clickerTaskStatus === 'completed') {
      return screenshot && pageVisitCount;
    } else if (clickerTaskStatus === 'notCompleted') {
      return selectedReasonClicker;
    }
    return false;
  };

  const startCountdown = (expiresIn) => {
    // Only start if not already started
    if (countdownStarted) return;
    
    // Parse the expiresIn string (e.g., "09:56" -> 9 minutes 56 seconds)
    const [minutes, seconds] = expiresIn.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    setExpireTime(totalSeconds);
    setTimeRemaining(totalSeconds);
    setCountdownStarted(true);
  };

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining => {
          if (timeRemaining <= 1) {
            clearInterval(interval);
            return 0;
          }
          return timeRemaining - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Scroll to top when task type changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTaskType]);

  const handleViewerTaskSubmit = (taskNumber) => {
    const taskStatus = taskNumber === 1 ? viewerTask1Status : viewerTask2Status;
    const selectedReason = taskNumber === 1 ? selectedReason1 : selectedReason2;
    
    if (taskStatus === 'completed') {
      if (!screenshot) {
        toast.error("Screenshot is mandatory when task is completed!");
        return;
      }
      if (!pageVisitCount) {
        toast.error("Please select how many pages you visited!");
        return;
      }
    } else if (taskStatus === 'notCompleted') {
      if (!selectedReason) {
        toast.error("Please select a reason for not completing the task!");
        return;
      }
    } else {
      toast.error("Please select a task status!");
      return;
    }

    const submissionData = {
      additionalDetails,
      screenshot: screenshot ? URL.createObjectURL(screenshot) : null,
      taskStatus,
      selectedReason,
      pageVisitCount
    };

            // Update the specific task status
            if (taskNumber === 1) {
              setViewerTask1Status('completed');
              setTask1Submitted(true);
              toast.success("Viewer Task 1 completed!");
            } else {
              setViewerTask2Status('completed');
              setTask2Submitted(true);
              toast.success("Viewer Task 2 completed!");
            }

    // Reset form
    if (taskNumber === 1) {
      setSelectedReason1('');
    } else {
      setSelectedReason2('');
    }
    setAdditionalDetails('');
    setScreenshot(null);
    setPageVisitCount('');
  };

  const handleReloadLink = (taskNumber) => {
    if (taskNumber === 1) {
      setViewerTask1Status('notCompleted');
      setSelectedReason1('');
      toast.success("Viewer Task 1 link reloaded!");
    } else if (taskNumber === 2) {
      setViewerTask2Status('notCompleted');
      setSelectedReason2('');
      toast.success("Viewer Task 2 link reloaded!");
    } else if (taskNumber === 3) {
      setClickerTaskStatus('notCompleted');
      setSelectedReasonClicker('');
      toast.success("Clicker Task link reloaded!");
    }
  };

  const handleNextTask = () => {
    if (viewerTask1Status !== 'completed' || viewerTask2Status !== 'completed') {
      toast.error("Please complete both viewer tasks first!");
      return;
    }
    
    setCurrentTaskType('clicker');
    setCountdownStarted(false); // Reset countdown for new task
    toast.success("Moving to Clicker Task!");
  };

  if (!user) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center h-64">
              <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
              </div>
        </div>
      </UserMainLayout>
    );
  }

  const currentSubtask = currentTask?.subtasks?.[currentSubtaskIndex];
  const allSubtasksCompleted = currentTask?.subtasks?.every(subtask => subtask.submission.completed) || false;
  const showClickerTask = allSubtasksCompleted && currentTask?.clickerTask;
  const showNextTask = allSubtasksCompleted && currentTask?.clickerTask?.submission?.completed && nextTask;

  return (
    <UserMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Task instructions for {user?.name}
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentTaskType === 'viewer' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {currentTaskType === 'viewer' ? 'Viewer Tasks (1 & 2)' : 'Clicker Task'}
              </span>
            </div>
          </div>
                  <Button 
            onClick={() => {
              resetTasks();
              setCurrentTask(getCurrentTask(user.id));
              setNextTask(getNextTask(user.id));
              setCurrentTaskType('viewer');
              setCurrentSubtaskIndex(0);
              setViewerTask1Status('notCompleted');
              setViewerTask2Status('notCompleted');
              setClickerTaskStatus('notCompleted');
              setSelectedReason1('');
              setSelectedReason2('');
              setSelectedReasonClicker('');
              setAdditionalDetails('');
              setScreenshot(null);
              setPageVisitCount('');
              setTask1Submitted(false);
              setTask2Submitted(false);
              setClickerSubmitted(false);
              setCountdownStarted(false);
            }}
                variant="outline" 
                className="text-red-600 hover:text-red-700"
              >
            Reset Tasks (Debug)
              </Button>
            </div>

        {/* Show current task if available */}
        {currentTask ? (
          <div className="space-y-6">
            {currentTaskType === 'viewer' ? (
              <>
                {/* IP and One time Link Instructions for Task 1 */}
                <IPInstructions 
                  taskType="viewer1"
                  taskIndex={0}
                  timeRemaining={timeRemaining}
                  formatTime={formatTime}
                  startCountdown={startCountdown}
                />

            {/* Task Instructions - Collapsible */}
                <TaskInstructions 
                  task={currentTask} 
                  taskType="viewer1"
                />

            {/* Session Task Instructions - Collapsible */}
                <SessionInstructions 
                  task={currentTask} 
                  taskType="viewer1"
                />

                {/* Viewer Task 1 */}
                <Card>
                  <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
                    <CardTitle className="text-blue-800 text-lg font-semibold">
                      Viewer Task 1
                    </CardTitle>
                    <CardDescription>
                      Complete the first viewer task
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <h5 className="font-medium">Task status</h5>
                      <RadioGroup value={viewerTask1Status} onValueChange={setViewerTask1Status} className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="completed" id="task1-completed" />
                          <label htmlFor="task1-completed" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Completed
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="notCompleted" id="task1-notCompleted" />
                          <label htmlFor="task1-notCompleted" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Not completed
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {viewerTask1Status === 'notCompleted' && (
                      <div className="space-y-3">
                        <h5 className="font-medium">Select the reason:</h5>
                        <RadioGroup value={selectedReason1} onValueChange={setSelectedReason1} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="networkError" id="task1-networkError" />
                            <label htmlFor="task1-networkError" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Network error
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="environmentCheck" id="task1-environmentCheck" />
                            <label htmlFor="task1-environmentCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Environment check failed
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="proxyIssue" id="task1-proxyIssue" />
                            <label htmlFor="task1-proxyIssue" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Proxy issue
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="linkOpened" id="task1-linkOpened" />
                            <label htmlFor="task1-linkOpened" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Link opened by mistake
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="task1-other" />
                            <label htmlFor="task1-other" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Other
                            </label>
                          </div>
                        </RadioGroup>
                        
                        <Button 
                          onClick={() => handleReloadLink(1)}
                          variant="outline"
                          className="w-full"
                        >
                          Reload Link
                        </Button>
                      </div>
                    )}

                    {viewerTask1Status === 'completed' && (
                      <div className="space-y-3">
                        <h5 className="font-medium">Did you visit 1 page or 2 pages on the site?</h5>
                        <RadioGroup value={pageVisitCount} onValueChange={setPageVisitCount} className="flex space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="task1-page1" />
                            <label htmlFor="task1-page1" className="text-sm font-medium text-gray-700 cursor-pointer">
                              1 page
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="task1-page2" />
                            <label htmlFor="task1-page2" className="text-sm font-medium text-gray-700 cursor-pointer">
                              2 pages
                            </label>
                          </div>
                        </RadioGroup>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Upload Screenshot <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="w-full p-2 border rounded-md"
                            required
                          />
                          {screenshot && (
                            <p className="text-sm text-green-600">✓ Screenshot uploaded: {screenshot.name}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => handleViewerTaskSubmit(1)}
                      disabled={task1Submitted || !isFormValid(1)}
                      className={`w-full ${task1Submitted ? 'bg-gray-400 cursor-not-allowed' : !isFormValid(1) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {task1Submitted ? 'Submitted' : !isFormValid(1) ? 'Fill Required Fields' : 'Submit Task 1'}
                    </Button>
                  </CardContent>
                </Card>

                {/* IP and One time Link Instructions for Task 2 */}
                <IPInstructions 
                  taskType="viewer2"
                  taskIndex={1}
                timeRemaining={timeRemaining}
                  formatTime={formatTime}
                  startCountdown={startCountdown}
                />

                {/* Viewer Task 2 */}
                <Card>
                  <CardHeader className="bg-green-50 border-b-2 border-green-200">
                    <CardTitle className="text-green-800 text-lg font-semibold">
                      Viewer Task 2
                    </CardTitle>
                    <CardDescription>
                      Complete the second viewer task
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <h5 className="font-medium">Task status</h5>
                      <RadioGroup value={viewerTask2Status} onValueChange={setViewerTask2Status} className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="completed" id="task2-completed" />
                          <label htmlFor="task2-completed" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Completed
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="notCompleted" id="task2-notCompleted" />
                          <label htmlFor="task2-notCompleted" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Not completed
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {viewerTask2Status === 'notCompleted' && (
                      <div className="space-y-3">
                        <h5 className="font-medium">Select the reason:</h5>
                        <RadioGroup value={selectedReason2} onValueChange={setSelectedReason2} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="networkError" id="task2-networkError" />
                            <label htmlFor="task2-networkError" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Network error
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="environmentCheck" id="task2-environmentCheck" />
                            <label htmlFor="task2-environmentCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Environment check failed
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="proxyIssue" id="task2-proxyIssue" />
                            <label htmlFor="task2-proxyIssue" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Proxy issue
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="linkOpened" id="task2-linkOpened" />
                            <label htmlFor="task2-linkOpened" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Link opened by mistake
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="task2-other" />
                            <label htmlFor="task2-other" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Other
                            </label>
                          </div>
                        </RadioGroup>
                        
                        <Button 
                          onClick={() => handleReloadLink(2)}
                          variant="outline"
                          className="w-full"
                        >
                          Reload Link
                        </Button>
                      </div>
                    )}

                    {viewerTask2Status === 'completed' && (
                      <div className="space-y-3">
                        <h5 className="font-medium">Did you visit 1 page or 2 pages on the site?</h5>
                        <RadioGroup value={pageVisitCount} onValueChange={setPageVisitCount} className="flex space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="task2-page1" />
                            <label htmlFor="task2-page1" className="text-sm font-medium text-gray-700 cursor-pointer">
                              1 page
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="task2-page2" />
                            <label htmlFor="task2-page2" className="text-sm font-medium text-gray-700 cursor-pointer">
                              2 pages
                            </label>
                          </div>
                        </RadioGroup>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Upload Screenshot <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="w-full p-2 border rounded-md"
                            required
                          />
                          {screenshot && (
                            <p className="text-sm text-green-600">✓ Screenshot uploaded: {screenshot.name}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => handleViewerTaskSubmit(2)}
                      disabled={task2Submitted || !isFormValid(2)}
                      className={`w-full ${task2Submitted ? 'bg-gray-400 cursor-not-allowed' : !isFormValid(2) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {task2Submitted ? 'Submitted' : !isFormValid(2) ? 'Fill Required Fields' : 'Submit Task 2'}
                    </Button>
                  </CardContent>
                </Card>

            {/* Next Task Button */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-medium text-green-800">Ready for Clicker Task?</h3>
            </div>
                    <p className="text-gray-600">Complete both viewer tasks to proceed to the clicker task.</p>
            <Button 
                      onClick={handleNextTask}
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                  >
                    <Play className="h-4 w-4 mr-2" />
                      Next Task (Clicker)
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Clicker Task */}
                <IPInstructions 
                  taskType="clicker"
                  taskIndex={0}
                  timeRemaining={timeRemaining}
                  formatTime={formatTime}
                  startCountdown={startCountdown}
                />

                <TaskInstructions 
                  task={currentTask} 
                  taskType="clicker"
                />

                <SessionInstructions 
                  task={currentTask} 
                  taskType="clicker"
                />

                <Card>
                  <CardHeader className="bg-purple-50 border-b-2 border-purple-200">
                    <CardTitle className="text-purple-800 text-lg font-semibold">
                      Clicker Task
                    </CardTitle>
                    <CardDescription>
                      Complete the clicker task
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <h5 className="font-medium">Task status</h5>
                      <RadioGroup value={clickerTaskStatus} onValueChange={setClickerTaskStatus} className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="completed" id="clicker-completed" />
                          <label htmlFor="clicker-completed" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Completed
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="notCompleted" id="clicker-notCompleted" />
                          <label htmlFor="clicker-notCompleted" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Not completed
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {clickerTaskStatus === 'notCompleted' && (
                      <div className="space-y-3">
                        <h5 className="font-medium">Select the reason:</h5>
                        <RadioGroup value={selectedReasonClicker} onValueChange={setSelectedReasonClicker} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="networkError" id="clicker-networkError" />
                            <label htmlFor="clicker-networkError" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Network error
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="environmentCheck" id="clicker-environmentCheck" />
                            <label htmlFor="clicker-environmentCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Environment check failed
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="proxyIssue" id="clicker-proxyIssue" />
                            <label htmlFor="clicker-proxyIssue" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Proxy issue
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="linkOpened" id="clicker-linkOpened" />
                            <label htmlFor="clicker-linkOpened" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Link opened by mistake
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="clicker-other" />
                            <label htmlFor="clicker-other" className="text-sm font-medium text-gray-700 cursor-pointer">
                              Other
                            </label>
                          </div>
                        </RadioGroup>
                        
                        <Button 
                          onClick={() => handleReloadLink(3)}
                          variant="outline"
                          className="w-full"
                        >
                          Reload Link
                        </Button>
                      </div>
                    )}

                    {clickerTaskStatus === 'completed' && (
                      <div className="space-y-3">
                        <h5 className="font-medium">Did you visit 1 page or 2 pages on the site?</h5>
                        <RadioGroup value={pageVisitCount} onValueChange={setPageVisitCount} className="flex space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="clicker-page1" />
                            <label htmlFor="clicker-page1" className="text-sm font-medium text-gray-700 cursor-pointer">
                              1 page
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="clicker-page2" />
                            <label htmlFor="clicker-page2" className="text-sm font-medium text-gray-700 cursor-pointer">
                              2 pages
                            </label>
                          </div>
                        </RadioGroup>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Upload Screenshot <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="w-full p-2 border rounded-md"
                            required
                          />
                          {screenshot && (
                            <p className="text-sm text-green-600">✓ Screenshot uploaded: {screenshot.name}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => {
                        if (clickerTaskStatus === 'notCompleted' && !selectedReasonClicker) {
                          toast.error("Please select a reason for not completing the task!");
                          return;
                        }
                        
                        if (clickerTaskStatus === 'completed') {
                          if (!screenshot) {
                            toast.error("Screenshot is mandatory when task is completed!");
                            return;
                          }
                          if (!pageVisitCount) {
                            toast.error("Please select how many pages you visited!");
                            return;
                          }
                        }
                        
                        setClickerTaskStatus('completed');
                        setClickerSubmitted(true);
                        toast.success("Clicker task completed! All tasks finished.");
                        
                        // Reset all states for new cycle
                        setCurrentTaskType('viewer');
                        setViewerTask1Status('notCompleted');
                        setViewerTask2Status('notCompleted');
                        setClickerTaskStatus('notCompleted');
                        setSelectedReason1('');
                        setSelectedReason2('');
                        setSelectedReasonClicker('');
                        setAdditionalDetails('');
                        setScreenshot(null);
                        setPageVisitCount('');
                        setTask1Submitted(false);
                        setTask2Submitted(false);
                        setClickerSubmitted(false);
                        setCountdownStarted(false); // Reset countdown for new cycle
                        
                      }}
                      disabled={clickerSubmitted || !isClickerFormValid()}
                      className={`w-full ${clickerSubmitted ? 'bg-gray-400 cursor-not-allowed' : !isClickerFormValid() ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                      {clickerSubmitted ? 'Submitted' : !isClickerFormValid() ? 'Fill Required Fields' : 'Submit Clicker Task'}
            </Button>
          </CardContent>
        </Card>
              </>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Task</h3>
              <p className="text-gray-500">
                You don&apos;t have any active tasks at the moment. Check back later for new assignments.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </UserMainLayout>
  );
}