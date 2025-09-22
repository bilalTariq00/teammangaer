"use client";

import { useState, useEffect, Suspense } from "react";
import ManagerMainLayout from "@/components/layout/ManagerMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Clock,
  UserPlus,
  Edit,
  X,
  Plus,
  Eye,
  EyeOff,
  CheckSquare,
  Square
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import AttendanceVerification from "@/components/AttendanceVerification";
import PerformanceMarking from "@/components/PerformanceMarking";
import TaskAssignment from "@/components/tasks/TaskAssignment";

// Mock data for manager's team
const mockTeamMembers = [
  { id: 1, name: "Muhammad Shahood", email: "Shahood1@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 139, goodClicks: 123, badClicks: 16, performance: 88.5 },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 45, goodClicks: 38, badClicks: 7, performance: 84.4 },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 92, goodClicks: 78, badClicks: 14, performance: 84.8 },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 156, goodClicks: 142, badClicks: 14, performance: 91.0 },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 134, goodClicks: 118, badClicks: 16, performance: 88.1 },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 142, goodClicks: 125, badClicks: 17, performance: 88.0 },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 28, goodClicks: 22, badClicks: 6, performance: 78.6 },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 45, goodClicks: 38, badClicks: 7, performance: 84.4 }
];

// Mock data for campaigns
const mockCampaigns = [
  { id: 1, name: "E-commerce Campaign Q1", status: "Active", assignedUsers: 5, completedTasks: 45, totalTasks: 60, progress: 75, deadline: "2024-03-15" },
  { id: 2, name: "Social Media Campaign", status: "Active", assignedUsers: 3, completedTasks: 20, totalTasks: 30, progress: 67, deadline: "2024-03-20" },
  { id: 3, name: "Product Launch Campaign", status: "Planning", assignedUsers: 8, completedTasks: 5, totalTasks: 50, progress: 10, deadline: "2024-04-01" }
];

// Mock data for tasks
const mockTasks = [
  { id: 1, title: "Review product images", campaign: "E-commerce Campaign Q1", assignedTo: "Hasan Abbas", status: "Completed", priority: "High", dueDate: "2024-03-10" },
  { id: 2, title: "Update product descriptions", campaign: "E-commerce Campaign Q1", assignedTo: "Sarah Johnson", status: "In Progress", priority: "Medium", dueDate: "2024-03-12" },
  { id: 3, title: "Social media content creation", campaign: "Social Media Campaign", assignedTo: "Emma Wilson", status: "Pending", priority: "High", dueDate: "2024-03-15" },
  { id: 4, title: "Quality check completed tasks", campaign: "E-commerce Campaign Q1", assignedTo: "Alex Rodriguez", status: "Completed", priority: "Medium", dueDate: "2024-03-08" }
];

const mockTeamStats = {
  totalMembers: 8,
  activeMembers: 8,
  totalClicks: 781,
  totalGoodClicks: 584,
  totalBadClicks: 197,
  averagePerformance: 87.2
};

function ManagerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { users } = useUsers();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUsers, setShowEditUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Permanent Worker",
    password: ""
  });

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };

  const handleAddUser = () => {
    setShowAddUser(true);
    setActiveTab("users");
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditUsers(true);
    setActiveTab("users");
  };

  const handleUpdateUser = () => {
    // In a real app, this would make an API call
    console.log("Updating user:", editingUser);
    setEditingUser(null);
    setShowEditUsers(false);
  };

  const handleMemberClick = (memberId) => {
    router.push(`/worker/${memberId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Planning": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ManagerMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">Manage your team, campaigns, and tasks</p>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockTeamStats.totalMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockTeamStats.activeMembers} active members
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockTeamStats.totalClicks.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockTeamStats.totalGoodClicks} good clicks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockTeamStats.averagePerformance}%</div>
                  <p className="text-xs text-muted-foreground">
                    Average performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockCampaigns.filter(c => c.status === "Active").length}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockCampaigns.length} total campaigns
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Your team's performance overview</CardDescription>
                  </div>
                  <Button onClick={handleAddUser} className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{member.performance}%</p>
                          <p className="text-xs text-gray-500">Performance</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMemberClick(member.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Team Management</h2>
              <Button onClick={handleAddUser} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Team Member
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add User Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Team Member</CardTitle>
                  <CardDescription>
                    Add a new team member to your dashboard. You can create all user roles including Workers and QC.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent Worker">Permanent Worker</SelectItem>
                        <SelectItem value="Trainee Worker">Trainee Worker</SelectItem>
                        <SelectItem value="QC">QC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </CardContent>
              </Card>

              {/* Team Members List */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Team Members</CardTitle>
                  <CardDescription>Manage your existing team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTeamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{member.type}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Campaigns</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {campaign.assignedUsers} members • {campaign.completedTasks}/{campaign.totalTasks} tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Deadline: {campaign.deadline}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <TaskAssignment />
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <PerformanceMarking />
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance Management</h2>
              <AttendanceVerification />
            </div>
          </div>
        )}
      </div>
    </ManagerMainLayout>
  );
}


export default function ManagerDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManagerDashboardContent />
    </Suspense>
  );
}
