"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Target } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock worker data for selection
const mockWorkers = [
  { id: 1, name: "Muhammad Shahood", email: "muhammad.shahood@joyapps.net", type: "permanent", role: "viewer" },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "permanent", role: "viewer" },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "permanent", role: "viewer" },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "permanent", role: "clicker" },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "permanent", role: "clicker" },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "permanent", role: "clicker" },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "trainee", role: "viewer" },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "trainee", role: "clicker" },
  { id: 9, name: "Mike Chen", email: "mike.chen@joyapps.net", type: "trainee", role: "clicker" },
  { id: 10, name: "David Kim", email: "david.kim@joyapps.net", type: "trainee", role: "clicker" },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "active",
    workers: {
      permanentViewers: [],
      permanentClickers: [],
      traineeViewers: [],
      traineeClickers: []
    }
  });

  const handleInputChange = (field, value) => {
    setNewCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkerSelection = (workerId, workerType, workerRole, checked) => {
    const workerKey = `${workerType}${workerRole.charAt(0).toUpperCase() + workerRole.slice(1)}s`;
    
    setNewCampaign(prev => ({
      ...prev,
      workers: {
        ...prev.workers,
        [workerKey]: checked 
          ? [...prev.workers[workerKey], workerId]
          : prev.workers[workerKey].filter(id => id !== workerId)
      }
    }));
  };

  const handleCreateCampaign = () => {
    // Here you would typically send the data to your API
    console.log("Creating campaign:", newCampaign);
    
    // For now, just redirect back to campaigns
    router.push("/campaigns");
  };

  const handleBackToCampaigns = () => {
    router.push("/campaigns");
  };

  const permanentViewers = mockWorkers.filter(w => w.type === "permanent" && w.role === "viewer");
  const permanentClickers = mockWorkers.filter(w => w.type === "permanent" && w.role === "clicker");
  const traineeViewers = mockWorkers.filter(w => w.type === "trainee" && w.role === "viewer");
  const traineeClickers = mockWorkers.filter(w => w.type === "trainee" && w.role === "clicker");

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Button and Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToCampaigns}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Campaign</h1>
            <p className="text-muted-foreground">Set up a new marketing campaign</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Enter the basic information for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="Enter campaign name"
                  value={newCampaign.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter campaign description"
                  value={newCampaign.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter budget"
                    value={newCampaign.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newCampaign.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Worker Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assign Workers</CardTitle>
              <CardDescription>Select workers to assign to this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Permanent Viewers */}
              <div>
                <h4 className="font-medium mb-3">Permanent Viewers</h4>
                <div className="space-y-2">
                  {permanentViewers.map((worker) => (
                    <div key={worker.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permanent-viewer-${worker.id}`}
                        checked={newCampaign.workers.permanentViewers.includes(worker.id)}
                        onCheckedChange={(checked) => 
                          handleWorkerSelection(worker.id, "permanent", "viewer", checked)
                        }
                      />
                      <Label htmlFor={`permanent-viewer-${worker.id}`} className="text-sm">
                        {worker.name} ({worker.email})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permanent Clickers */}
              <div>
                <h4 className="font-medium mb-3">Permanent Clickers</h4>
                <div className="space-y-2">
                  {permanentClickers.map((worker) => (
                    <div key={worker.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permanent-clicker-${worker.id}`}
                        checked={newCampaign.workers.permanentClickers.includes(worker.id)}
                        onCheckedChange={(checked) => 
                          handleWorkerSelection(worker.id, "permanent", "clicker", checked)
                        }
                      />
                      <Label htmlFor={`permanent-clicker-${worker.id}`} className="text-sm">
                        {worker.name} ({worker.email})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trainee Viewers */}
              <div>
                <h4 className="font-medium mb-3">Trainee Viewers</h4>
                <div className="space-y-2">
                  {traineeViewers.map((worker) => (
                    <div key={worker.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`trainee-viewer-${worker.id}`}
                        checked={newCampaign.workers.traineeViewers.includes(worker.id)}
                        onCheckedChange={(checked) => 
                          handleWorkerSelection(worker.id, "trainee", "viewer", checked)
                        }
                      />
                      <Label htmlFor={`trainee-viewer-${worker.id}`} className="text-sm">
                        {worker.name} ({worker.email})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trainee Clickers */}
              <div>
                <h4 className="font-medium mb-3">Trainee Clickers</h4>
                <div className="space-y-2">
                  {traineeClickers.map((worker) => (
                    <div key={worker.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`trainee-clicker-${worker.id}`}
                        checked={newCampaign.workers.traineeClickers.includes(worker.id)}
                        onCheckedChange={(checked) => 
                          handleWorkerSelection(worker.id, "trainee", "clicker", checked)
                        }
                      />
                      <Label htmlFor={`trainee-clicker-${worker.id}`} className="text-sm">
                        {worker.name} ({worker.email})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
          <Button variant="outline" onClick={handleBackToCampaigns}>
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
