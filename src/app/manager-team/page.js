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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Target,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Activity,
  RefreshCw,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useUsers } from "@/contexts/UsersContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { ManagerWorkflowProvider } from "@/contexts/ManagerWorkflowContext";
import { toast } from "sonner";

function ManagerTeamPageContent() {
  const { users, updateUser } = useUsers() || {};
  const { user: currentUser, checkUserLockStatus } = useAuth() || {};
  const { getTeamAttendance, approveAttendance, getAttendanceForDate } = useAttendance() || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get team members assigned to this manager
  useEffect(() => {
    if (currentUser && users && users.length > 0) {
      // Find users assigned to this manager
      const assignedUserIds = currentUser.assignedUsers || [];
      const teamMembersData = users.filter(user => 
        assignedUserIds.includes(user.id) && user.role === "worker"
      ).map(user => {
        // Generate consistent mock data based on user ID
        const seed = user.id;
        const phoneNumbers = [
          "+1-555-0123",
          "+1-555-0456", 
          "+1-555-0789",
          "+1-555-0321",
          "+1-555-0654",
          "+1-555-0987",
          "+1-555-0135"
        ];
        
        return {
          ...user,
          // Add phone number
          phone: phoneNumbers[seed % phoneNumbers.length] || "+1-555-0000",
          // Add performance and task data (mock for now)
          performance: user.performance || Math.floor(Math.random() * 30) + 70,
          tasksCompleted: Math.floor(Math.random() * 20) + 10,
          totalTasks: Math.floor(Math.random() * 10) + 25,
          lastActive: user.lastActive || new Date().toISOString().split('T')[0],
          skills: user.skills || ["Click Quality", "Form Analysis", "Bot Detection"],
          currentCampaign: user.currentCampaign || "Active Campaign",
          // Add performance targets and actuals
          dailyTarget: Math.floor(Math.random() * 20) + 80, // 80-100
          actualDone: Math.floor(Math.random() * 30) + 60, // 60-90
          goodClicks: Math.floor(Math.random() * 50) + 20, // 20-70
          badClicks: Math.floor(Math.random() * 10) + 1, // 1-11
          // Add activity status
          isActive: Math.random() > 0.3, // 70% chance of being active
          lastInteraction: new Date(Date.now() - Math.random() * 600000).toISOString() // Random time within last 10 minutes
        };
      });
      
      setTeamMembers(teamMembersData);
      setIsLoading(false);
    }
  }, [currentUser, users]);

  const filteredMembers = (teamMembers || []).filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle status change
  const handleStatusChange = (memberId, newStatus) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    // Show confirmation dialog
    setConfirmAction({
      type: 'status',
      memberId,
      memberName: member.name,
      currentStatus: member.status,
      newStatus,
      action: () => {
        setPendingChanges(prev => ({
          ...prev,
          [memberId]: newStatus
        }));
      }
    });
    setShowStatusConfirm(true);
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
        const member = (teamMembers || []).find(m => m.id === parseInt(memberId));
        if (member && updateUser && typeof updateUser === 'function') {
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

  // Get attendance data for today
  const teamAttendance = getTeamAttendance ? getTeamAttendance(teamMembers.map(m => m.id), selectedDate) : [];
  
  // Get attendance status for a member
  const getAttendanceStatus = (memberId) => {
    const attendance = teamAttendance.find(a => a.userId === memberId);
    if (!attendance) {
      return { 
        status: 'not_marked', 
        label: 'Not Marked', 
        color: 'bg-gray-100 text-gray-800', 
        icon: Clock 
      };
    }
    
    switch (attendance.status) {
      case 'present':
      case 'approved':
        return {
          status: 'present',
          label: 'Present',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'marked':
        return {
          status: 'marked',
          label: 'Pending Verification',
          color: 'bg-yellow-100 text-yellow-800',
          icon: AlertCircle
        };
      case 'absent':
      case 'rejected':
        return {
          status: 'absent',
          label: 'Absent',
          color: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      default:
        return {
          status: 'unknown',
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  // Verify attendance (approve or reject)
  const handleVerifyAttendance = async (memberId, action) => {
    try {
      if (approveAttendance) {
        await approveAttendance(memberId, selectedDate, action);
        toast.success(`Attendance ${action} for ${teamMembers.find(m => m.id === memberId)?.name}`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} attendance`);
      console.error('Error verifying attendance:', error);
    }
  };

  // Close member modal
  const closeMemberModal = () => {
    setSelectedMember(null);
    setShowMemberModal(false);
  };

  // Handle lock/unlock functionality
  const handleLockUnlock = async (memberId, isLocked) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) {
      toast.error("Member not found");
      return;
    }

    // Show confirmation dialog
    setConfirmAction({
      type: 'lock',
      memberId,
      memberName: member.name,
      isLocked,
      action: async () => {
        try {
          // Update user's locked status
          const updatedMember = { ...member, locked: isLocked ? "locked" : "unlocked" };
          if (updateUser && typeof updateUser === 'function') {
            updateUser(memberId, updatedMember);
          }

          // If locking, check if the user is currently logged in and log them out
          if (isLocked) {
            // Check if the locked user is currently logged in
            const isCurrentlyLoggedIn = currentUser && currentUser.id === memberId;
            if (isCurrentlyLoggedIn) {
              // Log out the currently logged in user
              if (checkUserLockStatus && typeof checkUserLockStatus === 'function') {
                checkUserLockStatus();
              }
              toast.success(`${member.name} has been locked and logged out`);
            } else {
              toast.success(`${member.name} has been locked`);
            }
          } else {
            toast.success(`${member.name} has been unlocked and can log in again`);
          }
        } catch (error) {
          console.error("Error updating lock status:", error);
          toast.error("Failed to update lock status");
        }
      }
    });
    setShowLockConfirm(true);
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
            <p className="text-muted-foreground">Update team member status and verify attendance</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="date-select" className="text-sm">Date:</Label>
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            {Object.keys(pendingChanges).length > 0 && (
              <>
                <Button variant="outline" onClick={cancelChanges}>
                  Cancel Changes
                </Button>
                <Button onClick={saveStatusChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes ({Object.keys(pendingChanges).length})
                </Button>
              </>
            )}
          </div>
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
              <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {teamAttendance.filter(a => a.status === 'present' || a.status === 'approved').length}/{teamMembers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">
                  {teamAttendance.filter(a => a.status === 'present' || a.status === 'approved').length}
                </span> present • 
                <span className="text-yellow-600 font-medium ml-1">
                  {teamAttendance.filter(a => a.status === 'marked').length}
                </span> pending
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
                    <TableHead>Phone</TableHead>
                    <TableHead>Target / Actual</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Active Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
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
                              {member.name?.split(" ").map(n => n[0]).join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {member.phone || 'No phone'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm">
                              {member.dailyTarget || 0} / {member.actualDone || 0}
                            </span>
                          </div>
                          {/* <div className="text-xs text-muted-foreground">
                            Target / Actual Done
                          </div> */}
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              {member.goodClicks || 0} good
                            </div>
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="h-3 w-3" />
                              {member.badClicks || 0} bad
                            </div>
                          </div>
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
                        <div className="flex items-center gap-2">
                          {(() => {
                            const isActive = member.isActive;
                            const lastInteraction = new Date(member.lastInteraction);
                            const now = new Date();
                            const minutesSinceLastInteraction = Math.floor((now - lastInteraction) / (1000 * 60));
                            
                            // If more than 10 minutes since last interaction, mark as inactive
                            const actuallyActive = minutesSinceLastInteraction <= 10;
                            
                            return (
                              <div className="flex items-center gap-2">
                                {actuallyActive ? (
                                  <Wifi className="h-4 w-4 text-green-600" />
                                ) : (
                                  <WifiOff className="h-4 w-4 text-red-600" />
                                )}
                                <Badge 
                                  variant={actuallyActive ? "default" : "secondary"}
                                  className={actuallyActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                  {actuallyActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last seen: {new Date(member.lastInteraction).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {(() => {
                            const attendance = getAttendanceStatus(member.id);
                            const IconComponent = attendance.icon;
                            return (
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <Badge className={attendance.color}>
                                  {attendance.label}
                                </Badge>
                              </div>
                            );
                          })()}
                          {(() => {
                            const attendance = teamAttendance.find(a => a.userId === member.id);
                            if (attendance && attendance.status === 'marked') {
                              return (
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleVerifyAttendance(member.id, 'approved')}
                                    className="text-xs px-2 py-1 h-6"
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleVerifyAttendance(member.id, 'rejected')}
                                    className="text-xs px-2 py-1 h-6 text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={member.locked === "locked" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {member.locked === "locked" ? (
                                <>
                                  <Lock className="h-3 w-3 mr-1" />
                                  Locked
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-3 w-3 mr-1" />
                                  Unlocked
                                </>
                              )}
                            </Badge>
                          </div>
                          {/* <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusBadgeVariant(currentStatus)} className="text-xs">
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
                              <SelectTrigger className="w-24 h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="trainee">Trainee</SelectItem>
                                <SelectItem value="permanent">Permanent</SelectItem>
                                <SelectItem value="terminated">Terminated</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                              </SelectContent>
                            </Select>
                          </div> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                              <Button 
                                variant={member.locked === "locked" ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleLockUnlock(member.id, member.locked !== "locked")}
                                className={member.locked === "locked" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700 text-white"}
                              >
                                {member.locked === "locked" ? (
                                  <>
                                    <Unlock className="h-4 w-4 mr-1" />
                                    Unlock
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-4 w-4 mr-1" />
                                    Lock
                                  </>
                                )}
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

                {/* Attendance Status */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Attendance Status - {new Date(selectedDate).toLocaleDateString()}
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {(() => {
                      const attendance = getAttendanceStatus(selectedMember.id);
                      const IconComponent = attendance.icon;
                      const attendanceRecord = teamAttendance.find(a => a.userId === selectedMember.id);
                      
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6" />
                            <div>
                              <p className="font-medium">{attendance.label}</p>
                              {attendanceRecord && (
                                <p className="text-sm text-gray-500">
                                  Marked at: {new Date(attendanceRecord.markedAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {attendanceRecord && attendanceRecord.status === 'marked' && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyAttendance(selectedMember.id, 'approved')}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve Attendance
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyAttendance(selectedMember.id, 'rejected')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Attendance
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
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

        {/* Status Change Confirmation Dialog */}
        <Dialog open={showStatusConfirm} onOpenChange={setShowStatusConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
              <DialogDescription>
                Are you sure you want to change {confirmAction?.memberName}&apos;s status from{' '}
                <span className="font-semibold capitalize">{confirmAction?.currentStatus}</span> to{' '}
                <span className="font-semibold capitalize">{confirmAction?.newStatus}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusConfirm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (confirmAction?.action) {
                    confirmAction.action();
                  }
                  setShowStatusConfirm(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirm Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lock/Unlock Confirmation Dialog */}
        <Dialog open={showLockConfirm} onOpenChange={setShowLockConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmAction?.isLocked ? 'Lock Account' : 'Unlock Account'}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {confirmAction?.isLocked ? 'lock' : 'unlock'} {confirmAction?.memberName}&apos;s account?
                {confirmAction?.isLocked && (
                  <span className="block mt-2 text-red-600 font-medium">
                    This will immediately log them out if they are currently logged in.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLockConfirm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (confirmAction?.action) {
                    confirmAction.action();
                  }
                  setShowLockConfirm(false);
                }}
                className={confirmAction?.isLocked ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              >
                {confirmAction?.isLocked ? 'Lock Account' : 'Unlock Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ManagerMainLayout>
  );
}

export default function ManagerTeamPage() {
  return <ManagerTeamPageContent />;
}
