"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, RefreshCw, Play, CheckCircle, AlertCircle, Timer } from "lucide-react";
import { toast } from "sonner";

export default function ViewerTask({ 
  subtask, 
  onStartLinkReview, 
  onCompleteLinkReview, 
  onReloadLink,
  timeRemaining,
  isTimerActive 
}) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openMaskedLink = (realUrl) => {
    window.open(realUrl, '_blank');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className={`h-6 w-6 ${subtask.submission.completed ? "text-green-600" : "text-gray-400"}`} />
            <div>
              <CardTitle className="text-lg">{subtask.title}</CardTitle>
              <CardDescription>
                {subtask.links.length} links to review
              </CardDescription>
            </div>
          </div>
          <Badge variant={subtask.submission.completed ? "default" : "outline"}>
            {subtask.submission.completed ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Links */}
        {subtask.links.map((link, linkIndex) => (
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
                        onClick={() => onReloadLink(subtask.id, link.id)}
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
                      onClick={() => onStartLinkReview(subtask.id, link.id)}
                      className="bg-blue-600 hover:bg-blue-700 flex-1"
                      disabled={link.status === "in_progress"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Review
                    </Button>
                    
                    <Button
                      onClick={() => onCompleteLinkReview(subtask.id, link.id, "good")}
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50 flex-1"
                      disabled={link.status !== "in_progress"}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Good
                    </Button>
                    
                    <Button
                      onClick={() => onCompleteLinkReview(subtask.id, link.id, "bad")}
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
      </CardContent>
    </Card>
  );
}