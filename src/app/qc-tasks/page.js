"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QCMainLayout from "@/components/layout/QCMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  CheckSquare, 
  X, 
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Play,
  Pause,
  Lock,
  Unlock,
  Target,
  Database,
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
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
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
    userAgent: "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
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
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
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
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
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
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
  const [showUserAgentModal, setShowUserAgentModal] = useState(false);
  const [selectedUserAgent, setSelectedUserAgent] = useState("");
  const [tasks, setTasks] = useState(mockQCTasks);
  
  // Timer functionality
  const [isWorkSessionActive, setIsWorkSessionActive] = useState(false);
  const [isWorkSessionPaused, setIsWorkSessionPaused] = useState(false);
  const [workSessionTime, setWorkSessionTime] = useState(0);
  const [workSessionLimit] = useState(8 * 60 * 60); // 8 hours in seconds
  
  const [isTaskTimerActive, setIsTaskTimerActive] = useState(false);
  const [taskTimeElapsed, setTaskTimeElapsed] = useState(0);
  const [taskTimeLimit] = useState(10 * 60); // 10 minutes in seconds
  const [isTaskLocked, setIsTaskLocked] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastCompletedTask, setLastCompletedTask] = useState(null);
  const [shouldMoveToNext, setShouldMoveToNext] = useState(false);
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  
  const workSessionIntervalRef = useRef(null);
  const taskIntervalRef = useRef(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.workerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.ip.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesTaskType = taskTypeFilter === "all" || task.taskType === taskTypeFilter;
    return matchesSearch && matchesStatus && matchesTaskType;
  });


  const handleShowUserAgent = (userAgent) => {
    setSelectedUserAgent(userAgent);
    setShowUserAgentModal(true);
  };

  const handleShowData = (task) => {
    if (task.formFilled === "yes") {
      setSelectedTaskData(task);
      setShowDataDialog(true);
    }
  };

  const handleQcAction = (task, rating) => {
    console.log('handleQcAction called:', { taskId: task.id, rating, currentTaskId });
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === task.id 
          ? {
              ...t,
              qcRating: rating,
              qcReviewedAt: new Date().toISOString(),
              status: rating === "good" ? "completed" : "rejected"
            }
          : t
      )
    );
    
    // Stop current task timer when task is completed
    if (currentTaskId === task.id) {
      console.log('Current task matches, proceeding with next task logic');
      stopTaskTimer();
      
      // Show completion notification
      setLastCompletedTask({
        workerName: task.workerName,
        rating: rating,
        timestamp: new Date()
      });
      
      // Trigger automatic progression to next task
      setShouldMoveToNext(true);
    } else {
      console.log('Current task does not match, not proceeding with next task logic');
    }
  };

  // Work Session functions
  const startWorkSession = () => {
    setIsWorkSessionActive(true);
    setIsWorkSessionPaused(false);
    setWorkSessionTime(0);
    startNextTask();
  };

  const pauseWorkSession = () => {
    if (!isWorkSessionActive || isWorkSessionPaused) return;
    setIsWorkSessionPaused(true);
    pauseTaskTimer();
    if (workSessionIntervalRef.current) {
      clearInterval(workSessionIntervalRef.current);
    }
  };

  const resumeWorkSession = () => {
    if (!isWorkSessionActive || !isWorkSessionPaused) return;
    setIsWorkSessionPaused(false);
    resumeTaskTimer();
  };

  const stopWorkSession = () => {
    setIsWorkSessionActive(false);
    setIsWorkSessionPaused(false);
    setWorkSessionTime(0);
    stopTaskTimer();
    if (workSessionIntervalRef.current) {
      clearInterval(workSessionIntervalRef.current);
    }
  };

  // Task Timer functions
  const startTaskTimer = useCallback((taskId) => {
    if (isTaskLocked) return;
    
    setCurrentTaskId(taskId);
    setIsTaskTimerActive(true);
    setTaskTimeElapsed(0);
    setIsTaskLocked(false);
    
    // Find the task to show notification
    const task = filteredTasks.find(t => t.id === taskId);
    if (task) {
      console.log(`Starting task: ${task.workerName} - ${task.taskName}`);
    }
  }, [isTaskLocked, filteredTasks]);

  const pauseTaskTimer = () => {
    if (!isTaskTimerActive) return;
    setIsTaskTimerActive(false);
    if (taskIntervalRef.current) {
      clearInterval(taskIntervalRef.current);
    }
  };

  const resumeTaskTimer = () => {
    if (!isTaskTimerActive) return;
    setIsTaskTimerActive(true);
  };

  const stopTaskTimer = useCallback(() => {
    setIsTaskTimerActive(false);
    setTaskTimeElapsed(0);
    setCurrentTaskId(null);
    if (taskIntervalRef.current) {
      clearInterval(taskIntervalRef.current);
    }
  }, []);

  const startNextTask = useCallback(() => {
    console.log('startNextTask called');
    console.log('All filtered tasks:', filteredTasks.map(t => ({ id: t.id, status: t.status, workerName: t.workerName })));
    const nextPendingTask = filteredTasks.find(t => t.status === 'pending_review');
    console.log('Looking for next task:', nextPendingTask);
    
    if (nextPendingTask) {
      console.log('Starting next task:', nextPendingTask.id, nextPendingTask.workerName);
      startTaskTimer(nextPendingTask.id);
    } else {
      console.log('No more pending tasks available');
      // No more pending tasks
      stopTaskTimer();
    }
  }, [filteredTasks, startTaskTimer, stopTaskTimer]);

  // Work Session Timer effect
  useEffect(() => {
    if (isWorkSessionActive && !isWorkSessionPaused) {
      workSessionIntervalRef.current = setInterval(() => {
        setWorkSessionTime(time => time + 1);
      }, 1000);
    } else {
      if (workSessionIntervalRef.current) {
        clearInterval(workSessionIntervalRef.current);
      }
    }

    return () => {
      if (workSessionIntervalRef.current) {
        clearInterval(workSessionIntervalRef.current);
      }
    };
  }, [isWorkSessionActive, isWorkSessionPaused]);

  // Task Timer effect
  useEffect(() => {
    if (isTaskTimerActive) {
      taskIntervalRef.current = setInterval(() => {
        setTaskTimeElapsed(time => {
          const newTime = time + 1;
          
          // Check if task time limit exceeded
          if (newTime >= taskTimeLimit) {
            setIsTaskLocked(true);
            setIsTaskTimerActive(false);
            if (taskIntervalRef.current) {
              clearInterval(taskIntervalRef.current);
            }
            return taskTimeLimit;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (taskIntervalRef.current) {
        clearInterval(taskIntervalRef.current);
      }
    }

    return () => {
      if (taskIntervalRef.current) {
        clearInterval(taskIntervalRef.current);
      }
    };
  }, [isTaskTimerActive, taskTimeLimit]);

  // Clear completion notification after 3 seconds
  useEffect(() => {
    if (lastCompletedTask) {
      const timer = setTimeout(() => {
        setLastCompletedTask(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastCompletedTask]);

  // Handle automatic progression to next task
  useEffect(() => {
    if (shouldMoveToNext) {
      console.log('shouldMoveToNext is true, executing startNextTask');
      setIsTransitioning(true);
      
      setTimeout(() => {
        startNextTask();
        setIsTransitioning(false);
        setShouldMoveToNext(false);
      }, 1000);
    }
  }, [shouldMoveToNext, filteredTasks, startNextTask]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Get remaining work session time
  const getRemainingWorkSessionTime = () => {
    return workSessionLimit - workSessionTime;
  };

  // Get work session progress percentage
  const getWorkSessionProgress = () => {
    return (workSessionTime / workSessionLimit) * 100;
  };

  // Get remaining task time
  const getRemainingTaskTime = () => {
    return taskTimeLimit - taskTimeElapsed;
  };

  // Get task progress percentage
  const getTaskProgress = () => {
    return (taskTimeElapsed / taskTimeLimit) * 100;
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



  return (
    <QCMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">QC Tasks</h1>
            <p className="text-muted-foreground">Review worker tasks with IP tracking and quality control</p>
          </div>
          
          {/* Timer Controls */}
          <div className="flex items-center gap-6">
            {/* Work Session Timer */}
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <div className="text-right">
                <div className="text-lg font-bold">
                  <span className={isWorkSessionActive ? "text-green-600" : "text-gray-600"}>
                    {formatTime(isWorkSessionActive ? workSessionTime : getRemainingWorkSessionTime())}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {isWorkSessionActive ? "Work Session" : "8 Hours Available"}
                </div>
              </div>
            </div>
            
            {/* Task Timer */}
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gray-600" />
              <div className="text-right">
                <div className="text-lg font-bold">
                  {isTaskLocked ? (
                    <span className="text-red-600">LOCKED</span>
                  ) : (
                    <span className={isTaskTimerActive ? "text-blue-600" : "text-gray-600"}>
                      {formatTime(isTaskTimerActive ? taskTimeElapsed : getRemainingTaskTime())}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {isTaskLocked ? "Task Time Exceeded" : isTaskTimerActive ? "Current Task" : "10 Min Per Task"}
                </div>
              </div>
            </div>
            
            {/* Task Progress Bar */}
            {isTaskTimerActive && !isTaskLocked && (
              <div className="w-24">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      getTaskProgress() > 80 ? 'bg-red-500' : 
                      getTaskProgress() > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${getTaskProgress()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {Math.round(getTaskProgress())}%
                </div>
              </div>
            )}
            
            {/* Control Buttons */}
            <div className="flex gap-2">
              {!isWorkSessionActive && (
                <Button
                  onClick={startWorkSession}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Working
                </Button>
              )}
              
              {isWorkSessionActive && !isWorkSessionPaused && (
                <Button
                  onClick={pauseWorkSession}
                  variant="outline"
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Session
                </Button>
              )}
              
              {isWorkSessionActive && isWorkSessionPaused && (
                <Button
                  onClick={resumeWorkSession}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume Session
                </Button>
              )}
              
              {isWorkSessionActive && (
                <Button
                  onClick={stopWorkSession}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              )}
              
              {isTaskLocked && (
                <Button
                  onClick={() => {
                    setIsTaskLocked(false);
                    startNextTask();
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Next Task
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Task Timer Warning */}
        {isTaskTimerActive && !isTaskLocked && getTaskProgress() > 80 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Task Time Warning</h3>
                <p className="text-sm text-red-700">
                  You have {formatTime(getRemainingTaskTime())} remaining to complete the current task. 
                  The task will be locked if time expires.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Locked Warning */}
        {isTaskLocked && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Task Time Limit Exceeded</h3>
                <p className="text-sm text-red-700">
                  The 10-minute time limit for this task has been exceeded. 
                  Click &quot;Next Task&quot; to move to the next pending task.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Work Session Progress */}
        {isWorkSessionActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800">Work Session Active</h3>
                <p className="text-sm text-blue-700">
                  Session Time: {formatTime(workSessionTime)} / {formatTime(workSessionLimit)} 
                  ({Math.round(getWorkSessionProgress())}% complete)
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${getWorkSessionProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Completion Notification */}
        {lastCompletedTask && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Task Completed</h3>
                <p className="text-sm text-green-700">
                  {lastCompletedTask.workerName} - Marked as <span className="font-semibold">{lastCompletedTask.rating.toUpperCase()}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Transition Indicator */}
        {isTransitioning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
              <div>
                <h3 className="font-semibold text-yellow-800">Task Completed</h3>
                <p className="text-sm text-yellow-700">
                  Moving to next task...
                </p>
              </div>
            </div>
          </div>
        )}

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
                    <TableHead>S.No</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Form Filled</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Image 1</TableHead>
                    <TableHead>Image 2</TableHead>
                    <TableHead>Δ Time</TableHead>
                    <TableHead>Redirect Logged</TableHead>
                    <TableHead>Submission Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task, index) => {
                    const isCurrentTask = currentTaskId === task.id;
                    const isDisabled = isTaskLocked || (isTaskTimerActive && !isCurrentTask);
                    
                    return (
                    <TableRow 
                      key={task.id} 
                      className={`${isCurrentTask ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300' : ''} ${isDisabled ? 'opacity-50' : ''} transition-all duration-300`}
                    >
                      <TableCell className="text-center font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-xs">{task.ip}</TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handleShowUserAgent(task.userAgent)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {task.device}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.region}</div>
                          <div className="text-xs text-gray-600">{task.regionDetails}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={task.formFilled === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {task.formFilled || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.formFilled === "yes" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShowData(task)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Database className="h-3 w-3 mr-1" />
                            View Data
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.screenshots && task.screenshots[0] ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(task.screenshots[0].url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.screenshots && task.screenshots[1] ? (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(task.screenshots[1].url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
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
                        <div className="flex gap-1 items-center">
                          {isCurrentTask && isTaskTimerActive && (
                            <div className="flex items-center gap-1 mr-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-blue-600 font-medium">Working</span>
                            </div>
                          )}
                          
                          {isTaskLocked && task.status === "pending_review" && isCurrentTask && (
                            <div className="flex items-center gap-1 mr-2">
                              <Lock className="h-3 w-3 text-red-500" />
                              <span className="text-xs text-red-600 font-medium">Time Exceeded</span>
                            </div>
                          )}
                          
                          {task.status === "pending_review" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQcAction(task, "good")}
                                className="text-green-600 hover:text-green-800"
                                disabled={isDisabled}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Good
                              </Button>
                            <Button 
                              size="sm"
                                variant="outline"
                                onClick={() => handleQcAction(task, "bad")}
                                className="text-red-600 hover:text-red-800"
                                disabled={isDisabled}
                            >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Bad
                            </Button>
                            </>
                          ) : (
                            <Badge className={task.qcRating === "good" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {task.qcRating === "good" ? "Good" : "Bad"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Agent Modal */}
        {showUserAgentModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">User Agent</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowUserAgentModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-mono break-all">{selectedUserAgent}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={() => setShowUserAgentModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Data Dialog */}
        <Dialog open={showDataDialog} onOpenChange={setShowDataDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Task Data</DialogTitle>
              <DialogDescription>
                Form data submitted by {selectedTaskData?.workerName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedTaskData && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Worker Name:</span>
                        <span className="font-semibold break-words">{selectedTaskData.workerName}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="break-all text-xs">{selectedTaskData.workerEmail}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Task Type:</span>
                        <span className="capitalize">{selectedTaskData.taskType}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Campaign:</span>
                        <span className="break-words">{selectedTaskData.campaign}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">IP Address:</span>
                        <span className="font-mono text-xs break-all">{selectedTaskData.ip}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Device:</span>
                        <span className="break-words">{selectedTaskData.device}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Region:</span>
                        <span className="break-words">{selectedTaskData.regionDetails}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Form Status:</span>
                        <Badge className={selectedTaskData.formFilled === "yes" ? "bg-green-100 text-green-800 w-fit" : "bg-red-100 text-red-800 w-fit"}>
                          {selectedTaskData.formFilled}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {selectedTaskData.additionalDetails && (
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Additional Details:</span>
                        <span className="break-words text-sm">{selectedTaskData.additionalDetails}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTaskData.pageVisitCount && (
                    <div className="mt-3">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Page Visits:</span>
                        <span>{selectedTaskData.pageVisitCount}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTaskData.selectedReason && (
                    <div className="mt-3">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">Reason:</span>
                        <span className="break-words text-sm">{selectedTaskData.selectedReason}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTaskData.userAgent && (
                    <div className="mt-3">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-600">User Agent:</span>
                        <span className="break-all text-xs font-mono bg-white p-2 rounded border">{selectedTaskData.userAgent}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button onClick={() => setShowDataDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </QCMainLayout>
  );
}