"use client";

import { useState } from "react";
import UserMainLayout from "@/components/layout/UserMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, AlertCircle, Upload, ExternalLink, Copy, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for user tasks - IP and Session instructions
const userTaskInstructions = {
  ipInstructions: {
    proxyAddress: "proxy.smartproxy.net:3120:smart-m17mx1sjlcfe_area-US_life-15_session-pcf62219dd7a75fe8",
    exitIP: "2603:6081:7ef0:9d50:ecad:411:6bbf:81a9",
    location: "United States (US), North Carolina / Wilson",
    isp: "Charter Communications Inc",
    as: "AS11426 Charter Communications Inc",
    spamScore: "",
    oneTimeLink: "https://tasker.joyapps.net/I/Z-X33H4jbJ?m=MTk3ODV8NDI8MTc1ODA1MDU2NQiAKg_pHCLZvsaP9z8IScY6FLIMKjACy3qWwjt-ygsW",
    expiresIn: "09:56"
  },
  sessionInstructions: {
    profileCreationLink: "https://docs.google.com/spreadsheets/d/1Y1kM[redacted]Jck/edit?gid[redacted]4878",
    leadsPageLink: "https://docs.google.com/spreadsheets/d/1O[redacted]WFQ7ez[redacted]Y4UghuiWk/edit?usp=sharing",
    userAgentsLink: "https://docs.google.com/spreadsheets/[redacted]cBk8_ILLj3m-_K-Hm8kfs/edit?usp=drivesdk",
    howToAddUserAgentsLink: "https://example.com/how-to-add-user-agents",
    targetProfiles: 100,
    iosProfiles: 60,
    androidProfiles: 20,
    windowsMacProfiles: 20
  }
};

export default function UserTasksPage() {
  const { user } = useAuth();
  const [linkClosed, setLinkClosed] = useState(false);
  const [taskStatus, setTaskStatus] = useState("not-completed");
  const [completionReason, setCompletionReason] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userTaskInstructions.ipInstructions.oneTimeLink);
    // You could add a toast notification here
  };

  const handleTaskSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setTaskStatus("not-completed");
    setCompletionReason("");
    setPageCount("");
    setAdditionalDetails("");
    setIsSubmitting(false);
    
    // You could add a success notification here
    alert("Task submitted successfully!");
  };

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
          </div>
        </div>

        {/* IP and One time Link Instructions */}
        <Card>
          <CardHeader className="bg-green-50 border-b-2 border-green-200">
            <CardTitle className="text-green-800 text-lg font-semibold">
              IP and One time Link Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Proxy Setup */}
            <div className="space-y-3">
              <p className="text-sm font-medium">1. Set up this proxy in AdsPower:</p>
              <div className="bg-gray-100 p-3 rounded border">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono">{userTaskInstructions.ipInstructions.proxyAddress}</code>
                  <Badge variant="outline" className="text-xs">[US Proxy]</Badge>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <p>Exit IP: {userTaskInstructions.ipInstructions.exitIP}</p>
                <p>tries: 2 - {userTaskInstructions.ipInstructions.location}, ISP: {userTaskInstructions.ipInstructions.isp}, AS: {userTaskInstructions.ipInstructions.as} - Spam Score: {userTaskInstructions.ipInstructions.spamScore}</p>
              </div>
            </div>

            {/* One-time Access Link */}
            <div className="space-y-3">
              <p className="text-sm font-medium">One-time Access Link:</p>
              <div className="bg-blue-50 p-3 rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-sm font-mono text-blue-800 break-all">
                    {userTaskInstructions.ipInstructions.oneTimeLink}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Badge variant="secondary" className="shrink-0">
                    Expires in {userTaskInstructions.ipInstructions.expiresIn}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">
                  This is your one-time link for this task session. If you accidentally close it, submit below as Link closed by mistake.
                </p>
              </div>
            </div>

            {/* Link Closed Option */}
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLinkClosed(true)}
                className="text-red-600 hover:text-red-700"
              >
                Link closed by mistake
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Task Instructions */}
        <Card>
          <CardHeader className="bg-green-50 border-b-2 border-green-200">
            <CardTitle className="text-green-800 text-lg font-semibold">
              Session Task Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Profile Creation */}
            <div className="space-y-3">
              <p className="text-sm">
                Make your Ad&apos;s power profile using the proxy provided above in the IP Block. Follow this to make a profile, if you don&apos;t know how to make it:
              </p>
              <div className="bg-blue-50 p-2 rounded">
                <a 
                  href={userTaskInstructions.sessionInstructions.profileCreationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {userTaskInstructions.sessionInstructions.profileCreationLink}
                </a>
              </div>
            </div>

            {/* Data Forms */}
            <div className="space-y-3">
              <p className="text-sm">Open this leads page to get data for forms.</p>
              <div className="bg-blue-50 p-2 rounded">
                <a 
                  href={userTaskInstructions.sessionInstructions.leadsPageLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {userTaskInstructions.sessionInstructions.leadsPageLink}
                </a>
              </div>
            </div>

            {/* User Agents */}
            <div className="space-y-3">
              <p className="text-sm">
                Please open or copy and paste this link in your browser to get the list of user agents you&apos;ll be using for iOS and Android profiles.
              </p>
              <div className="bg-blue-50 p-2 rounded">
                <a 
                  href={userTaskInstructions.sessionInstructions.userAgentsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {userTaskInstructions.sessionInstructions.userAgentsLink}
                </a>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <a 
                  href={userTaskInstructions.sessionInstructions.howToAddUserAgentsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  How To Add User Agents in Ads Power: {userTaskInstructions.sessionInstructions.howToAddUserAgentsLink}
                </a>
              </div>
            </div>

            {/* Platform Instructions */}
            <div className="space-y-3">
              <p className="text-sm">
                If you are working on Android, use Android User Agents. If you are using iOS, use iPhone User Agents
              </p>
            </div>

            {/* Target Breakdown */}
            <div className="space-y-3">
              <p className="text-sm">
                Among the {userTaskInstructions.sessionInstructions.targetProfiles} target, you&apos;ll work on {userTaskInstructions.sessionInstructions.iosProfiles} iOS profiles, {userTaskInstructions.sessionInstructions.androidProfiles} Android profiles, and {userTaskInstructions.sessionInstructions.windowsMacProfiles} Windows/Mac profiles.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>You&apos;ll choose the iOS or Android and copy the user agent from the sheet and paste it in Ads Power.</li>
                <li>Check your profile settings and click on OK to create a profile.</li>
                <li>Continue your work like normal.</li>
              </ul>
            </div>

            {/* Final Step */}
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium">1. Copy the tracking link from above and open Ads Power and paste that link.</p>
            </div>
          </CardContent>
        </Card>

        {/* Task Submission Form */}
        <Card>
          <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
            <CardTitle className="text-blue-800 text-lg font-semibold">
              Task Submission
            </CardTitle>
            <CardDescription>
              Complete the task and submit your results
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Task Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">
                Copy the tracking link from above and open Ads Power and paste that link.
                It will do some checks and take you to a Facebook Page. If you are working on Android and iOS and using the User Agents, you won&apos;t see any pop-up, but if you do, close it, click <strong>I couldn&apos;t complete</strong>, click Others and write &quot;Facebook Popup error.&quot; You&apos;ll need to click on the <strong>Learn More</strong> button, if you don&apos;t see it, scroll down and it will be visible.
                Continue your work like normal.
              </p>
            </div>

            {/* Task Status */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Task status</Label>
              <RadioGroup value={taskStatus} onValueChange={setTaskStatus}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed">Completed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-completed" id="not-completed" />
                  <Label htmlFor="not-completed">Not completed</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Page Count (only show if completed) */}
            {taskStatus === "completed" && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Did you visit 1 page or 2 pages on the site?</Label>
                <RadioGroup value={pageCount} onValueChange={setPageCount}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="1-page" />
                    <Label htmlFor="1-page">1 page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="2-pages" />
                    <Label htmlFor="2-pages">2 pages</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-600">
                  We will verify your current IP (the exit IP shown above) matches a recent visit to your short link before accepting.
                </p>
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
              onClick={handleTaskSubmit}
              disabled={isSubmitting || (taskStatus === "not-completed" && !completionReason) || (taskStatus === "completed" && !pageCount)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Task
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </UserMainLayout>
  );
}
