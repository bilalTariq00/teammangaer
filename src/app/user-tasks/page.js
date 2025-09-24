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
import TaskInstructionsModal from "@/components/tasks/TaskInstructionsModal";
import TaskSubmission from "@/components/tasks/TaskSubmission";
import ViewerTask from "@/components/tasks/ViewerTask";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function UserTasksPage() {
  const { user } = useAuth();
  const { isAttendanceMarkedToday, markAttendance } = useAttendance();
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
  const [screenshot2, setScreenshot2] = useState(null); // Second screenshot for clicker
  const [pageVisitCount, setPageVisitCount] = useState('');
  const [currentViewerTask, setCurrentViewerTask] = useState(1); // 1 or 2
  const [task1Submitted, setTask1Submitted] = useState(false);
  const [task2Submitted, setTask2Submitted] = useState(false);
  const [clickerSubmitted, setClickerSubmitted] = useState(false);
  const [expireTime, setExpireTime] = useState(null);
  const [countdownStarted, setCountdownStarted] = useState(false);

  // Role-based visibility
  const canSeeViewer = user?.taskRole === 'viewer' || user?.taskRole === 'both' || !user?.taskRole;
  const canSeeClicker = user?.taskRole === 'clicker' || user?.taskRole === 'both' || !user?.taskRole;

  // Comprehensive reset function for all form states
  const resetAllFormStates = () => {
    // Task status states
    setViewerTask1Status('notCompleted');
    setViewerTask2Status('notCompleted');
    setClickerTaskStatus('notCompleted');
    
    // Form input states
    setSelectedReason1('');
    setSelectedReason2('');
    setSelectedReasonClicker('');
    setAdditionalDetails('');
    setScreenshot(null);
    setScreenshot2(null);
    setPageVisitCount('');
    
    // Submission states
    setTask1Submitted(false);
    setTask2Submitted(false);
    setClickerSubmitted(false);
    
    // Task flow states
    setCurrentSubtaskIndex(0);
  };

  // Ensure initial UI matches role
  useEffect(() => {
    if (!user) return;
    if (user.taskRole === 'clicker') {
      setCurrentTaskType('clicker');
    } else {
      setCurrentTaskType('viewer');
    }
  }, [user?.taskRole, user]);

  // Debug: Monitor task completion state changes
  useEffect(() => {
    console.log('Task completion state changed:', {
      email: user?.email,
      taskRole: user?.taskRole,
      task1Submitted,
      task2Submitted,
      viewerTask1Status,
      viewerTask2Status
    });
  }, [task1Submitted, task2Submitted, viewerTask1Status, viewerTask2Status, user]);

  // Auto-advance viewer tasks when both are completed
  useEffect(() => {
    console.log('useEffect triggered:', {
      userRole: user?.taskRole,
      task1Submitted,
      task2Submitted,
      email: user?.email
    });
    
    if (user?.taskRole === 'viewer') {
      // Viewer-only users: auto-advance to next viewer tasks
      if (task1Submitted && task2Submitted) {
        console.log('Both viewer tasks completed! Auto-advancing to next viewer tasks...');
        setTimeout(() => {
          try {
            console.log('Executing viewer task advancement...');
            // Mark the current task completed so provider advances to the next assigned viewer task
            completeFinalSubmission(currentTask.id, "viewer auto-complete");
            // Refresh task data and reset UI states for next viewer pair
            const refreshedCurrent = getCurrentTask(user.id);
            const refreshedNext = getNextTask(user.id);
            console.log('Refreshed tasks:', { refreshedCurrent, refreshedNext });
            setCurrentTask(refreshedCurrent && refreshedCurrent.type === 'viewer' ? refreshedCurrent : null);
            setNextTask(refreshedNext && refreshedNext.type === 'viewer' ? refreshedNext : null);
            resetAllFormStates();
            setCurrentTaskType('viewer');
            setCurrentSubtaskIndex(0);
            setCountdownStarted(false);
            toast.success('Viewer session completed! Loaded next viewer tasks.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Viewer task advancement completed successfully!');
          } catch (e) {
            console.error('Error completing viewer session:', e);
            toast.error('Error loading next viewer tasks. Please try again.');
          }
        }, 100);
      }
    } else if (user?.taskRole === 'both') {
      // Both-role users: show button to proceed to clicker task
      if (task1Submitted && task2Submitted) {
        console.log('Both viewer tasks completed! Ready for clicker task...');
        // Don't auto-advance, let user click the button to proceed to clicker
      }
    }
  }, [task1Submitted, task2Submitted, user, currentTask]);

  // Auto-advance clicker tasks when completed
  useEffect(() => {
    console.log('Clicker useEffect triggered:', {
      userRole: user?.taskRole,
      clickerSubmitted,
      email: user?.email
    });
    
    if (user?.taskRole === 'clicker') {
      // Clicker-only users: auto-advance to next clicker task
      if (clickerSubmitted) {
        console.log('Clicker task completed! Auto-advancing to next clicker task...');
        setTimeout(() => {
          try {
            console.log('Executing clicker task advancement...');
            // Mark the current task completed so provider advances to the next assigned clicker task
            completeFinalSubmission(currentTask.id, "clicker auto-complete");
            // Refresh task data and reset UI states for next clicker task
            const refreshedCurrent = getCurrentTask(user.id);
            const refreshedNext = getNextTask(user.id);
            console.log('Refreshed clicker tasks:', { refreshedCurrent, refreshedNext });
            setCurrentTask(refreshedCurrent && refreshedCurrent.type === 'clicker' ? refreshedCurrent : null);
            setNextTask(refreshedNext && refreshedNext.type === 'clicker' ? refreshedNext : null);
            resetAllFormStates();
            setCurrentTaskType('clicker');
            setCurrentSubtaskIndex(0);
            setCountdownStarted(false);
            toast.success('Clicker task completed! Loaded next clicker task.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Clicker task advancement completed successfully!');
          } catch (e) {
            console.error('Error completing clicker session:', e);
            toast.error('Error loading next clicker task. Please try again.');
          }
        }, 100);
      }
    } else if (user?.taskRole === 'both') {
      // Both-role users: after clicker task, move to next viewer task pair
      if (clickerSubmitted) {
        console.log('Clicker task completed! Moving to next viewer task pair...');
        setTimeout(() => {
          try {
            console.log('Executing both-role advancement...');
            // Mark the current task completed so provider advances to the next assigned viewer task
            completeFinalSubmission(currentTask.id, "both-role auto-complete");
            // Refresh task data and reset UI states for next viewer pair
            const refreshedCurrent = getCurrentTask(user.id);
            const refreshedNext = getNextTask(user.id);
            console.log('Refreshed viewer tasks:', { refreshedCurrent, refreshedNext });
            setCurrentTask(refreshedCurrent && refreshedCurrent.type === 'viewer' ? refreshedCurrent : null);
            setNextTask(refreshedNext && refreshedNext.type === 'viewer' ? refreshedNext : null);
            resetAllFormStates();
            setCurrentTaskType('viewer');
            setCurrentSubtaskIndex(0);
            setCountdownStarted(false);
            toast.success('Clicker task completed! Loaded next viewer tasks.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Both-role advancement completed successfully!');
          } catch (e) {
            console.error('Error completing both-role session:', e);
            toast.error('Error loading next viewer tasks. Please try again.');
          }
        }, 100);
      }
    }
  }, [clickerSubmitted, user, currentTask]);

  // Check if attendance is marked for today
  useEffect(() => {
    if (user && (user.role === 'worker' || user.role === 'user')) {
      const attendanceMarked = isAttendanceMarkedToday(user.id);
      if (!attendanceMarked) {
        // Auto-mark present for demo so tasks show up
        markAttendance(user.id, user, { status: 'present' });
      }
    }
  }, [user, isAttendanceMarkedToday, markAttendance]);

  // Load current task with taskRole filtering
  useEffect(() => {
    if (user?.id) {
      const baseCurrent = getCurrentTask(user.id);
      const baseNext = getNextTask(user.id);
      let current = baseCurrent;
      let next = baseNext;
      if (user.taskRole === 'viewer') {
        // ensure current and next are viewer tasks if available
        if (current && current.type !== 'viewer') {
          current = null;
        }
        if (next && next.type !== 'viewer') {
          next = null;
        }
      } else if (user.taskRole === 'clicker') {
        if (current && current.type !== 'clicker') {
          current = null;
        }
        if (next && next.type !== 'clicker') {
          next = null;
        }
      }
      setCurrentTask(current);
      setNextTask(next);
    }
  }, [user?.id, user?.taskRole, getCurrentTask, getNextTask]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      toast.error("Time expired! Please reload the link to get a new one-time link.");
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
      resetAllFormStates();
      toast.success("Viewer Task 1 completed! Moving to Viewer Task 2 with new data.");
    } else if (currentTaskType === 'viewer2') {
      setCurrentTaskType('clicker');
      resetAllFormStates();
      toast.success("Viewer Task 2 completed! Moving to Clicker Task with new data.");
    } else {
      // Clicker task completed, reset to viewer1
      setCurrentTaskType('viewer1');
      resetAllFormStates();
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
    
    // Set clicker as submitted to trigger auto-advancement
    setClickerSubmitted(true);
    setClickerTaskStatus('completed');
    
    toast.success("Clicker task completed!");
    setIsSubmitting(false);
    
    // Note: Auto-advancement is now handled by useEffect above
    // Don't reset form states here as it would interfere with the useEffect detection
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

  // Scroll to top when a new task loads
  useEffect(() => {
    if (currentTask?.id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentTask?.id]);

  const handleViewerTaskSubmit = (taskNumber, submissionData) => {
    const taskStatus = submissionData.taskStatus;
    const selectedReason = submissionData.selectedReason;
    
    if (taskStatus === 'completed') {
      if (!submissionData.screenshot) {
        toast.error("Screenshot is mandatory when task is completed!");
        return;
      }
      if (!submissionData.pageVisitCount) {
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

    // If NOT COMPLETED: stay on the same task and "reload" data (simulate AJAX)
    if (taskStatus === 'notCompleted') {
      // Simulate AJAX refresh
      setIsSubmitting(true);
      setTimeout(() => {
        handleReloadLink(taskNumber);
        // Refresh task data from context
        const refreshedCurrent = getCurrentTask(user.id);
        const refreshedNext = getNextTask(user.id);
        setCurrentTask(refreshedCurrent);
        setNextTask(refreshedNext);
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success(`Viewer Task ${taskNumber} reloaded. Stay on the same task.`);
      }, 500);
      return;
    }

    // Otherwise (COMPLETED): update the specific task status and proceed
    if (taskNumber === 1) {
      setViewerTask1Status('completed');
      setTask1Submitted(true);
      toast.success("Viewer Task 1 completed!");
    } else {
      setViewerTask2Status('completed');
      setTask2Submitted(true);
      toast.success("Viewer Task 2 completed!");
    }

    // Note: Auto-advancement is now handled by useEffect above
    // Don't reset form states here as it would interfere with the useEffect detection
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
    // Reset form fields when reloading
    setScreenshot(null);
    setScreenshot2(null);
    setPageVisitCount('');
    setAdditionalDetails('');
  };

  const handleReloadExpiredLink = () => {
    // Reset timer and get new link
    setTimeRemaining(null);
    setIsTimerActive(false);
    setCountdownStarted(false);
    
    // Reset form states
    resetAllFormStates();
    
    toast.success("Link reloaded! New one-time link generated.");
  };

  const handleNextTask = () => {
    // Only switch to clicker for BOTH users
    if (user?.taskRole !== 'both') {
      toast.info("Viewer-only mode: continue with viewer tasks.");
      return;
    }
    if (!task1Submitted || !task2Submitted) {
      toast.error("Please complete both viewer tasks first!");
      return;
    }
    
    setCurrentTaskType('clicker');
    setCountdownStarted(false); // Reset countdown for new task
    toast.success("Moving to Clicker Task!");
    // Scroll to top when moving to next task
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Task instructions for {user?.name}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentTaskType === 'viewer' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {currentTaskType === 'viewer' ? 'Viewer Tasks (1 & 2)' : 'Clicker Task'}
              </span> */}
              {currentTask && (
                <TaskInstructionsModal task={currentTask} taskType={currentTaskType === 'viewer' ? 'viewer1' : 'clicker'} />
              )}
            </div>
          </div>
                  {/* <Button 
            onClick={() => {
              resetTasks();
              setCurrentTask(getCurrentTask(user.id));
              setNextTask(getNextTask(user.id));
              setCurrentTaskType('viewer');
              setCurrentSubtaskIndex(0);
              resetAllFormStates();
              setCountdownStarted(false);
            }}
                variant="outline" 
                className="text-red-600 hover:text-red-700"
              >
            Reset Tasks (Debug)
              </Button> */}
            </div>

        {/* Show current task if available */}
        {currentTask ? (
          <div className="space-y-6">
            {currentTaskType === 'viewer' && canSeeViewer ? (
              <>
                {/* IP and One time Link Instructions for Task 1 with integrated submission */}
                <IPInstructions 
                  taskType="viewer1"
                  taskIndex={0}
                  taskNumber={1}
                  timeRemaining={timeRemaining}
                  formatTime={formatTime}
                  startCountdown={startCountdown}
                  onTaskSubmit={handleViewerTaskSubmit}
                  onReloadExpiredLink={handleReloadExpiredLink}
                />

                {/* IP and One time Link Instructions for Task 2 with integrated submission */}
                <IPInstructions 
                  taskType="viewer2"
                  taskIndex={1}
                  taskNumber={2}
                  timeRemaining={timeRemaining}
                  formatTime={formatTime}
                  startCountdown={startCountdown}
                  onTaskSubmit={handleViewerTaskSubmit}
                  onReloadExpiredLink={handleReloadExpiredLink}
                />

            {/* Next Task Button - only for BOTH users */}
              {user?.taskRole === 'both' && (
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <CardContent className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-medium text-green-800">Ready for Clicker Task?</h3>
                    </div>
                    <p className="text-gray-600">
                      {task1Submitted && task2Submitted 
                        ? "Both viewer tasks completed! You can proceed to the clicker task."
                        : "Complete both viewer tasks to proceed to the clicker task."
                      }
                    </p>
                    <Button 
                      onClick={handleNextTask}
                      disabled={!task1Submitted || !task2Submitted}
                      className={`h-12 px-8 ${
                        task1Submitted && task2Submitted 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {task1Submitted && task2Submitted ? 'Next Task (Clicker)' : 'Complete Both Viewer Tasks First'}
                    </Button>
                  </CardContent>
                </Card>
              )}
              </>
            ) : currentTaskType === 'clicker' && canSeeClicker ? (
              <>
                {/* Clicker Task with integrated submission */}
                <IPInstructions 
                  taskType="clicker"
                  taskIndex={0}
                  taskNumber={3}
                  timeRemaining={timeRemaining}
                  formatTime={formatTime}
                  startCountdown={startCountdown}
                  onReloadExpiredLink={handleReloadExpiredLink}
                  onTaskSubmit={(taskNumber, submissionData) => {
                    // Handle clicker task submission
                    if (submissionData.taskStatus === 'notCompleted') {
                      toast.info("Task marked as 'Not completed'. Please try again.");
                      return;
                    }

                    // Mark the clicker task completed in context
                    completeClickerTask(
                      currentTask.id,
                      submissionData.additionalDetails,
                      'good',
                      submissionData.screenshot
                    );
                    setClickerTaskStatus('completed');
                    setClickerSubmitted(true);
                    
                    // For clicker-only users, complete the whole task and load the next clicker task
                    if (user?.taskRole === 'clicker') {
                      completeFinalSubmission(currentTask.id, 'clicker-only auto-complete');
                      const refreshedCurrent = getCurrentTask(user.id);
                      const refreshedNext = getNextTask(user.id);
                      setCurrentTask(refreshedCurrent && refreshedCurrent.type === 'clicker' ? refreshedCurrent : null);
                      setNextTask(refreshedNext && refreshedNext.type === 'clicker' ? refreshedNext : null);
                      setCurrentTaskType('clicker');
                      toast.success('Clicker task completed! Loaded next clicker task.');
                    } else if (user?.taskRole === 'both') {
                      // In BOTH flow, after clicker completion we cycle back to viewer
                      setCurrentTaskType('viewer');
                      toast.success('Clicker task completed! Back to viewer tasks.');
                    } else {
                      setCurrentTaskType('viewer');
                      toast.success('Clicker task completed.');
                    }

                    // Reset common UI state
                    resetAllFormStates();
                    setCountdownStarted(false);
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            ) : null}
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