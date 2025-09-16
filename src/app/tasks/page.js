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
import { Eye, Edit, Ban } from "lucide-react";

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
  const [newTasker, setNewTasker] = useState({
    title: "",
    slug: "",
    content: "",
    screenshot: false
  });

  const handleCreateTasker = () => {
    // Handle tasker creation logic here
    console.log("Creating tasker:", newTasker);
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
                {mockTaskers.map((tasker) => (
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
                      <Badge variant="default" className="bg-green-500">
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
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Ban className="h-4 w-4" />
                        </Button>
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
    </MainLayout>
  );
}
