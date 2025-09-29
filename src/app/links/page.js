"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Ban, ExternalLink, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useRef } from "react";

// Mock workers data with creation dates (newest first)
const mockWorkers = [
  { id: 1, name: "Muhammad Shahood", email: "Shahood1@joyapps.net", createdAt: "2025-01-15" },
  { id: 2, name: "Abid", email: "Abid1@joyapps.net", createdAt: "2025-01-14" },
  { id: 3, name: "Hassan", email: "Hassan1@joyapps.net", createdAt: "2025-01-13" },
  { id: 4, name: "Zaim", email: "Zaim1@joyapps.net", createdAt: "2025-01-12" },
  { id: 5, name: "Hamza Farid", email: "Hamza1@joyapps.net", createdAt: "2025-01-11" },
  { id: 6, name: "Sarah Johnson", email: "Sarah1@joyapps.net", createdAt: "2025-01-10" },
  { id: 7, name: "Emma Wilson", email: "Emma1@joyapps.net", createdAt: "2025-01-09" },
  { id: 8, name: "Alex Rodriguez", email: "Alex1@joyapps.net", createdAt: "2025-01-08" },
];

const mockLinks = [
  {
    id: 1,
    slug: "9HxyLSiJJV",
    publicUrl: "/I/9HxyLSiJJV",
    destination: "https://tracker.adkin.digital/c/gYeDmLTX8Vkx/{query}/{subid}",
    worker: "Muhammad Shahood",
    workerEmail: "Shahood1@joyapps.net",
    country: "US",
    ip: "Yes",
    min: "—",
    status: "active",
    allowed: 0,
    blocked: 1,
    created: "2025-09-10 16:47:07"
  },
  {
    id: 2,
    slug: "CPVkxSJGDK",
    publicUrl: "/I/CPVkxSJGDk",
    destination: "https://tracker.adkin.digital/c/gYeDmLTX8Vkx/{query}/{subid}",
    worker: "Abid",
    workerEmail: "Abid1@joyapps.net",
    country: "US",
    ip: "Yes",
    min: "3",
    status: "active",
    allowed: 0,
    blocked: 0,
    created: "2025-09-10 16:44:01"
  },
  {
    id: 3,
    slug: "HM5mjnkUML",
    publicUrl: "/I/HM5mjnkUML",
    destination: "https://tracker.adkin.digital/c/gYeDmLTX8Vkx/{query}/{subid}",
    worker: "Hassan",
    workerEmail: "Hassan1@joyapps.net",
    country: "US",
    ip: "Yes",
    min: "3",
    status: "active",
    allowed: 1,
    blocked: 0,
    created: "2025-09-10 12:55:52"
  },
  {
    id: 4,
    slug: "EykwMzFUZN",
    publicUrl: "/I/EykwMzFUZN",
    destination: "https://tracker.adkin.digital/c/gYeDmLTX8Vkx/{query}/{subid}",
    worker: "Zaim",
    workerEmail: "Zaim1@joyapps.net",
    country: "US",
    ip: "Yes",
    min: "3",
    status: "active",
    allowed: 10,
    blocked: 3,
    created: "2025-09-10 12:20:59"
  },
  {
    id: 5,
    slug: "LTfcMbXLVT",
    publicUrl: "/I/LTfcMbXLVT",
    destination: "https://tracker.adkin.digital/c/gYeDmLTX8Vkx/{query}/{subid}",
    worker: "Hamza Farid",
    workerEmail: "Hamzaf@joyapps.net",
    country: "US",
    ip: "Yes",
    min: "—",
    status: "active",
    allowed: 38,
    blocked: 3,
    created: "2025-09-09 17:19:50"
  }
];

export default function LinksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deletingLink, setDeletingLink] = useState(null);
  const [links, setLinks] = useState(mockLinks);
  const [newLink, setNewLink] = useState({
    destination: "",
    worker: "",
    country: "US",
    min: ""
  });
  const [workerSearchOpen, setWorkerSearchOpen] = useState(false);
  const [workerSearchQuery, setWorkerSearchQuery] = useState("");
  const [editWorkerSearchOpen, setEditWorkerSearchOpen] = useState(false);
  const [editWorkerSearchQuery, setEditWorkerSearchQuery] = useState("");
  
  // Refs for click outside detection
  const workerSearchRef = useRef(null);
  const editWorkerSearchRef = useRef(null);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workerSearchRef.current && !workerSearchRef.current.contains(event.target)) {
        setWorkerSearchOpen(false);
      }
      if (editWorkerSearchRef.current && !editWorkerSearchRef.current.contains(event.target)) {
        setEditWorkerSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [editLink, setEditLink] = useState({
    destination: "",
    worker: "",
    country: "US",
    min: ""
  });

  const filteredLinks = links.filter(link =>
    link.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.worker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.workerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLinks(filteredLinks.map(link => link.id));
    } else {
      setSelectedLinks([]);
    }
  };

  const handleSelectLink = (linkId, checked) => {
    if (checked) {
      setSelectedLinks([...selectedLinks, linkId]);
    } else {
      setSelectedLinks(selectedLinks.filter(id => id !== linkId));
    }
  };

  const handleCreateLink = () => {
    // Generate a new slug and create the link
    const newSlug = Math.random().toString(36).substring(2, 12).toUpperCase();
    const newLinkData = {
      id: Math.max(...links.map(link => link.id)) + 1,
      slug: newSlug,
      publicUrl: `/I/${newSlug}`,
      destination: newLink.destination,
      worker: newLink.worker,
      workerEmail: `${newLink.worker.toLowerCase().replace(/\s+/g, '')}@joyapps.net`,
      country: newLink.country,
      ip: "Yes",
      min: newLink.min || "—",
      status: "active",
      allowed: 0,
      blocked: 0,
      created: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    setLinks([...links, newLinkData]);
    setIsCreateDialogOpen(false);
    setNewLink({
      destination: "",
      worker: "",
      country: "US",
      min: ""
    });
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setEditLink({
      destination: link.destination,
      worker: link.worker,
      country: link.country,
      min: link.min
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateLink = () => {
    // Update the link in the state
    setLinks(links.map(link => 
      link.id === editingLink.id 
        ? {
            ...link,
            destination: editLink.destination,
            worker: editLink.worker,
            workerEmail: `${editLink.worker.toLowerCase().replace(/\s+/g, '')}@joyapps.net`,
            country: editLink.country,
            min: editLink.min || "—"
          }
        : link
    ));
    
    setIsEditDialogOpen(false);
    setEditingLink(null);
    setEditLink({
      destination: "",
      worker: "",
      country: "US",
      min: ""
    });
  };

  const handleDeleteLink = (link) => {
    setDeletingLink(link);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLink = () => {
    // Remove the link from the state
    setLinks(links.filter(link => link.id !== deletingLink.id));
    setIsDeleteDialogOpen(false);
    setDeletingLink(null);
  };

  const handleDeactivateLink = (link) => {
    // Toggle the status of the link
    setLinks(links.map(l => 
      l.id === link.id 
        ? { ...l, status: l.status === 'active' ? 'inactive' : 'active' }
        : l
    ));
  };

  // Filter workers based on search query
  const filteredWorkers = mockWorkers.filter(worker =>
    worker.name.toLowerCase().includes(workerSearchQuery.toLowerCase()) ||
    worker.email.toLowerCase().includes(workerSearchQuery.toLowerCase())
  );

  // Filter workers for edit form
  const filteredEditWorkers = mockWorkers.filter(worker =>
    worker.name.toLowerCase().includes(editWorkerSearchQuery.toLowerCase()) ||
    worker.email.toLowerCase().includes(editWorkerSearchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <p className="text-muted-foreground">
            Manage your tracking links and their configurations
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Button variant="outline">
                Bulk edit
              </Button>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Link</DialogTitle>
                  <DialogDescription>
                    Create a new tracking link for your workers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination URL</Label>
                    <Input
                      id="destination"
                      value={newLink.destination}
                      onChange={(e) => setNewLink({...newLink, destination: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker">Worker</Label>
                    <div className="relative" ref={workerSearchRef}>
                      <Command className="border rounded-md">
                        <CommandInput
                          placeholder={newLink.worker || "Search workers..."}
                          value={workerSearchOpen ? workerSearchQuery : newLink.worker}
                          onValueChange={setWorkerSearchQuery}
                          onFocus={() => setWorkerSearchOpen(true)}
                          className={`h-10 ${newLink.worker ? 'bg-green-50 border-green-200' : ''}`}
                        />
                        {workerSearchOpen && (
                          <CommandList className="max-h-60 overflow-y-auto">
                            <CommandEmpty>No worker found.</CommandEmpty>
                            <CommandGroup>
                              {filteredWorkers.map((worker) => (
                                <CommandItem
                                  key={worker.id}
                                  value={worker.name}
                                  onSelect={() => {
                                    setNewLink({...newLink, worker: worker.name});
                                    setWorkerSearchOpen(false);
                                    setWorkerSearchQuery("");
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{worker.name}</span>
                                    <span className="text-sm text-muted-foreground">{worker.email}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        )}
                      </Command>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={newLink.country} onValueChange={(value) => setNewLink({...newLink, country: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="AU">AU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min">Min (minutes)</Label>
                    <Input
                      id="min"
                      value={newLink.min}
                      onChange={(e) => setNewLink({...newLink, min: e.target.value})}
                      placeholder="3"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateLink}>
                      Create Link
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Edit Link Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update the tracking link configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-destination">Destination URL</Label>
              <Input
                id="edit-destination"
                value={editLink.destination}
                onChange={(e) => setEditLink({...editLink, destination: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-worker">Worker</Label>
              <div className="relative" ref={editWorkerSearchRef}>
                <Command className="border rounded-md">
                  <CommandInput
                    placeholder={editLink.worker || "Search workers..."}
                    value={editWorkerSearchOpen ? editWorkerSearchQuery : editLink.worker}
                    onValueChange={setEditWorkerSearchQuery}
                    onFocus={() => setEditWorkerSearchOpen(true)}
                    className={`h-10 ${editLink.worker ? 'bg-green-50 border-green-200' : ''}`}
                  />
                  {editWorkerSearchOpen && (
                    <CommandList className="max-h-60 overflow-y-auto">
                      <CommandEmpty>No worker found.</CommandEmpty>
                      <CommandGroup>
                        {filteredEditWorkers.map((worker) => (
                          <CommandItem
                            key={worker.id}
                            value={worker.name}
                            onSelect={() => {
                              setEditLink({...editLink, worker: worker.name});
                              setEditWorkerSearchOpen(false);
                              setEditWorkerSearchQuery("");
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{worker.name}</span>
                              <span className="text-sm text-muted-foreground">{worker.email}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  )}
                </Command>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Select value={editLink.country} onValueChange={(value) => setEditLink({...editLink, country: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="CA">CA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="AU">AU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-min">Min (minutes)</Label>
              <Input
                id="edit-min"
                value={editLink.min}
                onChange={(e) => setEditLink({...editLink, min: e.target.value})}
                placeholder="3"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLink}>
                Update Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Link
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tracking link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingLink && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Slug:</span>
                    <span className="text-sm">{deletingLink.slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Worker:</span>
                    <span className="text-sm">{deletingLink.worker}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Country:</span>
                    <span className="text-sm">{deletingLink.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant="default" className="bg-green-500 text-xs">
                      {deletingLink.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeleteLink}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Links Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLinks.length === filteredLinks.length && filteredLinks.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Slug / Public URL</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>1x IP</TableHead>
                <TableHead>Min(min)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Allowed</TableHead>
                <TableHead>Blocked</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLinks.includes(link.id)}
                      onCheckedChange={(checked) => handleSelectLink(link.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{link.slug}</div>
                      <a 
                        href={link.publicUrl} 
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.publicUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={link.destination} 
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.destination}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{link.worker}</div>
                      <div className="text-sm text-muted-foreground">{link.workerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{link.country}</TableCell>
                  <TableCell>{link.ip}</TableCell>
                  <TableCell>{link.min}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-500">
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{link.allowed}</TableCell>
                  <TableCell className="text-center">{link.blocked}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {link.created}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditLink(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={link.status === 'active' 
                          ? "text-orange-600 hover:text-orange-700" 
                          : "text-green-600 hover:text-green-700"
                        }
                        onClick={() => handleDeactivateLink(link)}
                      >
                        {link.status === 'active' ? (
                          <Ban className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteLink(link)}
                      >
                        <Trash2 className="h-4 w-4" />
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
    </MainLayout>
  );
}
