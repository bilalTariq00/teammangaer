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
  Square,
  CheckCircle2,
  XCircle,
  UserCheck,
  Save
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/hooks/useAttendance";
import { ManagerWorkflowProvider, useManagerWorkflow } from "@/contexts/ManagerWorkflowContext";
import AttendanceVerification from "@/components/AttendanceVerification";
import PerformanceMarking from "@/components/PerformanceMarking";
import TaskAssignment from "@/components/tasks/TaskAssignment";
import { toast } from "sonner";

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
  averagePerformance: 86.2,
  topPerformer: "Hasan Abbas",
  recentActivity: 12
};

function ManagerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { users } = useUsers();
  const { 
    attendance, 
    isLoading: attendanceLoading, 
    getAttendanceStatus,
    getAttendanceRecords, 
    verifyAttendance, 
    getAttendanceStats 
  } = useAttendance();
  const { verifiedUsers, clearVerificationData, refreshVerificationData, updateTrigger } = useManagerWorkflow();
  const today = new Date().toISOString().split('T')[0];
  
  // State for real data
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    notMarked: 0
  });
  
  // Function to fetch team members from backend
  const fetchTeamMembers = async () => {
    if (!user?.assignedUsers || user.assignedUsers.length === 0) {
      setTeamMembers([]);
      return;
    }

    setIsLoadingTeam(true);
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        setIsLoadingTeam(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use the new manager team API endpoint
      const response = await fetch('/api/manager/team', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setTeamMembers(result.data);
      } else {
        console.error('Failed to fetch team members:', result.error);
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  // Function to fetch team attendance data
  const fetchTeamAttendance = async (currentTeamMembers = teamMembers) => {
    if (!user?.assignedUsers || user.assignedUsers.length === 0) {
      setTeamAttendance([]);
      return;
    }

    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch attendance records for today
      const response = await fetch(`/api/attendance?date=${today}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        // Filter to only team members' attendance
        const teamAttendanceRecords = result.data.filter(record => 
          record.userId && user.assignedUsers.includes(record.userId._id)
        );
        setTeamAttendance(teamAttendanceRecords);
        
        // Calculate attendance stats
        const stats = {
          total: currentTeamMembers.length,
          present: teamAttendanceRecords.filter(r => r.status === 'marked' || r.status === 'approved').length,
          absent: teamAttendanceRecords.filter(r => r.status === 'absent' || r.status === 'rejected').length,
          pending: teamAttendanceRecords.filter(r => r.status === 'marked').length,
          approved: teamAttendanceRecords.filter(r => r.status === 'approved').length,
          rejected: teamAttendanceRecords.filter(r => r.status === 'rejected').length,
          notMarked: currentTeamMembers.length - teamAttendanceRecords.length
        };
        setAttendanceStats(stats);
      } else {
        console.error('Failed to fetch team attendance:', result.error);
        setTeamAttendance([]);
      }
    } catch (error) {
      console.error('Error fetching team attendance:', error);
      setTeamAttendance([]);
    }
  };


  // Load data when component mounts or user changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (user) {
      fetchTeamMembers();
      // Load manager's own attendance status
      getAttendanceStatus();
    }
  }, [user]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (teamMembers.length > 0) {
      fetchTeamAttendance(teamMembers);
    }
  }, [teamMembers, today]);
  
  // All hooks must be called before any early returns
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
  
  // Force refresh mechanism for real-time updates
  const [refreshKey, setRefreshKey] = useState(0);
  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  // Callback for when attendance verification is complete
  const handleVerificationComplete = (verifiedUserIds) => {
    console.log('Verification complete callback:', verifiedUserIds);
    // Refresh real attendance data
    fetchTeamAttendance(teamMembers);
    // Also refresh verification data from context
    refreshVerificationData();
  };
  
  // Dynamic task management
  const [tasks, setTasks] = useState(mockTasks);
  const [taskFilter, setTaskFilter] = useState("all");
  const [taskSearch, setTaskSearch] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    campaign: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    taskType: "General"
  });

  // Attendance management state
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [attendanceNotes, setAttendanceNotes] = useState("");
  const [isProcessingAttendance, setIsProcessingAttendance] = useState(false);

  // All useEffect hooks must be called before any early returns
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

  useEffect(() => {
    if (user && !attendanceLoading && attendance !== undefined) {
      // Check if attendance is marked using the real attendance data
      // This applies to ALL user roles (manager, HR, QC, user, admin)
      const attendanceMarked = attendance && attendance.hasAttendance && attendance.status !== 'not_marked';
      if (!attendanceMarked) {
        setShowAttendanceModal(true);
      } else {
        // Hide modal if attendance is marked
        setShowAttendanceModal(false);
      }
    }
  }, [user, attendance, attendanceLoading]);

  // markAbsentUsers function removed - now handled by real backend data

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowCreateUser(false);
        setShowEditUsers(false);
        setShowAddTaskModal(false);
        setShowAttendanceModal(false);
        setEditingUser(null);
        setEditingAttendance(null);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Helper function to check if a user is a team member (worker/user, but not manager)
  const isTeamMember = (user) => {
    return (user.role === 'worker' || user.role === 'user') && user.role !== 'manager';
  };

  // Team members are now fetched from backend in fetchTeamMembers()

  // Debug logging
  console.log('ManagerDashboard - verifiedUsers:', verifiedUsers);
  console.log('ManagerDashboard - verifiedUsers length:', verifiedUsers?.length);
  console.log('ManagerDashboard - teamMembers length:', teamMembers?.length);
  
  // Monitor verifiedUsers changes
  useEffect(() => {
    console.log('ManagerDashboard - verifiedUsers changed:', verifiedUsers);
  }, [verifiedUsers]);
  
  // Monitor updateTrigger changes for real-time updates
  useEffect(() => {
    console.log('ManagerDashboard - updateTrigger changed:', updateTrigger);
    console.log('ManagerDashboard - verifiedUsers after trigger:', verifiedUsers);
  }, [updateTrigger, verifiedUsers]);

  // If no user is logged in, show login message
  if (!user) {
    return (
      <ManagerMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to access the manager dashboard.</p>
          </div>
        </div>
      </ManagerMainLayout>
    );
  }


  
  // Attendance data is now fetched from backend in fetchTeamAttendance()

  // Function to verify attendance using real backend API
  const handleVerifyAttendance = async (recordId, action, notes = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/attendance/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: action, // 'approve' or 'reject'
        notes: notes
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Attendance ${action}d successfully`);
        // Refresh attendance data
        fetchTeamAttendance(teamMembers);
      } else {
        toast.error(result.error || `Failed to ${action} attendance`);
      }
    } catch (error) {
      console.error(`Error ${action}ing attendance:`, error);
      toast.error(`Failed to ${action} attendance`);
    }
  };

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

  // Get attendance status for a member
  const getMemberAttendanceStatus = (memberId) => {
    const attendance = teamAttendance.find(a => a.userId._id === memberId);
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
          icon: AlertTriangle
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

  // This function is now handled by the real backend API in the first handleVerifyAttendance function

  // Show loading state while attendance data is being loaded
  if (attendanceLoading) {
    return (
      <ManagerMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attendance data...</p>
          </div>
        </div>
      </ManagerMainLayout>
    );
  }

  // Show attendance modal if attendance is not marked for today
  if (showAttendanceModal) {
    return (
      <ManagerMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Mark Your Attendance</CardTitle>
              <CardDescription className="text-gray-600">
                You must mark your attendance before accessing the manager dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Please mark your attendance for today to continue.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/manager-attendance')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAttendanceModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">Manage your team, campaigns, and tasks</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingTeam && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading team data...</p>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === "overview" && !isLoadingTeam && (
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
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{teamMembers.filter(m => m.status === 'permanent' || m.status === 'active').length} active</span>
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

          {/* Team Attendance */}
          <Card key={`attendance-${verifiedUsers?.length || 0}-${updateTrigger}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Attendance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Debug Info */}
             
              <div className="text-2xl font-bold text-green-600">
                {verifiedUsers ? verifiedUsers.length : 0}/{teamMembers.length}
              </div>
            
              
              {/* Verification Status Indicator */}
              <div className="flex items-center gap-2 text-xs">
                {verifiedUsers && verifiedUsers.length > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">Verification Complete</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-600 font-medium">Verification Required</span>
                  </>
                )}
              </div>
              
              {/* Quick Action Hint */}
              {(!verifiedUsers || verifiedUsers.length === 0) && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                  💡 Select team members who were present today and verify their attendance
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Debug Buttons - Temporary */}
        {/* <div className="flex justify-end gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              refreshVerificationData();
            }}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            🔄 Refresh Data
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              clearVerificationData();
              window.location.reload();
            }}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            🗑️ Clear Data
          </Button>
        </div> */}

        {/* Attendance Verification - Only show if navigation is blocked */}
        <AttendanceVerification onVerificationComplete={handleVerificationComplete} />

        {/* Team Attendance Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today&apos;s Attendance Overview
            </CardTitle>
            <CardDescription>
              Current attendance status and verification status for all team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{attendanceStats.pending}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{attendanceStats.notMarked}</div>
                <div className="text-sm text-gray-700">Not Marked</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{attendanceStats.total}</div>
                <div className="text-sm text-blue-700">Total Team</div>
              </div>
              <div className={`text-center p-4 rounded-lg ${verifiedUsers && verifiedUsers.length > 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
                <div className={`text-2xl font-bold ${verifiedUsers && verifiedUsers.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {verifiedUsers ? verifiedUsers.length : 0}
                </div>
                <div className={`text-sm ${verifiedUsers && verifiedUsers.length > 0 ? 'text-green-700' : 'text-orange-700'}`}>
                  Verified
                </div>
              </div>
            </div>
            
            {/* Verified Team Members Display */}
            {verifiedUsers && verifiedUsers.length > 0 && (
              <div key={`verified-display-${updateTrigger}`} className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Verified Team Members
                </h4>
                <div className="flex flex-wrap gap-2">
                  {verifiedUsers.map(userId => {
                    const user = teamMembers.find(m => m.id === userId);
                    if (!user) return null;
                    return (
                      <Badge 
                        key={userId} 
                        variant="outline" 
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        {user.name}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-xs text-green-600 mt-2">
                  {verifiedUsers.length} team member{verifiedUsers.length !== 1 ? 's' : ''} verified as present today
                </p>
              </div>
            )}
            
            {/* Individual Attendance Status */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Individual Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamMembers.map((member) => {
                  const attendance = teamAttendance.find(a => a.userId._id === member.id);
                  const status = attendance?.status || 'not_marked';
                  
                  const getStatusInfo = (status) => {
                    switch (status) {
                      case 'present':
                      case 'approved':
                        return { color: 'bg-green-100 text-green-800', icon: '✓', label: 'Present' };
                      case 'marked':
                        return { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Pending' };
                      case 'absent':
                      case 'rejected':
                        return { color: 'bg-red-100 text-red-800', icon: '✗', label: 'Absent' };
                      default:
                        return { color: 'bg-gray-100 text-gray-800', icon: '○', label: 'Not Marked' };
                    }
                  };
                  
                  const statusInfo = getStatusInfo(status);
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-bold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.workerType?.replace('-', ' ') || 'Worker'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{statusInfo.icon}</span>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Verification */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Verification
            </CardTitle>
            <CardDescription>
              Verify team member attendance for today - {new Date(today).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
           
              {teamAttendance.filter(a => a.status === 'marked').length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Pending Verification ({teamAttendance.filter(a => a.status === 'marked').length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {teamAttendance
                      .filter(a => a.status === 'marked')
                      .map((attendance) => {
                        const member = teamMembers.find(m => m.id === attendance.userId._id);
                        if (!member) return null;
                        
                        return (
                          <div key={attendance.userId._id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-bold text-sm">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-gray-500">
                                  Marked: {new Date(attendance.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyAttendance(attendance.userId, 'approved')}
                                className="text-xs px-2 py-1 h-6 text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyAttendance(attendance.userId, 'rejected')}
                                className="text-xs px-2 py-1 h-6 text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}


              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  All Team Members Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {teamMembers.map((member) => {
                    const attendance = teamAttendance.find(a => a.userId._id === member.id);
                    const status = getMemberAttendanceStatus(member.id);
                    const IconComponent = status.icon;
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-bold text-sm">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-3 w-3" />
                              <Badge className={status.color}>
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {attendance && attendance.status === 'marked' && (
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

            {/* Quick Stats Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
          {/* Top Performers */}
          {/* <Card>
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
          </Card> */}

          {/* Team Activity */}
          {/* <Card>
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
          </Card> */}
            {/* </div> */}
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
                          <SelectItem value="Permanent Worker">Permanent Worker</SelectItem>
                          <SelectItem value="Trainee Worker">Trainee Worker</SelectItem>
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
                          <SelectItem value="Permanent Worker">Permanent Worker</SelectItem>
                          <SelectItem value="Trainee Worker">Trainee Worker</SelectItem>
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
                          <p className="font-medium">{new Date(campaign.deadline).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
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
          <TaskAssignment />
        )}


        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
              <Button 
                onClick={resetMockData}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Reset Mock Data
              </Button>
            </div>
            <AttendanceVerification />
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <PerformanceMarking />
          </div>
        )}
      </div>
    </ManagerMainLayout>
  );
}


export default function ManagerDashboard() {
  return (
    <ManagerWorkflowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <ManagerDashboardContent />
      </Suspense>
    </ManagerWorkflowProvider>
  );
}