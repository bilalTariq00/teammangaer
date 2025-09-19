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

// Mock data for manager's team
const mockTeamMembers = [
  { id: 1, name: "Muhammad Shahood", email: "Shahood1@joyapps.net", type: "Permanent Viewer", status: "Active", totalClicks: 139, goodClicks: 123, badClicks: 16, performance: 88.5 },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "Permanent Viewer", status: "Active", totalClicks: 45, goodClicks: 38, badClicks: 7, performance: 84.4 },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "Permanent Viewer", status: "Active", totalClicks: 92, goodClicks: 78, badClicks: 14, performance: 84.8 },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "Permanent Clicker", status: "Active", totalClicks: 156, goodClicks: 142, badClicks: 14, performance: 91.0 },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "Permanent Clicker", status: "Active", totalClicks: 134, goodClicks: 118, badClicks: 16, performance: 88.1 },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "Permanent Clicker", status: "Active", totalClicks: 142, goodClicks: 125, badClicks: 17, performance: 88.0 },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "Trainee Viewer", status: "Active", totalClicks: 28, goodClicks: 22, badClicks: 6, performance: 78.6 },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "Trainee Clicker", status: "Active", totalClicks: 45, goodClicks: 38, badClicks: 7, performance: 84.4 }
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
  averagePerformance: 86.2,
  topPerformer: "Hasan Abbas",
  recentActivity: 12
};

function ManagerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUsers, setShowEditUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    type: "",
    password: ""
  });
  
  // Dynamic task management
  const [tasks, setTasks] = useState(mockTasks);
  const [taskFilter, setTaskFilter] = useState("all");
  const [taskSearch, setTaskSearch] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    campaign: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    taskType: "General"
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    const action = searchParams.get('action');
    
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("overview");
    }
    
    if (action === 'create-user') {
      setShowCreateUser(true);
      setActiveTab("users");
    } else if (action === 'edit-users') {
      setShowEditUsers(true);
      setActiveTab("users");
    }
  }, [searchParams]);

  // Task management functions
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const addNewTask = (taskData) => {
    const task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      ...taskData,
      status: "Pending"
    };
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate) {
      addNewTask(newTask);
      setNewTask({
        title: "",
        campaign: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
        taskType: "General"
      });
      setShowAddTaskModal(false);
    }
  };

  const openAddTaskModal = () => {
    setNewTask({
      title: "",
      campaign: "E-commerce Campaign Q1",
      assignedTo: "Hasan Abbas",
      priority: "Medium",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      taskType: "General"
    });
    setShowAddTaskModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = taskFilter === "all" || task.status.toLowerCase().replace(" ", "_") === taskFilter;
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(taskSearch.toLowerCase()) ||
                         task.campaign.toLowerCase().includes(taskSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Simulate real-time task updates (in a real app, this would come from WebSocket or polling)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random task status updates
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      if (randomTask && randomTask.status === "Pending" && Math.random() < 0.1) {
        updateTaskStatus(randomTask.id, "In Progress");
      } else if (randomTask && randomTask.status === "In Progress" && Math.random() < 0.15) {
        updateTaskStatus(randomTask.id, "Completed");
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  const handleCreateUser = () => {
    // In a real app, this would make an API call
    console.log("Creating user:", newUser);
    setNewUser({ name: "", email: "", type: "", password: "" });
    setShowCreateUser(false);
    // Refresh the page to clear URL params
    router.push("/manager-dashboard");
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditUsers(true);
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
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Team Size */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTeamStats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{mockTeamStats.activeMembers} active</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Clicks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTeamStats.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">{mockTeamStats.totalGoodClicks} good</span> • 
                    <span className="text-red-600 font-medium ml-1">{mockTeamStats.totalBadClicks} bad</span>
              </p>
            </CardContent>
          </Card>

          {/* Average Performance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockTeamStats.averagePerformance}%</div>
              <p className="text-xs text-muted-foreground">
                Team success rate
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTeamStats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                Tasks completed today
              </p>
            </CardContent>
          </Card>
        </div>

            {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Your best performing team members this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeamMembers
                  .sort((a, b) => b.performance - a.performance)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleMemberClick(member.id)}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{member.performance}%</p>
                        <p className="text-sm text-gray-500">{member.totalClicks} clicks</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>Recent team activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Hasan Abbas completed 15 tasks</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New team member joined</p>
                    <p className="text-xs text-gray-500">Lisa Thompson - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Performance review needed</p>
                    <p className="text-xs text-gray-500">Emma Wilson - 6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team target achieved</p>
                    <p className="text-xs text-gray-500">Daily clicks goal - 8 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        )}

        {/* Team Members Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Team Members</h2>
              <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
                <DialogTrigger asChild>
                  <Button onClick={() => setShowCreateUser(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new team member to your dashboard. You can create all user roles including Viewers, Clickers, and QC.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Role</Label>
                      <Select value={newUser.type} onValueChange={(value) => setNewUser({...newUser, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Permanent Viewer">Permanent Viewer</SelectItem>
                          <SelectItem value="Trainee Viewer">Trainee Viewer</SelectItem>
                          <SelectItem value="Permanent Clicker">Permanent Clicker</SelectItem>
                          <SelectItem value="Trainee Clicker">Trainee Clicker</SelectItem>
                          <SelectItem value="QC">QC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>
                        Create User
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
        </div>

            {/* Team Members Table */}
        <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Name</th>
                        <th className="text-left p-4 font-medium">Email</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Total Clicks</th>
                        <th className="text-left p-4 font-medium">Good Clicks</th>
                        <th className="text-left p-4 font-medium">Bad Clicks</th>
                        <th className="text-left p-4 font-medium">Performance</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTeamMembers.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-medium">{member.name}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{member.email}</td>
                          <td className="p-4">
                            <Badge variant="outline">{member.type}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                          </td>
                          <td className="p-4 font-medium">{member.totalClicks}</td>
                          <td className="p-4 text-green-600 font-medium">{member.goodClicks}</td>
                          <td className="p-4 text-red-600 font-medium">{member.badClicks}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${member.performance}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{member.performance}%</span>
                            </div>
                          </td>
                          <td className="p-4">
              <Button 
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(member)}
                            >
                              <Edit className="h-4 w-4" />
              </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={showEditUsers && editingUser} onOpenChange={(open) => {
              setShowEditUsers(open);
              if (!open) setEditingUser(null);
            }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Update user information. You cannot delete existing users.
                  </DialogDescription>
                </DialogHeader>
                {editingUser && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input
                        id="edit-name"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-type">Role</Label>
                      <Select value={editingUser.type} onValueChange={(value) => setEditingUser({...editingUser, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Permanent Viewer">Permanent Viewer</SelectItem>
                          <SelectItem value="Trainee Viewer">Trainee Viewer</SelectItem>
                          <SelectItem value="Permanent Clicker">Permanent Clicker</SelectItem>
                          <SelectItem value="Trainee Clicker">Trainee Clicker</SelectItem>
                          <SelectItem value="QC">QC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                        setShowEditUsers(false);
                        setEditingUser(null);
                      }}>
                        Cancel
              </Button>
                      <Button onClick={handleUpdateUser}>
                        Update User
              </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Assigned Campaigns</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    </div>
                    <CardDescription>
                      {campaign.assignedUsers} team members assigned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Completed</p>
                          <p className="font-medium">{campaign.completedTasks}/{campaign.totalTasks}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Deadline</p>
                          <p className="font-medium">{new Date(campaign.deadline).toLocaleDateString()}</p>
                        </div>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Assigned Tasks</h2>
              <Button 
                onClick={openAddTaskModal}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task List */}
              <Card>
                <CardHeader>
                  <CardTitle>Task List</CardTitle>
                  <CardDescription>All tasks assigned to your team</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Task Filters */}
                  <div className="mb-4 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search tasks..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={taskFilter} onValueChange={setTaskFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              const newStatus = task.status === "Completed" ? "Pending" : "Completed";
                              updateTaskStatus(task.id, newStatus);
                            }}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                            title={task.status === "Completed" ? "Mark as Pending" : "Mark as Completed"}
                          >
                            {task.status === "Completed" ? (
                              <CheckSquare className="w-5 h-5 text-green-600" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500">{task.campaign} • {task.assignedTo}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
                              {task.taskType && (
                                <Badge variant="outline" className="text-xs">
                                  {task.taskType}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <Select 
                            value={task.status.toLowerCase().replace(" ", "_")} 
                            onValueChange={(value) => updateTaskStatus(task.id, value.replace("_", " "))}
                          >
                            <SelectTrigger className="w-32 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Task Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Statistics</CardTitle>
                  <CardDescription>Overview of task completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {tasks.filter(t => t.status === "Completed").length}
                        </div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {tasks.filter(t => t.status === "In Progress").length}
                        </div>
                        <div className="text-sm text-blue-600">In Progress</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {tasks.filter(t => t.status === "Pending").length}
                      </div>
                      <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{Math.round((tasks.filter(t => t.status === "Completed").length / tasks.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(tasks.filter(t => t.status === "Completed").length / tasks.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
            </div>
          </CardContent>
        </Card>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task and assign it to a team member
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Task Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="taskType">Task Type</Label>
                <Select 
                  value={newTask.taskType} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, taskType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General Task</SelectItem>
                    <SelectItem value="Content Review">Content Review</SelectItem>
                    <SelectItem value="Data Entry">Data Entry</SelectItem>
                    <SelectItem value="Quality Check">Quality Check</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Bug Fix">Bug Fix</SelectItem>
                    <SelectItem value="Feature Development">Feature Development</SelectItem>
                    <SelectItem value="Client Communication">Client Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Task Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description (optional)"
                  rows={3}
                />
              </div>

              {/* Campaign Selection */}
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <Select 
                  value={newTask.campaign} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, campaign: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-commerce Campaign Q1">E-commerce Campaign Q1</SelectItem>
                    <SelectItem value="Social Media Campaign">Social Media Campaign</SelectItem>
                    <SelectItem value="Product Launch Campaign">Product Launch Campaign</SelectItem>
                    <SelectItem value="Holiday Special">Holiday Special</SelectItem>
                    <SelectItem value="Black Friday">Black Friday</SelectItem>
                    <SelectItem value="New Year Sale">New Year Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee Selection */}
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To *</Label>
                <Select 
                  value={newTask.assignedTo} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name} ({member.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Task Type Specific Fields */}
              {newTask.taskType === "Content Review" && (
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product Images">Product Images</SelectItem>
                      <SelectItem value="Product Descriptions">Product Descriptions</SelectItem>
                      <SelectItem value="Marketing Copy">Marketing Copy</SelectItem>
                      <SelectItem value="Social Media Posts">Social Media Posts</SelectItem>
                      <SelectItem value="Email Content">Email Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newTask.taskType === "Quality Check" && (
                <div className="space-y-2">
                  <Label htmlFor="qualityType">Quality Check Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality check type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Click Accuracy">Click Accuracy</SelectItem>
                      <SelectItem value="Form Validation">Form Validation</SelectItem>
                      <SelectItem value="User Experience">User Experience</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newTask.taskType === "Data Entry" && (
                <div className="space-y-2">
                  <Label htmlFor="dataType">Data Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product Information">Product Information</SelectItem>
                      <SelectItem value="Customer Data">Customer Data</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Sales Data">Sales Data</SelectItem>
                      <SelectItem value="User Profiles">User Profiles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAddTaskModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={!newTask.title || !newTask.assignedTo || !newTask.dueDate}>
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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