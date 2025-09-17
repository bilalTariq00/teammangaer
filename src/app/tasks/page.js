"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit, Ban, Trash2, AlertTriangle, Power, PowerOff } from "lucide-react";

const mockTaskers = [
  {
    id: 1,
    title: "Tasker Views",
    slug: "tasker-views",
    screenshot: false,
    status: "active",
    created: "2025-08-22 20:29:07",
    updated: "2025-09-11 16:00:31"
  },
  {
    id: 2,
    title: "Tasker Click",
    slug: "tasker-click",
    screenshot: true,
    status: "active",
    created: "2025-08-21 16:35:37",
    updated: "2025-09-11 15:58:37"
  }
];

export default function TasksPage() {
  const [taskers, setTaskers] = useState(mockTaskers);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [viewingTasker, setViewingTasker] = useState(null);
  const [editingTasker, setEditingTasker] = useState(null);
  const [deactivatingTasker, setDeactivatingTasker] = useState(null);
  const [newTasker, setNewTasker] = useState({
    title: "",
    slug: "",
    content: "",
    screenshot: false
  });
  const [editTasker, setEditTasker] = useState({
    title: "",
    slug: "",
    content: "",
    screenshot: false
  });

  const handleCreateTasker = () => {
    // Create new tasker with generated data
    const newTaskerData = {
      id: Math.max(...taskers.map(tasker => tasker.id)) + 1,
      title: newTasker.title,
      slug: newTasker.slug || newTasker.title.toLowerCase().replace(/\s+/g, '-'),
      screenshot: newTasker.screenshot,
      status: "active",
      created: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    setTaskers([...taskers, newTaskerData]);
    setNewTasker({
      title: "",
      slug: "",
      content: "",
      screenshot: false
    });
  };

  const handleTitleChange = (title) => {
    setNewTasker({
      ...newTasker,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-')
    });
  };

  const handleViewTasker = (tasker) => {
    setViewingTasker(tasker);
    setIsViewDialogOpen(true);
  };

  const handleEditTasker = (tasker) => {
    setEditingTasker(tasker);
    setEditTasker({
      title: tasker.title,
      slug: tasker.slug,
      content: tasker.content || "",
      screenshot: tasker.screenshot
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTasker = () => {
    // Update the tasker in the state
    setTaskers(taskers.map(tasker => 
      tasker.id === editingTasker.id 
        ? {
            ...tasker,
            title: editTasker.title,
            slug: editTasker.slug || editTasker.title.toLowerCase().replace(/\s+/g, '-'),
            content: editTasker.content,
            screenshot: editTasker.screenshot,
            updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
          }
        : tasker
    ));
    
    setIsEditDialogOpen(false);
    setEditingTasker(null);
    setEditTasker({
      title: "",
      slug: "",
      content: "",
      screenshot: false
    });
  };

  const handleDeactivateTasker = (tasker) => {
    setDeactivatingTasker(tasker);
    setIsDeactivateDialogOpen(true);
  };

  const confirmDeactivateTasker = () => {
    // Update the tasker status to inactive
    setTaskers(taskers.map(tasker => 
      tasker.id === deactivatingTasker.id 
        ? { ...tasker, status: "inactive", updated: new Date().toISOString().slice(0, 19).replace('T', ' ') }
        : tasker
    ));
    setIsDeactivateDialogOpen(false);
    setDeactivatingTasker(null);
  };

  const handleReactivateTasker = (taskerToReactivate) => {
    // Reactivate the tasker
    setTaskers(taskers.map(tasker => 
      tasker.id === taskerToReactivate.id 
        ? { ...tasker, status: "active", updated: new Date().toISOString().slice(0, 19).replace('T', ' ') }
        : tasker
    ));
  };

  const handleEditTitleChange = (title) => {
    setEditTasker({
      ...editTasker,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-')
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your taskers and create new tasks for workers
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Tasker Form */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900">Create Tasker</CardTitle>
            <CardDescription>
              Create a new tasker for your workers to complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTasker.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter tasker title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                value={newTasker.slug}
                onChange={(e) => setNewTasker({...newTasker, slug: e.target.value})}
                placeholder="auto from title if empty"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Tasker Content</Label>
              <div className="border rounded-md">
                <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                  <Button variant="ghost" size="sm">
                    <span className="text-sm">↶</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="text-sm">↷</span>
                  </Button>
                  <div className="w-px h-4 bg-gray-300" />
                  <Button variant="ghost" size="sm">
                    <span className="font-bold text-sm">B</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="italic text-sm">I</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="underline text-sm">U</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="text-sm">⋯</span>
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={newTasker.content}
                  onChange={(e) => setNewTasker({...newTasker, content: e.target.value})}
                  placeholder="Enter tasker content..."
                  className="min-h-[200px] border-0 resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="screenshot"
                checked={newTasker.screenshot}
                onCheckedChange={(checked) => setNewTasker({...newTasker, screenshot: checked})}
              />
              <Label htmlFor="screenshot" className="text-sm">
                Ask workers to upload a screenshot on completion
              </Label>
            </div>
            
            <Button onClick={handleCreateTasker} className="w-full">
              Create Tasker
            </Button>
          </CardContent>
        </Card>

        {/* Taskers List */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>Taskers</CardTitle>
            <CardDescription>
              Manage your existing taskers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Screenshot?</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskers.map((tasker) => (
                  <TableRow key={tasker.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tasker.title}</div>
                        <div className="text-sm text-muted-foreground">{tasker.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tasker.screenshot ? "default" : "secondary"}>
                        {tasker.screenshot ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={tasker.status === "active" ? "default" : "secondary"}
                        className={tasker.status === "active" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {tasker.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tasker.created}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tasker.updated}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTasker(tasker)}
                          title="View Tasker"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditTasker(tasker)}
                          title="Edit Tasker"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {tasker.status === "active" ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-orange-600 hover:text-orange-700"
                            onClick={() => handleDeactivateTasker(tasker)}
                            title="Deactivate Tasker"
                          >
                            <PowerOff className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleReactivateTasker(tasker)}
                            title="Reactivate Tasker"
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* View Tasker Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Tasker</DialogTitle>
            <DialogDescription>
              Tasker details and content
            </DialogDescription>
          </DialogHeader>
          {viewingTasker && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm text-muted-foreground">{viewingTasker.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Slug</Label>
                  <p className="text-sm text-muted-foreground">{viewingTasker.slug}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Screenshot Required</Label>
                  <Badge variant={viewingTasker.screenshot ? "default" : "secondary"}>
                    {viewingTasker.screenshot ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="default" className="bg-green-500">
                    {viewingTasker.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">{viewingTasker.created}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Updated</Label>
                  <p className="text-sm text-muted-foreground">{viewingTasker.updated}</p>
                </div>
              </div>
              {viewingTasker.content && (
                <div>
                  <Label className="text-sm font-medium">Content</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">{viewingTasker.content}</pre>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Tasker Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tasker</DialogTitle>
            <DialogDescription>
              Update the tasker configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTasker.title}
                onChange={(e) => handleEditTitleChange(e.target.value)}
                placeholder="Enter tasker title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug (optional)</Label>
              <Input
                id="edit-slug"
                value={editTasker.slug}
                onChange={(e) => setEditTasker({...editTasker, slug: e.target.value})}
                placeholder="auto from title if empty"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Tasker Content</Label>
              <div className="border rounded-md">
                <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                  <Button variant="ghost" size="sm">
                    <span className="text-sm">↶</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="text-sm">↷</span>
                  </Button>
                  <div className="w-px h-4 bg-gray-300" />
                  <Button variant="ghost" size="sm">
                    <span className="font-bold text-sm">B</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="italic text-sm">I</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="underline text-sm">U</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="text-sm">⋯</span>
                  </Button>
                </div>
                <Textarea
                  id="edit-content"
                  value={editTasker.content}
                  onChange={(e) => setEditTasker({...editTasker, content: e.target.value})}
                  placeholder="Enter tasker content..."
                  className="min-h-[200px] border-0 resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-screenshot"
                checked={editTasker.screenshot}
                onCheckedChange={(checked) => setEditTasker({...editTasker, screenshot: checked})}
              />
              <Label htmlFor="edit-screenshot" className="text-sm">
                Ask workers to upload a screenshot on completion
              </Label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTasker}>
                Update Tasker
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Deactivate Tasker
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this tasker? You can reactivate it later if needed.
            </DialogDescription>
          </DialogHeader>
          {deactivatingTasker && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Title:</span>
                    <span className="text-sm">{deactivatingTasker.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Slug:</span>
                    <span className="text-sm">{deactivatingTasker.slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Screenshot:</span>
                    <Badge variant={deactivatingTasker.screenshot ? "default" : "secondary"} className="text-xs">
                      {deactivatingTasker.screenshot ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant="default" className="bg-green-500 text-xs">
                      {deactivatingTasker.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDeactivateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeactivateTasker}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <PowerOff className="h-4 w-4 mr-2" />
                  Deactivate Tasker
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
