"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

// Dynamic task data based on task type
const getTaskData = (taskType, taskIndex = 0) => {
  const taskData = {
    viewer1: {
      proxyAddress: "proxy.smartproxy.net:3120:start-a27mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1a",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "",
      oneTimeLink: "https://tasker.joyapps.net/I/Z_XEEH4c?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3q",
      expiresIn: "09:56"
    },
    viewer2: {
      proxyAddress: "proxy.smartproxy.net:3120:start-b28mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1b",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "",
      oneTimeLink: "https://tasker.joyapps.net/I/Z_XEEH4d?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3r",
      expiresIn: "08:45"
    },
    clicker: {
      proxyAddress: "proxy.smartproxy.net:3120:start-c29mxejlofe_area-US_life-15_session-pc_82219de7a75fed",
      exitIP: "2603:6001:710:9360:ecad:411:6bf8:1c",
      location: "United States (US), North Carolina / Wilson",
      isp: "Charter Communications Inc",
      as: "AS11428 Charter Communications Inc",
      spamScore: "",
      oneTimeLink: "https://tasker.joyapps.net/I/Z_XEEH4e?h=VTK300V8NDIEMTA1ODALTDY2NzA_AKA_PHOLZYSSPB873X6PFL9K14DY3s",
      expiresIn: "07:30"
    }
  };

  return taskData[taskType] || taskData.viewer1;
};

export default function IPInstructions({ onLinkClosed, taskType = 'viewer1', taskIndex = 0, timeRemaining, formatTime, startCountdown }) {
  const ipInstructions = getTaskData(taskType, taskIndex);
  
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

  return (
    <Card>
      <CardHeader className="bg-green-50 border-b-2 border-green-200">
        <CardTitle className="text-green-800 text-lg font-semibold">
          IP and One time Link Instructions
        </CardTitle>
        <CardDescription>
          Your proxy and one-time link for this task session
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
          
          <div className="text-sm space-y-1">
            <p>Exit IP: {ipInstructions.exitIP}</p>
            <p>Location: {ipInstructions.location}</p>
            <p>ISP: {ipInstructions.isp}</p>
            <p>AS: {ipInstructions.as}</p>
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
          <div className="flex items-center justify-between">
            <Badge 
              variant={timeRemaining && timeRemaining <= 60 ? "destructive" : "secondary"} 
              className="shrink-0"
            >
              {timeRemaining !== null ? `Expires in ${formatTime(timeRemaining)}` : `Expires in ${ipInstructions.expiresIn}`}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">
            This is your one-time link for this task session.
          </p>
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
      </CardContent>
    </Card>
  );
}

