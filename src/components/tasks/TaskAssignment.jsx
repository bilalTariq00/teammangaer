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
import { 
  Plus, 
  CalendarIcon, 
  MousePointer, 
  Eye, 
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTasks } from "@/contexts/TaskContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function TaskAssignment() {
  const { createTask, getTasksForUser } = useTasks();
  const { users } = useUsers();
  const { user: currentUser } = useAuth();
  
  const [isCreating, setIsCreating] = useState(false);
  const [expiryDate, setExpiryDate] = useState();
  const [newTask, setNewTask] = useState({
    title: "",
    type: "clicker",
    description: "",
    assignedTo: "",
    priority: "medium",
    links: [{ url: "", proxy: "", title: "" }],
    tasks: [
      { title: "", links: [{ url: "", proxy: "", title: "" }] },
      { title: "", links: [{ url: "", proxy: "", title: "" }] }
    ]
  });

  // Get workers for assignment
  const workers = users.filter(user => user.role === "worker");

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

    // Validate links based on task type
    if (newTask.type === "clicker") {
      const validLinks = newTask.links.filter(link => link.url.trim() && link.proxy.trim() && link.title.trim());
      if (validLinks.length === 0) {
        toast.error("Please add at least one valid link for clicker task");
        return;
      }
    } else {
      const validTasks = newTask.tasks.filter(task => 
        task.title.trim() && 
        task.links.filter(link => link.url.trim() && link.proxy.trim() && link.title.trim()).length > 0
      );
      if (validTasks.length === 0) {
        toast.error("Please add at least one valid task for viewer task");
        return;
      }
    }

    setIsCreating(true);
    
    try {
      const taskData = {
        title: newTask.title,
        type: newTask.type,
        description: newTask.description,
        assignedTo: parseInt(newTask.assignedTo),
        assignedBy: currentUser.id,
        priority: newTask.priority,
        expiryDate: expiryDate.toISOString(),
        ...(newTask.type === "clicker" 
          ? { links: newTask.links.filter(link => link.url.trim() && link.proxy.trim() && link.title.trim()) }
          : { tasks: newTask.tasks.filter(task => 
              task.title.trim() && 
              task.links.filter(link => link.url.trim() && link.proxy.trim() && link.title.trim()).length > 0
            ).map(task => ({
              ...task,
              links: task.links.filter(link => link.url.trim() && link.proxy.trim() && link.title.trim())
            }))
          }
        )
      };

      await createTask(taskData);
      toast.success("Task created and assigned successfully!");
      
      // Reset form
      setNewTask({
        title: "",
        type: "clicker",
        description: "",
        assignedTo: "",
        priority: "medium",
        links: [{ url: "", proxy: "", title: "" }],
        tasks: [
          { title: "", links: [{ url: "", proxy: "", title: "" }] },
          { title: "", links: [{ url: "", proxy: "", title: "" }] }
        ]
      });
      setExpiryDate(undefined);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const addLink = () => {
    setNewTask(prev => ({
      ...prev,
      links: [...prev.links, { url: "", proxy: "", title: "" }]
    }));
  };

  const removeLink = (index) => {
    if (newTask.links.length > 1) {
      setNewTask(prev => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index)
      }));
    }
  };

  const updateLink = (index, field, value) => {
    setNewTask(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addTaskLink = (taskIndex, linkIndex) => {
    setNewTask(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === taskIndex 
          ? { ...task, links: [...task.links, { url: "", proxy: "", title: "" }] }
          : task
      )
    }));
  };

  const removeTaskLink = (taskIndex, linkIndex) => {
    setNewTask(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === taskIndex 
          ? { ...task, links: task.links.filter((_, j) => j !== linkIndex) }
          : task
      )
    }));
  };

  const updateTaskLink = (taskIndex, linkIndex, field, value) => {
    setNewTask(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === taskIndex 
          ? { 
              ...task, 
              links: task.links.map((link, j) => 
                j === linkIndex ? { ...link, [field]: value } : link
              )
            }
          : task
      )
    }));
  };

  const updateTaskTitle = (taskIndex, title) => {
    setNewTask(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === taskIndex ? { ...task, title } : task
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Assignment</h2>
          <p className="text-gray-600">Create and assign tasks to workers</p>
        </div>
      </div>

      {/* Create Task Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </CardTitle>
          <CardDescription>
            Fill in the details to create a new task and assign it to a worker
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
              <Label htmlFor="type">Task Type *</Label>
              <Select 
                value={newTask.type} 
                onValueChange={(value) => setNewTask(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clicker">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      Clicker Task
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Viewer Task
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Clicker Task Links */}
          {newTask.type === "clicker" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Task Links</Label>
                <Button onClick={addLink} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </div>
              
              {newTask.links.map((link, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Link {index + 1}</span>
                    {newTask.links.length > 1 && (
                      <Button
                        onClick={() => removeLink(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`link-title-${index}`}>Title</Label>
                      <Input
                        id={`link-title-${index}`}
                        value={link.title}
                        onChange={(e) => updateLink(index, "title", e.target.value)}
                        placeholder="Link title"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`link-url-${index}`}>URL</Label>
                      <Input
                        id={`link-url-${index}`}
                        value={link.url}
                        onChange={(e) => updateLink(index, "url", e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`link-proxy-${index}`}>Proxy</Label>
                      <Input
                        id={`link-proxy-${index}`}
                        value={link.proxy}
                        onChange={(e) => updateLink(index, "proxy", e.target.value)}
                        placeholder="proxy.example.com:8080"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Viewer Task Tasks */}
          {newTask.type === "viewer" && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Viewer Tasks</Label>
              
              {newTask.tasks.map((task, taskIndex) => (
                <Card key={taskIndex} className="p-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`task-title-${taskIndex}`}>Task {taskIndex + 1} Title</Label>
                      <Input
                        id={`task-title-${taskIndex}`}
                        value={task.title}
                        onChange={(e) => updateTaskTitle(taskIndex, e.target.value)}
                        placeholder={`Task ${taskIndex + 1} title`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Links</Label>
                        <Button 
                          onClick={() => addTaskLink(taskIndex, task.links.length)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Link
                        </Button>
                      </div>
                      
                      {task.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Input
                            value={link.title}
                            onChange={(e) => updateTaskLink(taskIndex, linkIndex, "title", e.target.value)}
                            placeholder="Link title"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => updateTaskLink(taskIndex, linkIndex, "url", e.target.value)}
                            placeholder="https://example.com"
                          />
                          <div className="flex gap-2">
                            <Input
                              value={link.proxy}
                              onChange={(e) => updateTaskLink(taskIndex, linkIndex, "proxy", e.target.value)}
                              placeholder="proxy.example.com:8080"
                            />
                            {task.links.length > 1 && (
                              <Button
                                onClick={() => removeTaskLink(taskIndex, linkIndex)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleCreateTask}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Creating Task...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create & Assign Task
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
