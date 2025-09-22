"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, AlertCircle, Send, Upload, X, Clock } from "lucide-react";
import { toast } from "sonner";

export default function TaskSubmission({ 
  task, 
  subtask, 
  onSubmit, 
  isSubmitting = false 
}) {
  const [taskStatus, setTaskStatus] = useState("not-started");
  const [completionReason, setCompletionReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshot(e.target.result);
        toast.success("Screenshot uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    toast.success("Screenshot removed!");
  };

  const handleSubmit = () => {
    if (!screenshot) {
      toast.error("Please upload a screenshot");
      return;
    }

    if (taskStatus === "not-completed" && !completionReason) {
      toast.error("Please select a reason for not completing");
      return;
    }

    if (taskStatus === "completed" && !pageCount) {
      toast.error("Please enter the number of pages completed");
      return;
    }

    onSubmit({
      taskStatus,
      completionReason,
      additionalDetails,
      pageCount,
      screenshot
    });
  };

  return (
    <Card>
      <CardHeader className="bg-orange-50 border-b-2 border-orange-200">
        <CardTitle className="text-orange-800 text-lg font-semibold">
          Task Submission
        </CardTitle>
        <CardDescription>
          Complete the task and submit your results
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Task Status Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Task status:</Label>
          <RadioGroup value={taskStatus} onValueChange={setTaskStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Completed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-completed" id="not-completed" />
              <Label htmlFor="not-completed" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                Not completed
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
                <RadioGroupItem value="link-closed-mistake" id="link-closed-mistake" />
                <Label htmlFor="link-closed-mistake">Link closed by mistake</Label>
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
            {screenshot ? (
              <div className="flex items-center gap-2">
                <img 
                  src={screenshot} 
                  alt="Screenshot" 
                  className="w-20 h-20 object-cover rounded border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeScreenshot}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload screenshot for this task</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
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
          onClick={handleSubmit}
          disabled={isSubmitting || !screenshot || (taskStatus === "not-completed" && !completionReason) || (taskStatus === "completed" && !pageCount)}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
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
  );
}

