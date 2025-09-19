"use client";

import { useState, useEffect } from "react";
import ManagerMainLayout from "@/components/layout/ManagerMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Eye, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Save,
  AlertCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Target
} from "lucide-react";
import { useUsers } from "@/contexts/UsersContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ManagerTeamPage() {
  const { users, updateUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Get team members assigned to this manager
  useEffect(() => {
    if (currentUser && users.length > 0) {
      // Find users assigned to this manager
      const assignedUserIds = currentUser.assignedUsers || [];
      const teamMembersData = users.filter(user => 
        assignedUserIds.includes(user.id) && user.role === "worker"
      ).map(user => ({
        ...user,
        // Add performance and task data (mock for now)
        performance: user.performance || Math.floor(Math.random() * 30) + 70,
        tasksCompleted: Math.floor(Math.random() * 20) + 10,
        totalTasks: Math.floor(Math.random() * 10) + 25,
        lastActive: user.lastActive || new Date().toISOString().split('T')[0],
        skills: user.skills || ["Click Quality", "Form Analysis", "Bot Detection"],
        currentCampaign: user.currentCampaign || "Active Campaign"
      }));
      
      setTeamMembers(teamMembersData);
      setIsLoading(false);
    }
  }, [currentUser, users]);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle status change
  const handleStatusChange = (memberId, newStatus) => {
    setPendingChanges(prev => ({
      ...prev,
      [memberId]: newStatus
    }));
  };

  // Save status changes
  const saveStatusChanges = async () => {
    try {
      const changes = Object.entries(pendingChanges);
      if (changes.length === 0) {
        toast.info("No changes to save");
        return;
      }

      // Update each user's status
      for (const [memberId, newStatus] of changes) {
        const member = teamMembers.find(m => m.id === parseInt(memberId));
        if (member) {
          updateUser(parseInt(memberId), { ...member, status: newStatus });
        }
      }

      // Clear pending changes
      setPendingChanges({});
      toast.success("Status changes saved successfully!");
    } catch (error) {
      console.error("Error saving status changes:", error);
      toast.error("Failed to save status changes");
    }
  };

  // Cancel pending changes
  const cancelChanges = () => {
    setPendingChanges({});
    toast.info("Changes cancelled");
  };

  // Handle view team member
  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  // Close member modal
  const closeMemberModal = () => {
    setSelectedMember(null);
    setShowMemberModal(false);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "permanent": return "default";
      case "trainee": return "secondary";
      case "terminated": return "destructive";
      case "blocked": return "outline";
      default: return "secondary";
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-600";
    if (performance >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <ManagerMainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading team members...</span>
          </div>
        </div>
      </ManagerMainLayout>
    );
  }


  return (
    <ManagerMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Status Management</h1>
            <p className="text-muted-foreground">Update any team member&apos;s employment status</p>
          </div>
          {Object.keys(pendingChanges).length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelChanges}>
                Cancel Changes
              </Button>
              <Button onClick={saveStatusChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes ({Object.keys(pendingChanges).length})
          </Button>
            </div>
          )}
        </div>

        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                {teamMembers.filter(m => m.status === "permanent").length} permanent
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permanent Staff</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.status === "permanent").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Full-time employees
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trainees</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.status === "trainee").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Learning and training
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Changes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(pendingChanges).length}</div>
              <p className="text-xs text-muted-foreground">
                Unsaved status updates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Team Filters</CardTitle>
            <CardDescription>Search and filter through your team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Team Members</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="trainee">Trainee</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members - Status Management</CardTitle>
            <CardDescription>
              {filteredMembers.length} member(s) found. Click on status to change employment status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members Assigned</h3>
                <p className="text-gray-500 mb-4">
                  You don&apos;t have any team members assigned to you yet. Contact HR to assign team members to your account.
                </p>
                <div className="text-sm text-gray-400">
                  <p>Debug Info:</p>
                  <p>Current User ID: {currentUser?.id}</p>
                  <p>Assigned User IDs: {currentUser?.assignedUsers?.join(', ') || 'None'}</p>
                  <p>Total Users: {users.length}</p>
                </div>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                      <TableHead>Current Status</TableHead>
                    <TableHead>Performance</TableHead>
                      <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredMembers.map((member) => {
                      const currentStatus = pendingChanges[member.id] || member.status;
                      const hasChanges = pendingChanges[member.id] !== undefined;
                      
                      return (
                        <TableRow key={member.id} className={hasChanges ? "bg-yellow-50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                                <div className="text-xs text-muted-foreground">
                                  {member.workerType?.replace('-', ' ') || 'Worker'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusBadgeVariant(currentStatus)}>
                                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                        </Badge>
                                {hasChanges && (
                                  <Badge variant="outline" className="text-xs">
                                    Pending
                        </Badge>
                                )}
                              </div>
                              <Select
                                value={currentStatus}
                                onValueChange={(value) => handleStatusChange(member.id, value)}
                              >
                                <SelectTrigger className="w-32 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="trainee">Trainee</SelectItem>
                                  <SelectItem value="permanent">Permanent</SelectItem>
                                  <SelectItem value="terminated">Terminated</SelectItem>
                                  <SelectItem value="blocked">Blocked</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                      </TableCell>
                      <TableCell>
                            <div className="flex items-center gap-2">
                        <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${member.performance}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                              {member.created ? new Date(member.created).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewMember(member)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                    </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>

        {/* Status Change Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Status Change Guidelines</CardTitle>
            <CardDescription>Important information about changing team member status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Trainee → Permanent</h4>
                  <p className="text-xs text-muted-foreground">
                    Promote team members who have completed their training period and are performing well.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Permanent → Terminated</h4>
                  <p className="text-xs text-muted-foreground">
                    Use only for employees who are leaving the company or have been dismissed.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Any Status → Blocked</h4>
                  <p className="text-xs text-muted-foreground">
                    Temporarily block access for employees under investigation or on leave.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Important Notes</h4>
                  <p className="text-xs text-muted-foreground">
                    All status changes are logged and require manager approval. Changes take effect immediately.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Member Detail Modal */}
        {showMemberModal && selectedMember && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Team Member Details</h2>
                <Button variant="ghost" size="sm" onClick={closeMemberModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedMember.avatar} />
                    <AvatarFallback className="text-lg">
                      {selectedMember.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                    <p className="text-muted-foreground">{selectedMember.email}</p>
                    <Badge variant={getStatusBadgeVariant(selectedMember.status)} className="mt-1">
                      {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedMember.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>New York, NY</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Work Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>{selectedMember.workerType?.replace('-', ' ') || 'Worker'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Joined: {selectedMember.created ? new Date(selectedMember.created).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span>Performance: {selectedMember.performance}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Performance Metrics
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedMember.performance}%</div>
                      <div className="text-xs text-gray-600">Overall Performance</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${selectedMember.performance}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedMember.tasksCompleted || 15}</div>
                      <div className="text-xs text-gray-600">Tasks Completed</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedMember.totalTasks || 25}</div>
                      <div className="text-xs text-gray-600">Total Tasks</div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMember.skills || ["Click Quality", "Form Analysis", "Bot Detection"]).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current Campaign */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Current Assignment</h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">{selectedMember.currentCampaign || "Active Campaign"}</div>
                    <div className="text-xs text-blue-700">Currently working on this campaign</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <Button variant="outline" onClick={closeMemberModal}>
                  Close
                </Button>
              
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerMainLayout>
  );
}
