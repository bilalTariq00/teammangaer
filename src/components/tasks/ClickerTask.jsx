"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MousePointer, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";
import { toast } from "sonner";

export default function ClickerTask({ task, onTaskComplete }) {
  const { updateTaskMetrics, completeTask } = useTasks();
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [clicks, setClicks] = useState({
    good: 0,
    bad: 0,
    total: 0
  });
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentLink = task.links[currentLinkIndex];
  const isLastLink = currentLinkIndex === task.links.length - 1;
  const allLinksVisited = currentLinkIndex === task.links.length;

  const handleClick = (type) => {
    const newClicks = {
      ...clicks,
      [type]: clicks[type] + 1,
      total: clicks.total + 1
    };
    setClicks(newClicks);
    
    // Update task metrics
    updateTaskMetrics(task.id, {
      totalClicks: newClicks.total,
      goodClicks: newClicks.good,
      badClicks: newClicks.bad
    });

    toast.success(`${type === 'good' ? 'Good' : 'Bad'} click recorded!`);
  };

  const handleNextLink = () => {
    if (currentLinkIndex < task.links.length - 1) {
      setCurrentLinkIndex(currentLinkIndex + 1);
    } else {
      setCurrentLinkIndex(task.links.length); // Mark as all visited
    }
  };

  const handleSubmit = async () => {
    if (!submissionNotes.trim()) {
      toast.error("Please add submission notes");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      completeTask(task.id, {
        notes: submissionNotes,
        completed: true
      });

      toast.success("Task completed successfully!");
      onTaskComplete();
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Task Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-blue-600" />
                {task.title}
              </CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </div>
            <Badge variant="outline" className="text-orange-600">
              Clicker Task
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Expires: {new Date(task.expiryDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Priority: {task.priority}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Link */}
      {!allLinksVisited && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Link {currentLinkIndex + 1} of {task.links.length}: {currentLink.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">URL:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openLink(currentLink.url)}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Link
                </Button>
              </div>
              <p className="text-sm text-gray-600 break-all">{currentLink.url}</p>
              <div className="mt-2">
                <span className="font-medium">Proxy:</span>
                <p className="text-sm text-gray-600">{currentLink.proxy}</p>
              </div>
            </div>

            {/* Click Tracking */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleClick('good')}
                className="bg-green-600 hover:bg-green-700 text-white h-12"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Good Click ({clicks.good})
              </Button>
              <Button
                onClick={() => handleClick('bad')}
                className="bg-red-600 hover:bg-red-700 text-white h-12"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Bad Click ({clicks.bad})
              </Button>
            </div>

            {/* Next Link Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleNextLink}
                variant="outline"
                className="w-full"
              >
                {isLastLink ? "Complete All Links" : "Next Link"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{clicks.total}</div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{clicks.good}</div>
              <div className="text-sm text-gray-600">Good Clicks</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{clicks.bad}</div>
              <div className="text-sm text-gray-600">Bad Clicks</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Links Progress: {currentLinkIndex} / {task.links.length} completed
          </div>
        </CardContent>
      </Card>

      {/* Submission Form */}
      {allLinksVisited && (
        <Card>
          <CardHeader>
            <CardTitle>Task Submission</CardTitle>
            <CardDescription>
              All links have been visited. Please provide submission details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Submission Notes *</Label>
              <Textarea
                id="notes"
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Describe your experience with the task, any issues encountered, or additional feedback..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !submissionNotes.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Task
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
