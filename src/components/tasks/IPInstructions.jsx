"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Copy, Database } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Dynamic task data based on task type
const getTaskData = (taskType, taskIndex = 0, isReloaded = false) => {
  // Generate new links when reloaded
  const generateNewLink = (baseLink) => {
    if (!isReloaded) return baseLink;
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    return baseLink.replace(/[A-Za-z0-9]+$/, randomSuffix);
  };

  const taskData = {
    viewer1: {
      proxyAddress: "proxy.smartproxy.net:3120:start-a27mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1a",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "2.1",
      oneTimeLink: generateNewLink("https://tasker.joyapps.net/I/Z_XEEH4c?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3q"),
      agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.127 Safari/537.36",
     
      expiresIn: "09:56"
    },
    viewer2: {
      proxyAddress: "proxy.smartproxy.net:3120:start-b28mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1b",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "1.8",
      oneTimeLink: generateNewLink("https://tasker.joyapps.net/I/Z_XEEH4d?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3r"),
      agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.127 Safari/537.36",
     
      expiresIn: "08:45"
    },
    clicker: {
      proxyAddress: "proxy.smartproxy.net:3120:start-c29mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1c",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "2.5",
      oneTimeLink: generateNewLink("https://tasker.joyapps.net/I/Z_XEEH4e?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3s"),
      
      agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.127 Safari/537.36",
     
      expiresIn: "07:30"
    }
  };

  return taskData[taskType] || taskData.viewer1;
};

// Sample data queue for clicker tasks
const sampleClickerDataQueue = [
  {
    state: "CA",
    zipCode: "94941",
    firstName: "Shayan",
    lastName: "Mirzahosseini",
    email: "shayanmirzahosseini306@aol.com",
    phone: "5106009468",
    address: "305 Seymour Ln",
    city: "Mill Valley",
    score: 140,
    shade: "No Shade ",
    date:"2/20/1964",
    rating: "Good"
  },
  {
    state: "CA",
    zipCode: "96002",
    firstName: "Alex",
    lastName: "Weaver",
    email: "journee.naegele@yahoo.com",
    phone: "5304921538",
    address: "1075 le Brun Lane #2",
    city: "REDDING",
    score: 170,
    shade: "No Shade ",
    date:"10/18/1993",
    rating: ""
  },
  {
    state: "CA",
    zipCode: "91740",
    firstName: "ALVIN",
    lastName: "POSTON",
    email: "alvp7@aol.com",
    phone: "6266397224",
    address: "1020 E Rowland",
    city: "West Covina",
    score: 160,
    shade: "No Shade",
    date:"7/4/1969",
    rating: "Good"
  },
  {
    state: "CA",
    zipCode: "93641",
    firstName: "Myrtle",
    lastName: "Fulcher",
    email: "myrtlefulcher66@aol.com",
    phone: "5593362470",
    address: "47426 Blue Bird Ln",
    city: "Miramonte",
    score: 170,
    shade: "No Shade ",
    date:"3/24/1966",
    rating: ""
  }
];

export default function IPInstructions({ 
  onLinkClosed, 
  taskType = 'viewer1', 
  taskIndex = 0, 
  timeRemaining, 
  formatTime, 
  startCountdown,
  onTaskSubmit,
  onReloadExpiredLink,
  taskNumber = 1
}) {
  // Task submission state
  const [taskStatus, setTaskStatus] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [pageVisitCount, setPageVisitCount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshot2, setScreenshot2] = useState(null); // Second screenshot for clicker
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Dialog states for clicker data
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [showUsageDialog, setShowUsageDialog] = useState(false);
  const [hasUsedData, setHasUsedData] = useState(false);
  const [hasFormInLink, setHasFormInLink] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [currentData, setCurrentData] = useState(null);
  const [formFillAvailability, setFormFillAvailability] = useState(false);
  const [isLinkReloaded, setIsLinkReloaded] = useState(false);
  
  const ipInstructions = getTaskData(taskType, taskIndex, isLinkReloaded);
  
  // Reset all state when task type changes
  useEffect(() => {
    // Reset all form states
    setTaskStatus('');
    setSelectedReason('');
    setPageVisitCount('');
    setScreenshot(null);
    setScreenshot2(null);
    setIsSubmitted(false);
    
    // Reset clicker-specific states
    setShowDataDialog(false);
    setShowUsageDialog(false);
    setHasUsedData(false);
    setHasFormInLink(false);
    setCurrentDataIndex(0);
    setCurrentData(null);
    setFormFillAvailability(false);
    setIsLinkReloaded(false);
    
    // Start countdown if available
    if (startCountdown && ipInstructions.expiresIn) {
      startCountdown(ipInstructions.expiresIn);
    }
  }, [taskType]); // Reset when task type changes
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(ipInstructions.oneTimeLink);
    toast.success("Copied to clipboard!");
  };

  const handlePullData = () => {
    // Get current data from queue
    const data = sampleClickerDataQueue[currentDataIndex];
    setCurrentData(data);
    setShowDataDialog(true);
  };

  const handleCloseDataDialog = () => {
    setShowDataDialog(false);
    setShowUsageDialog(true);
  };

  const handleUsageDialogSubmit = () => {
    if (hasUsedData) {
      // Data is used, move to next item in queue
      const nextIndex = (currentDataIndex + 1) % sampleClickerDataQueue.length;
      setCurrentDataIndex(nextIndex);
      setCurrentData(null); // Clear current data
      toast.success("Data has been used. Next data will be shown on next pull.");
    } else {
      // Data not used, keep same index
      toast.success("Data remains available for future use.");
    }
    setShowUsageDialog(false);
    setHasUsedData(false);
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScreenshot(file);
      toast.success("Screenshot uploaded successfully!");
    }
  };

  const handleScreenshot2Upload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScreenshot2(file);
      toast.success("Second screenshot uploaded successfully!");
    }
  };

  const handleScreenshotPaste = (event) => {
    event.preventDefault();
    const items = event.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            // Create a File object with a name
            const namedFile = new File([file], `screenshot-${Date.now()}.png`, { type: file.type });
            setScreenshot(namedFile);
            toast.success("Screenshot pasted successfully!");
            return;
          }
        }
      }
    }
    
    toast.error("No image found in clipboard. Please copy an image first.");
  };

  const handleScreenshot2Paste = (event) => {
    event.preventDefault();
    const items = event.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            // Create a File object with a name
            const namedFile = new File([file], `screenshot2-${Date.now()}.png`, { type: file.type });
            setScreenshot2(namedFile);
            toast.success("Second screenshot pasted successfully!");
            return;
          }
        }
      }
    }
    
    toast.error("No image found in clipboard. Please copy an image first.");
  };

  const handleReloadLink = () => {
    setTaskStatus('');
    setSelectedReason('');
    setPageVisitCount('');
    setScreenshot(null);
    setScreenshot2(null);
    setIsSubmitted(false);
    setFormFillAvailability(false);
    toast.success(`Viewer Task ${taskNumber} link reloaded!`);
  };

  const handleReloadExpiredLinkClick = () => {
    setIsLinkReloaded(true);
    if (onReloadExpiredLink) {
      onReloadExpiredLink();
    }
    toast.success("Link reloaded! New one-time link generated.");
  };

  const isFormValid = () => {
    if (taskStatus === 'completed') {
      if (taskType === 'clicker' && pageVisitCount === 'yes') {
        // For clicker with Yes, require both screenshots
        return screenshot && screenshot2 && pageVisitCount;
      } else {
        // For viewer or clicker with No, only require first screenshot
      return screenshot && pageVisitCount;
      }
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
      if (taskType === 'clicker' && pageVisitCount === 'yes' && !screenshot2) {
        toast.error("Second screenshot is required when you filled the form!");
        return;
      }
      if (!pageVisitCount) {
        if (taskType === 'clicker') {
          toast.error("Please select if you filled the form!");
        } else {
        toast.error("Please select how many pages you visited!");
        }
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
      pageVisitCount,
      formFillAvailability: taskType === 'clicker' ? formFillAvailability : null
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
      <CardHeader className={`pb-2 border-b-2 ${
        taskType === 'viewer1' ? 'border-green-200' : 
        taskType === 'viewer2' ? 'border-blue-200' : 
        'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
        <CardTitle className={`text-lg font-semibold ${
          taskType === 'viewer1' ? 'text-green-800' : 
          taskType === 'viewer2' ? 'text-blue-800' : 
          'text-gray-800'
        }`}>
          {taskType === 'viewer1' ? 'Viewer Task 1/Session' : 
           taskType === 'viewer2' ? 'Viewer Task 2/Search' : 
           taskType === 'clicker' ? 'Clicker Task' : 'Task Instructions'}
        </CardTitle>
        <div className="flex items-center justify-between gap-2">
            <Badge 
              variant={timeRemaining && timeRemaining <= 60 ? "destructive" : "secondary"} 
              className="shrink-0"
            >
              {timeRemaining !== null ? `Expires in ${formatTime(timeRemaining)}` : `Expires in ${ipInstructions.expiresIn}`}
            </Badge>
            {taskType === 'clicker' && (
              <Button 
                onClick={handlePullData}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Database className="h-3 w-3 mr-1" />
                Pull Data
              </Button>
            )}
          </div>
          </div>
        <CardDescription>

        </CardDescription>
      
      </CardHeader>
      <CardContent className="px-6 space-y-2">
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
            <div className="bg-red-100 border border-red-300 rounded p-3">
              <div className="flex items-center justify-between">
              <p className="text-xs text-red-700 font-medium">
                  ❌ Link has expired! Click reload to get a new link.
                </p>
                <Button 
                  onClick={handleReloadExpiredLinkClick}
                  variant="outline"
                  size="sm"
                  className="text-red-700 border-red-300 hover:bg-red-50"
                >
                  Reload Link
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Agent Link - For All Tasks */}
        <div className="space-y-3">
          <p className="text-sm font-medium">3. User Agent Link:</p>
          <div className="bg-gray-100 p-3 rounded border">
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono truncate flex-1">{ipInstructions.agent}</code>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(ipInstructions.agent);
                  toast.success("User agent copied to clipboard!");
                }}
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
            <div className="bg-red-100 border border-red-300 rounded p-3">
              <div className="flex items-center justify-between">
              <p className="text-xs text-red-700 font-medium">
                  ❌ Link has expired! Click reload to get a new link.
                </p>
                <Button 
                  onClick={handleReloadExpiredLinkClick}
                  variant="outline"
                  size="sm"
                  className="text-red-700 border-red-300 hover:bg-red-50"
                >
                  Reload Link
                </Button>
              </div>
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
              
             
            </div>
          )}

          {/* Completed Section */}
          {taskStatus === 'completed' && (
            <div className="space-y-3">
              {/* Different questions based on task type */}
              {taskType === 'clicker' ? (
                <>
                  <h5 className="font-medium">Did you fill the form in this link?</h5>
                  <RadioGroup value={pageVisitCount} onValueChange={setPageVisitCount} className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`task${taskNumber}-formYes`} />
                      <label htmlFor={`task${taskNumber}-formYes`} className="text-sm font-medium text-gray-700 cursor-pointer">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`task${taskNumber}-formNo`} />
                      <label htmlFor={`task${taskNumber}-formNo`} className="text-sm font-medium text-gray-700 cursor-pointer">
                        No
                      </label>
                    </div>
                  </RadioGroup>
                </>
              ) : (
                <>
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
                </>
              )}
              
              {/* Form Fill Availability - Only for Clicker Tasks */}
              {/* {taskType === 'clicker' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`task${taskNumber}-formFill`} 
                      checked={formFillAvailability}
                      onCheckedChange={setFormFillAvailability}
                    />
                    <label htmlFor={`task${taskNumber}-formFill`} className="text-sm font-medium text-gray-700 cursor-pointer">
                      There is a form in this link
                    </label>
                  </div>
                </div>
              )} */}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Upload Screenshot <span className="text-red-500">*</span>
                </label>
                
                {/* Screenshot Paste Area - Only for Clicker Tasks */}
                
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onPaste={handleScreenshotPaste}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === 'v') {
                        e.preventDefault();
                        handleScreenshotPaste(e);
                      }
                    }}
                  >
                    {screenshot ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(screenshot)} 
                          alt="Screenshot preview" 
                          className="w-32 h-24 object-cover rounded border mx-auto"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-sm text-green-600">✓ Screenshot pasted successfully!</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setScreenshot(null);
                              toast.success("Screenshot removed!");
                            }}
                            className="text-red-500 hover:text-red-700 text-xs underline"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Click to paste a different image</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <p className="text-sm mb-2">📋 Paste screenshot with <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + V</kbd></p>
                        <p className="text-xs text-gray-400">Click here and press Ctrl+V to paste your screenshot</p>
                      </div>
                    )}
                  </div>
               
               
                
               
              </div>

              {/* Second Screenshot - Only for Clicker when Yes is selected */}
              {taskType === 'clicker' && pageVisitCount === 'yes' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Upload Form Screenshot <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Second Screenshot Paste Area - Only for Clicker Tasks */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onPaste={handleScreenshot2Paste}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === 'v') {
                        e.preventDefault();
                        handleScreenshot2Paste(e);
                      }
                    }}
                  >
                    {screenshot2 ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(screenshot2)} 
                          alt="Form screenshot preview" 
                          className="w-32 h-24 object-cover rounded border mx-auto"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-sm text-green-600">✓ Form screenshot pasted successfully!</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setScreenshot2(null);
                              toast.success("Form screenshot removed!");
                            }}
                            className="text-red-500 hover:text-red-700 text-xs underline"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Click to paste a different image</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <p className="text-sm mb-2">📋 Paste form screenshot with <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + V</kbd></p>
                        <p className="text-xs text-gray-400">Click here and press Ctrl+V to paste your form screenshot</p>
                      </div>
                    )}
                  </div>
                  
                
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitted || !taskStatus || !isFormValid()}
            className={`w-full ${isSubmitted ? 'bg-gray-400 cursor-not-allowed' : !taskStatus || !isFormValid() ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isSubmitted ? 'Submitted' : 
             !taskStatus ? 'Select Task Status' : 
             !isFormValid() ? (taskType === 'clicker' && pageVisitCount === 'yes' ? 'Upload Both Screenshots' : 'Fill Required Fields') : 
             (taskType === 'clicker' ? 'Submit Clicker Task' : `Submit Task ${taskNumber}`)}
          </Button>
        </div>
      </CardContent>

      {/* Data Dialog - Only for Clicker Tasks */}
      {taskType === 'clicker' && currentData && (
        <Dialog open={showDataDialog} onOpenChange={setShowDataDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pulled Data</DialogTitle>
              <DialogDescription>
                Here is the data for your clicker task
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2 col-span-2 flex items-start flex-col">
                    <div className="flex justify-between ">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="font-semibold">{currentData.firstName} {currentData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="break-all">{currentData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span>{currentData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Address:</span>
                      <span className="text-right">{currentData.address}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Date:</span>
                    <span>{currentData.date}</span>
                  </div>
                  </div>
                  <div className="space-y-2 col-span-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">City:</span>
                      <span>{currentData.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">State:</span>
                      <span>{currentData.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">ZIP:</span>
                      <span>{currentData.zipCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Score:</span>
                      <span className="font-semibold text-blue-600">{currentData.score}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Shade:</span>
                    <span>{currentData.shade}</span>
                  </div>
                
                  </div>
                </div>
                <div className="mt-4 pt-3 ">
                 
                  {currentData.rating && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="font-medium text-gray-600">Rating:</span>
                      <span className="text-green-600 font-medium">{currentData.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleCloseDataDialog}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Usage Dialog - Only for Clicker Tasks */}
      {taskType === 'clicker' && (
        <Dialog open={showUsageDialog} onOpenChange={setShowUsageDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Data Usage Confirmation</DialogTitle>
              <DialogDescription>
                Please confirm your usage of this data
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasUsedData" 
                    checked={hasUsedData}
                    onCheckedChange={setHasUsedData}
                  />
                  <label htmlFor="hasUsedData" className="text-sm font-medium">
                    Have you used this data before?
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowUsageDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUsageDialogSubmit}>
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

