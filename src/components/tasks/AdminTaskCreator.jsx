"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  CalendarIcon, 
  MousePointer, 
  Eye, 
  Clock,
  AlertCircle,
  X,
  Copy,
  Trash2,
  Save
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEnhancedTasks } from "@/contexts/EnhancedTaskContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AdminTaskCreator() {
  const { createTask } = useEnhancedTasks();
  const { users } = useUsers();
  const { user: currentUser } = useAuth();
  
  const [isCreating, setIsCreating] = useState(false);
  const [expiryDate, setExpiryDate] = useState();
  const [newTask, setNewTask] = useState({
    title: "",
    type: "viewer",
    description: "",
    assignedTo: "",
    priority: "medium",
    sessionInstructions: {
      title: "Session Task Instructions",
      content: "",
      collapsed: true
    },
    taskInstructions: {
      title: "Task Instructions", 
      content: "",
      collapsed: true
    },
    subtasks: [
      {
        id: 1,
        title: "",
        type: "viewer",
        status: "pending",
        links: [
          {
            id: 1,
            displayUrl: "",
            realUrl: "",
            proxy: "",
            title: "",
            instructions: "",
            timeRequired: 120,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ],
        submission: {
          completed: false,
          notes: "",
          submittedAt: null
        }
      }
    ],
    clickerTask: {
      id: 1,
      title: "",
      type: "clicker",
      status: "pending",
      links: [
        {
          id: 1,
          displayUrl: "",
          realUrl: "",
          proxy: "",
          title: "",
          instructions: "",
          timeRequired: 180,
          completed: false,
          completedAt: null,
          notes: ""
        }
      ],
      submission: {
        completed: false,
        notes: "",
        submittedAt: null
      }
    }
  });

  // Get workers for assignment
  const workers = users.filter(user => user.role === "worker");

  const generateMaskedUrl = (realUrl) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `https://masked-link-${randomId}-${timestamp}.example.com`;
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    if (!newTask.assignedTo) {
      toast.error("Please select a worker to assign the task to");
      return;
    }
    if (!expiryDate) {
      toast.error("Please select an expiry date");
      return;
    }

    // Validate subtasks
    const validSubtasks = newTask.subtasks.filter(subtask => 
      subtask.title.trim() && 
      subtask.links.filter(link => link.realUrl.trim() && link.proxy.trim() && link.title.trim()).length > 0
    );
    
    if (validSubtasks.length === 0) {
      toast.error("Please add at least one valid subtask");
      return;
    }

    // Validate clicker task
    const validClickerLinks = newTask.clickerTask.links.filter(link => 
      link.realUrl.trim() && link.proxy.trim() && link.title.trim()
    );
    
    if (validClickerLinks.length === 0) {
      toast.error("Please add at least one valid clicker task link");
      return;
    }

    setIsCreating(true);
    
    try {
      // Generate masked URLs for all links
      const processedSubtasks = validSubtasks.map(subtask => ({
        ...subtask,
        links: subtask.links
          .filter(link => link.realUrl.trim() && link.proxy.trim() && link.title.trim())
          .map(link => ({
            ...link,
            displayUrl: generateMaskedUrl(link.realUrl)
          }))
      }));

      const processedClickerTask = {
        ...newTask.clickerTask,
        title: newTask.clickerTask.title || "Click Analysis Task",
        links: validClickerLinks.map(link => ({
          ...link,
          displayUrl: generateMaskedUrl(link.realUrl)
        }))
      };

      const taskData = {
        title: newTask.title,
        type: newTask.type,
        description: newTask.description,
        assignedTo: parseInt(newTask.assignedTo),
        assignedBy: currentUser.id,
        priority: newTask.priority,
        expiryDate: expiryDate.toISOString(),
        sessionInstructions: newTask.sessionInstructions,
        taskInstructions: newTask.taskInstructions,
        subtasks: processedSubtasks,
        clickerTask: processedClickerTask
      };

      await createTask(taskData);
      toast.success("Task created and assigned successfully!");
      
      // Reset form
      setNewTask({
        title: "",
        type: "viewer",
        description: "",
        assignedTo: "",
        priority: "medium",
        sessionInstructions: {
          title: "Session Task Instructions",
          content: "",
          collapsed: true
        },
        taskInstructions: {
          title: "Task Instructions", 
          content: "",
          collapsed: true
        },
        subtasks: [
          {
            id: 1,
            title: "",
            type: "viewer",
            status: "pending",
            links: [
              {
                id: 1,
                displayUrl: "",
                realUrl: "",
                proxy: "",
                title: "",
                instructions: "",
                timeRequired: 120,
                completed: false,
                completedAt: null,
                notes: ""
              }
            ],
            submission: {
              completed: false,
              notes: "",
              submittedAt: null
            }
          }
        ],
        clickerTask: {
          id: 1,
          title: "",
          type: "clicker",
          status: "pending",
          links: [
            {
              id: 1,
              displayUrl: "",
              realUrl: "",
              proxy: "",
              title: "",
              instructions: "",
              timeRequired: 180,
              completed: false,
              completedAt: null,
              notes: ""
            }
          ],
          submission: {
            completed: false,
            notes: "",
            submittedAt: null
          }
        }
      });
      setExpiryDate(undefined);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const addSubtask = () => {
    const newSubtask = {
      id: Math.max(...newTask.subtasks.map(s => s.id), 0) + 1,
      title: "",
      type: "viewer",
      status: "pending",
      links: [
        {
          id: 1,
          displayUrl: "",
          realUrl: "",
          proxy: "",
          title: "",
          instructions: "",
          timeRequired: 120,
          completed: false,
          completedAt: null,
          notes: ""
        }
      ],
      submission: {
        completed: false,
        notes: "",
        submittedAt: null
      }
    };
    
    setNewTask(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }));
  };

  const removeSubtask = (subtaskId) => {
    if (newTask.subtasks.length > 1) {
      setNewTask(prev => ({
        ...prev,
        subtasks: prev.subtasks.filter(s => s.id !== subtaskId)
      }));
    }
  };

  const addLinkToSubtask = (subtaskId) => {
    setNewTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? {
              ...subtask,
              links: [
                ...subtask.links,
                {
                  id: Math.max(...subtask.links.map(l => l.id), 0) + 1,
                  displayUrl: "",
                  realUrl: "",
                  proxy: "",
                  title: "",
                  instructions: "",
                  timeRequired: 120,
                  completed: false,
                  completedAt: null,
                  notes: ""
                }
              ]
            }
          : subtask
      )
    }));
  };

  const removeLinkFromSubtask = (subtaskId, linkId) => {
    setNewTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? {
              ...subtask,
              links: subtask.links.filter(l => l.id !== linkId)
            }
          : subtask
      )
    }));
  };

  const updateSubtask = (subtaskId, field, value) => {
    setNewTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, [field]: value }
          : subtask
      )
    }));
  };

  const updateLink = (subtaskId, linkId, field, value) => {
    setNewTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? {
              ...subtask,
              links: subtask.links.map(link => 
                link.id === linkId ? { ...link, [field]: value } : link
              )
            }
          : subtask
      )
    }));
  };

  const addClickerLink = () => {
    setNewTask(prev => ({
      ...prev,
      clickerTask: {
        ...prev.clickerTask,
        links: [
          ...prev.clickerTask.links,
          {
            id: Math.max(...prev.clickerTask.links.map(l => l.id), 0) + 1,
            displayUrl: "",
            realUrl: "",
            proxy: "",
            title: "",
            instructions: "",
            timeRequired: 180,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ]
      }
    }));
  };

  const removeClickerLink = (linkId) => {
    if (newTask.clickerTask.links.length > 1) {
      setNewTask(prev => ({
        ...prev,
        clickerTask: {
          ...prev.clickerTask,
          links: prev.clickerTask.links.filter(l => l.id !== linkId)
        }
      }));
    }
  };

  const updateClickerLink = (linkId, field, value) => {
    setNewTask(prev => ({
      ...prev,
      clickerTask: {
        ...prev.clickerTask,
        links: prev.clickerTask.links.map(link => 
          link.id === linkId ? { ...link, [field]: value } : link
        )
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Enhanced Task</h2>
          <p className="text-gray-600">Create tasks with masked links, regex validation, and expiration</p>
        </div>
      </div>

      {/* Create Task Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Task Details
          </CardTitle>
          <CardDescription>
            Configure the basic task information and assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Task Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To *</Label>
              <Select 
                value={newTask.assignedTo} 
                onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id.toString()}>
                      {worker.name} ({worker.workerType?.replace('-', ' ')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={newTask.priority} 
                onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "MM/dd/yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what the worker needs to do..."
              rows={3}
            />
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-instructions">Session Instructions</Label>
              <Textarea
                id="session-instructions"
                value={newTask.sessionInstructions.content}
                onChange={(e) => setNewTask(prev => ({
                  ...prev,
                  sessionInstructions: {
                    ...prev.sessionInstructions,
                    content: e.target.value
                  }
                }))}
                placeholder="Enter session-level instructions..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-instructions">Task Instructions</Label>
              <Textarea
                id="task-instructions"
                value={newTask.taskInstructions.content}
                onChange={(e) => setNewTask(prev => ({
                  ...prev,
                  taskInstructions: {
                    ...prev.taskInstructions,
                    content: e.target.value
                  }
                }))}
                placeholder="Enter task-specific instructions..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Viewer Subtasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Viewer Subtasks
              </CardTitle>
              <CardDescription>Create viewer tasks with multiple links</CardDescription>
            </div>
            <Button onClick={addSubtask} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Subtask
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {newTask.subtasks.map((subtask, subtaskIndex) => (
            <Card key={subtask.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Subtask {subtaskIndex + 1}</h4>
                  {newTask.subtasks.length > 1 && (
                    <Button
                      onClick={() => removeSubtask(subtask.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`subtask-title-${subtask.id}`}>Subtask Title</Label>
                  <Input
                    id={`subtask-title-${subtask.id}`}
                    value={subtask.title}
                    onChange={(e) => updateSubtask(subtask.id, "title", e.target.value)}
                    placeholder="Enter subtask title"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Links</Label>
                    <Button
                      onClick={() => addLinkToSubtask(subtask.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Link
                    </Button>
                  </div>
                  
                  {subtask.links.map((link, linkIndex) => (
                    <Card key={link.id} className="p-4 bg-gray-50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Link {linkIndex + 1}</span>
                          {subtask.links.length > 1 && (
                            <Button
                              onClick={() => removeLinkFromSubtask(subtask.id, link.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`link-title-${subtask.id}-${link.id}`}>Link Title</Label>
                            <Input
                              id={`link-title-${subtask.id}-${link.id}`}
                              value={link.title}
                              onChange={(e) => updateLink(subtask.id, link.id, "title", e.target.value)}
                              placeholder="Link title"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`link-time-${subtask.id}-${link.id}`}>Time Required (seconds)</Label>
                            <Input
                              id={`link-time-${subtask.id}-${link.id}`}
                              type="number"
                              value={link.timeRequired}
                              onChange={(e) => updateLink(subtask.id, link.id, "timeRequired", parseInt(e.target.value) || 120)}
                              placeholder="120"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`link-url-${subtask.id}-${link.id}`}>Real URL *</Label>
                          <Input
                            id={`link-url-${subtask.id}-${link.id}`}
                            value={link.realUrl}
                            onChange={(e) => updateLink(subtask.id, link.id, "realUrl", e.target.value)}
                            placeholder="https://example.com"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`link-proxy-${subtask.id}-${link.id}`}>Proxy *</Label>
                          <Input
                            id={`link-proxy-${subtask.id}-${link.id}`}
                            value={link.proxy}
                            onChange={(e) => updateLink(subtask.id, link.id, "proxy", e.target.value)}
                            placeholder="proxy.example.com:8080"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`link-instructions-${subtask.id}-${link.id}`}>Instructions</Label>
                          <Textarea
                            id={`link-instructions-${subtask.id}-${link.id}`}
                            value={link.instructions}
                            onChange={(e) => updateLink(subtask.id, link.id, "instructions", e.target.value)}
                            placeholder="Instructions for this link..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Clicker Task */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-blue-600" />
                Clicker Task
              </CardTitle>
              <CardDescription>Create clicker task with analysis links</CardDescription>
            </div>
            <Button onClick={addClickerLink} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clicker-title">Clicker Task Title</Label>
            <Input
              id="clicker-title"
              value={newTask.clickerTask.title}
              onChange={(e) => setNewTask(prev => ({
                ...prev,
                clickerTask: { ...prev.clickerTask, title: e.target.value }
              }))}
              placeholder="Enter clicker task title"
            />
          </div>

          {newTask.clickerTask.links.map((link, linkIndex) => (
            <Card key={link.id} className="p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Link {linkIndex + 1}</span>
                  {newTask.clickerTask.links.length > 1 && (
                    <Button
                      onClick={() => removeClickerLink(link.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`clicker-title-${link.id}`}>Link Title</Label>
                    <Input
                      id={`clicker-title-${link.id}`}
                      value={link.title}
                      onChange={(e) => updateClickerLink(link.id, "title", e.target.value)}
                      placeholder="Link title"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`clicker-time-${link.id}`}>Time Required (seconds)</Label>
                    <Input
                      id={`clicker-time-${link.id}`}
                      type="number"
                      value={link.timeRequired}
                      onChange={(e) => updateClickerLink(link.id, "timeRequired", parseInt(e.target.value) || 180)}
                      placeholder="180"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`clicker-url-${link.id}`}>Real URL *</Label>
                  <Input
                    id={`clicker-url-${link.id}`}
                    value={link.realUrl}
                    onChange={(e) => updateClickerLink(link.id, "realUrl", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`clicker-proxy-${link.id}`}>Proxy *</Label>
                  <Input
                    id={`clicker-proxy-${link.id}`}
                    value={link.proxy}
                    onChange={(e) => updateClickerLink(link.id, "proxy", e.target.value)}
                    placeholder="proxy.example.com:8080"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`clicker-instructions-${link.id}`}>Instructions</Label>
                  <Textarea
                    id={`clicker-instructions-${link.id}`}
                    value={link.instructions}
                    onChange={(e) => updateClickerLink(link.id, "instructions", e.target.value)}
                    placeholder="Instructions for this link..."
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleCreateTask}
          disabled={isCreating}
          className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
        >
          {isCreating ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Creating Task...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create & Assign Task
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
