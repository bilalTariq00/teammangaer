"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Dynamic task data based on task type
const getTaskData = (taskType, taskIndex = 0) => {
  const taskData = {
    viewer1: {
      proxyAddress: "proxy.smartproxy.net:3120:start-a27mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1a",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "2.1",
      oneTimeLink: "https://tasker.joyapps.net/I/Z_XEEH4c?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3q",
      expiresIn: "09:56"
    },
    viewer2: {
      proxyAddress: "proxy.smartproxy.net:3120:start-b28mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1b",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "1.8",
      oneTimeLink: "https://tasker.joyapps.net/I/Z_XEEH4d?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3r",
      expiresIn: "08:45"
    },
    clicker: {
      proxyAddress: "proxy.smartproxy.net:3120:start-c29mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1c",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "2.5",
      oneTimeLink: "https://tasker.joyapps.net/I/Z_XEEH4e?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3s",
      expiresIn: "07:30"
    }
  };

  return taskData[taskType] || taskData.viewer1;
};

export default function IPInstructions({ 
  onLinkClosed, 
  taskType = 'viewer1', 
  taskIndex = 0, 
  timeRemaining, 
  formatTime, 
  startCountdown,
  onTaskSubmit,
  taskNumber = 1
}) {
  const ipInstructions = getTaskData(taskType, taskIndex);
  
  // Task submission state
  const [taskStatus, setTaskStatus] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [pageVisitCount, setPageVisitCount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Start countdown when component mounts or task type changes
  useEffect(() => {
    if (startCountdown && ipInstructions.expiresIn) {
      startCountdown(ipInstructions.expiresIn);
    }
  }, [taskType]); // Only restart when task type changes
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(ipInstructions.oneTimeLink);
    toast.success("Copied to clipboard!");
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScreenshot(file);
      toast.success("Screenshot uploaded successfully!");
    }
  };

  const handleReloadLink = () => {
    setTaskStatus('');
    setSelectedReason('');
    setPageVisitCount('');
    setScreenshot(null);
    setIsSubmitted(false);
    toast.success(`Viewer Task ${taskNumber} link reloaded!`);
  };

  const isFormValid = () => {
    if (taskStatus === 'completed') {
      return screenshot && pageVisitCount;
    } else if (taskStatus === 'notCompleted') {
      return selectedReason;
    }
    return false;
  };

  const handleSubmit = () => {
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
      additionalDetails: '',
      screenshot: screenshot ? URL.createObjectURL(screenshot) : null,
      taskStatus,
      selectedReason,
      pageVisitCount
    };

    // If NOT COMPLETED: stay on the same task and "reload" data (simulate AJAX)
    if (taskStatus === 'notCompleted') {
      handleReloadLink();
      toast.info("Task marked as 'Not completed'. Please try again.");
      return;
    }

    // Mark as submitted
    setIsSubmitted(true);
    toast.success(`Viewer Task ${taskNumber} completed!`);
    
    // Call parent handler if provided
    if (onTaskSubmit) {
      onTaskSubmit(taskNumber, submissionData);
    }
  };

  return (
    <Card className="">
      <CardHeader className=" pb-2 border-b-2 border-green-200">
        <div className="flex items-center justify-between">
        <CardTitle className="text-green-800 text-lg font-semibold">
          {taskType === 'viewer1' ? 'Viewer Task 1/Session' : 
           taskType === 'viewer2' ? 'Viewer Task 2/Search' : 
           taskType === 'clicker' ? 'Clicker Task' : 'Task Instructions'}
        </CardTitle>
        <div className="flex items-center justify-between">
            <Badge 
              variant={timeRemaining && timeRemaining <= 60 ? "destructive" : "secondary"} 
              className="shrink-0"
            >
              {timeRemaining !== null ? `Expires in ${formatTime(timeRemaining)}` : `Expires in ${ipInstructions.expiresIn}`}
            </Badge>
          </div>
          </div>
        <CardDescription>

        </CardDescription>
      
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Proxy Setup */}
        <div className="space-y-3">
          <p className="text-sm font-medium">1. Set up this proxy in AdsPower:</p>
          <div className="bg-gray-100 p-3 rounded border">
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono">{ipInstructions.proxyAddress}</code>
              <Badge variant="outline" className="text-xs">[US Proxy]</Badge>
            </div>
          </div>
          
          <div className="text-sm space-y-1 flex">
            <p>Exit IP: {ipInstructions.exitIP}</p>
            <span className="mx-2">|</span>
            <p>Location: {ipInstructions.location}</p>
            <span className="mx-2">|</span>
            <p>Spam Score: {ipInstructions.spamScore}</p>
            {/* <p>ISP: {ipInstructions.isp}</p>
            <p>AS: {ipInstructions.as}</p> */}
          </div>
        </div>

        {/* One Time Link */}
        <div className="space-y-3">
          <p className="text-sm font-medium">2. Use this one-time link:</p>
          <div className="bg-gray-100 p-3 rounded border">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono break-all">{ipInstructions.oneTimeLink}</code>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
         
          
          {timeRemaining !== null && timeRemaining <= 60 && timeRemaining > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <p className="text-xs text-red-600 font-medium">
                ⚠️ Link expires in {formatTime(timeRemaining)}! Complete your task quickly.
              </p>
            </div>
          )}
          {timeRemaining === 0 && (
            <div className="bg-red-100 border border-red-300 rounded p-2">
              <p className="text-xs text-red-700 font-medium">
                ❌ Link has expired! Please reload to get a new link.
              </p>
            </div>
          )}
        </div>

        {/* Task Submission Form */}
        <div className="space-y-4 border-t pt-4">
          <div className="space-y-3">
            <h5 className="font-medium">Task status</h5>
            <RadioGroup value={taskStatus} onValueChange={setTaskStatus} className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id={`task${taskNumber}-completed`} />
                <label htmlFor={`task${taskNumber}-completed`} className="text-sm font-medium text-gray-700 cursor-pointer">
                  Completed
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="notCompleted" id={`task${taskNumber}-notCompleted`} />
                <label htmlFor={`task${taskNumber}-notCompleted`} className="text-sm font-medium text-gray-700 cursor-pointer">
                  Not completed
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Not Completed Section */}
          {taskStatus === 'notCompleted' && (
            <div className="space-y-3">
              <h5 className="font-medium">Select the reason:</h5>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="networkError" id={`task${taskNumber}-networkError`} />
                  <label htmlFor={`task${taskNumber}-networkError`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    Network error
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="environmentCheck" id={`task${taskNumber}-environmentCheck`} />
                  <label htmlFor={`task${taskNumber}-environmentCheck`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    Environment check failed
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="proxyIssue" id={`task${taskNumber}-proxyIssue`} />
                  <label htmlFor={`task${taskNumber}-proxyIssue`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    Proxy issue
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="linkOpened" id={`task${taskNumber}-linkOpened`} />
                  <label htmlFor={`task${taskNumber}-linkOpened`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    Link opened by mistake
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id={`task${taskNumber}-other`} />
                  <label htmlFor={`task${taskNumber}-other`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    Other
                  </label>
                </div>
              </RadioGroup>
              
              <Button 
                onClick={handleReloadLink}
                variant="outline"
                className="w-full"
              >
                Reload Link
              </Button>
            </div>
          )}

          {/* Completed Section */}
          {taskStatus === 'completed' && (
            <div className="space-y-3">
              <h5 className="font-medium">Did you visit 1 page or 2 pages on the site?</h5>
              <RadioGroup value={pageVisitCount} onValueChange={setPageVisitCount} className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id={`task${taskNumber}-page1`} />
                  <label htmlFor={`task${taskNumber}-page1`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    1 page
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id={`task${taskNumber}-page2`} />
                  <label htmlFor={`task${taskNumber}-page2`} className="text-sm font-medium text-gray-700 cursor-pointer">
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

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitted || !taskStatus || !isFormValid()}
            className={`w-full ${isSubmitted ? 'bg-gray-400 cursor-not-allowed' : !taskStatus || !isFormValid() ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isSubmitted ? 'Submitted' : !taskStatus ? 'Select Task Status' : !isFormValid() ? 'Fill Required Fields' : `Submit Task ${taskNumber}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

