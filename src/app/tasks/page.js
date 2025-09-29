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
import { Eye, Edit, Ban, Trash2, AlertTriangle, Power, PowerOff, Image as ImageIcon } from "lucide-react";
import SimpleTiptapEditor from "@/components/SimpleTiptapEditor";
import RichTextDisplay from "@/components/RichTextDisplay";

const mockTaskers = [
  {
    id: 1,
    title: "Tasker Views",
    slug: "tasker-views",
    content: "**How to Add User Agents To Ads Power:** https://youtu.be/mfbiD0Gjhl8\n\n• **If you are working on Android, use Android User Agents, If you are using iOS, use iPhone User Agents**\n\nPlease open or copy paste this link in your browser to get the list of user agents you'll be using for iOS and Android profiles.\nhttps://docs.google.com/spreadsheets/d/1xoKRqP0e3wW_iTWU-nqG1PcBk8_ILLj3m-_K-Hm8kfs/edit?usp=drivesdk\n\n• **Among the 200 target, you'll work on 120 iOS profiles, 40 Android profiles and 40 windows/mac profiles.**\n\n**Steps for Ads Power:**\n• You'll choose the iOS or Android and copy the user agent from the sheet and paste it in ads power.\n• Check your profile settings and click on OK to create a profile.\n• Copy the tracking link from above and open Ads Power and paste that link.\n• It will do some checks and take you to a Facebook Page. If you are working on Android and iOS and using the User Agents, you won't see any pop-up, but if you do, close it, click **I couldn't complete**, click Others and write \"Facebook Popup error.\" You'll need to click on the **Learn More** button, if you don't see it, scroll down and it will be visible.\n• Continue your work like normal.",
    screenshot: false,
    status: "active",
    created: "2025-08-22 20:29:07",
    updated: "2025-09-11 16:00:31"
  },
  {
    id: 2,
    title: "Tasker Click with Images",
    slug: "tasker-click-images",
    content: "**How to Add User Agents To Ads Power:** https://youtu.be/mfbiD0Gjhl8\n\n• **If you are working on Android, use Android User Agents, If you are using iOS, use iPhone User Agents**\n\nPlease open or copy paste this link in your browser to get the list of user agents you'll be using for iOS and Android profiles.\nhttps://docs.google.com/spreadsheets/d/1xoKRqP0e3wW_iTWU-nqG1PcBk8_ILLj3m-_K-Hm8kfs/edit?usp=drivesdk\n\n• **Among the 200 target, you'll work on 120 iOS profiles, 40 Android profiles and 40 windows/mac profiles.**\n\n**Steps for Ads Power:**\n• You'll choose the iOS or Android and copy the user agent from the sheet and paste it in ads power.\n• Check your profile settings and click on OK to create a profile.\n• Copy the tracking link from above and open Ads Power and paste that link.\n• It will do some checks and take you to a Facebook Page. If you are working on Android and iOS and using the User Agents, you won't see any pop-up, but if you do, close it, click **I couldn't complete**, click Others and write \"Facebook Popup error.\" You'll need to click on the **Learn More** button, if you don't see it, scroll down and it will be visible.\n• Continue your work like normal.\n\n**Important Notes:**\n• Make sure to follow the exact steps shown in the images below\n• Pay attention to the highlighted areas in the screenshots\n• If you encounter any issues, refer to the troubleshooting guide",
    screenshot: true,
    status: "active",
    created: "2025-08-21 16:35:37",
    updated: "2025-09-11 15:58:37"
  },
  {
    id: 3,
    title: "Rich Text Formatting Demo",
    slug: "rich-text-demo",
    content: "**Welcome to the Rich Text Editor Demo!**\n\nThis task demonstrates all the formatting features available:\n\n• **Bold text** - Use Ctrl+B or click the Bold button\n• *Italic text* - Use Ctrl+I or click the Italic button\n• <u>Underlined text</u> - Use Ctrl+U or click the Underline button\n• [Links](https://example.com) - Click the Link button to add links\n\n**Instructions:**\n1. Select any text and click the formatting buttons\n2. Try the keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)\n3. Upload images by clicking the image icon or dragging and dropping\n4. Add bullet points using the list button\n5. Click the **Preview** button (eye icon) to see formatted content\n\n**Sample Image:**\n![Sample Image](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNhbXBsZSBJbWFnZTwvdGV4dD4KPC9zdmc+)\n\n**Test Different Formats:**\n\nThis is **bold text** and this is *italic text* and this is <u>underlined text</u>.\n\nHere's a [clickable link](https://google.com) to test links.\n\n• First bullet point\n• Second bullet point\n• Third bullet point",
    screenshot: false,
    status: "active",
    created: "2025-01-27 10:00:00",
    updated: "2025-01-27 10:00:00"
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
  const [viewEditContent, setViewEditContent] = useState("");
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
      content: newTasker.content, // Include the content field
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
    setViewEditContent(tasker.content || "");
    setIsViewDialogOpen(true);
  };

  const handleViewSave = () => {
    if (viewingTasker) {
      // Update the tasker content
      setTaskers(taskers.map(tasker => 
        tasker.id === viewingTasker.id 
          ? {
              ...tasker,
              content: viewEditContent,
              updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
          : tasker
      ));
      
      // Update the viewing tasker
      setViewingTasker({
        ...viewingTasker,
        content: viewEditContent,
        updated: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    }
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
            Manage your tasks and create new informational tasks for workers
          </p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Task Form */}
        <Card>
          <CardHeader className="bg-blue-50 ">
            <CardTitle className="text-blue-900">Create Task</CardTitle>
            <CardDescription>
              Create a new informational task for your workers
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
              <SimpleTiptapEditor
                value={newTasker.content}
                onChange={(content) => setNewTasker({...newTasker, content})}
                placeholder="Enter task content... Use the toolbar above to format your text, add images, links, tables, and more!"
                minHeight="200px"
              />
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
              Create Task
            </Button>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Manage your existing tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Screenshots?</TableHead>
                  <TableHead>Images</TableHead>
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
                      {tasker.content && tasker.content.includes('![') ? (
                        <Badge variant="default" className="bg-blue-500">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
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
      </div>
      </div>

      {/* View Tasker Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Edit · {viewingTasker?.title}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewSave}
                >
                  Save Changes
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {viewingTasker && (
            <div className="space-y-6">
              {/* Tasker Metadata */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="font-mono text-pink-600">{viewingTasker.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge 
                    variant={viewingTasker.status === "active" ? "default" : "secondary"}
                    className={viewingTasker.status === "active" ? "bg-green-500" : "bg-gray-500"}
                  >
                    {viewingTasker.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Screenshot required on completion:</span>
                  <Badge variant={viewingTasker.screenshot ? "default" : "secondary"}>
                    {viewingTasker.screenshot ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {/* Tasker Content */}
              <div className="space-y-4">
                <SimpleTiptapEditor
                  value={viewEditContent}
                  onChange={setViewEditContent}
                  placeholder="Enter task content... Use the toolbar above to format your text, add images, links, tables, and more!"
                  minHeight="400px"
                />
              </div>


              <div className="flex justify-end pt-4 border-t">
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
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Edit Tasker · {editingTasker?.title}
            </DialogTitle>
            <DialogDescription>
              Update the tasker configuration and preview the content
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Edit Form */}
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
                <SimpleTiptapEditor
                  value={editTasker.content}
                  onChange={(content) => setEditTasker({...editTasker, content})}
                  placeholder="Enter task content... Use the toolbar above to format your text, add images, links, tables, and more!"
                  minHeight="300px"
                />
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
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  Preview · {editTasker.title || "Untitled Tasker"}
                </h3>
                
                {/* Tasker Metadata Preview */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Slug:</span>
                    <span className="font-mono text-pink-600">{editTasker.slug || "auto-generated"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge 
                      variant={editingTasker?.status === "active" ? "default" : "secondary"}
                      className={editingTasker?.status === "active" ? "bg-green-500" : "bg-gray-500"}
                    >
                      {editingTasker?.status || "active"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Screenshot:</span>
                    <Badge variant={editTasker.screenshot ? "default" : "secondary"}>
                      {editTasker.screenshot ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="space-y-4">
                  {editTasker.content ? (
                    <RichTextDisplay 
                      content={editTasker.content}
                      showImages={true}
                    />
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No content added yet. Start typing in the editor to see a preview here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTasker}>
              Update Tasker
            </Button>
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
    </MainLayout>
  );
}
