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
import { Plus, Search, Edit, Ban, ExternalLink } from "lucide-react";

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
  const [newLink, setNewLink] = useState({
    destination: "",
    worker: "",
    country: "US",
    min: ""
  });

  const filteredLinks = mockLinks.filter(link =>
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
    // Handle link creation logic here
    console.log("Creating link:", newLink);
    setIsCreateDialogOpen(false);
    setNewLink({
      destination: "",
      worker: "",
      country: "US",
      min: ""
    });
  };

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
                    <Select value={newLink.worker} onValueChange={(value) => setNewLink({...newLink, worker: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a worker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="muhammad-shahood">Muhammad Shahood</SelectItem>
                        <SelectItem value="abid">Abid</SelectItem>
                        <SelectItem value="hassan">Hassan</SelectItem>
                        <SelectItem value="zaim">Zaim</SelectItem>
                        <SelectItem value="hamza-farid">Hamza Farid</SelectItem>
                      </SelectContent>
                    </Select>
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
                <TableHead>IP</TableHead>
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
    </MainLayout>
  );
}
