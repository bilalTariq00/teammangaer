"use client";

import { useState, useEffect, Suspense } from "react";
import HRMainLayout from "@/components/layout/HRMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  FileText, 
  TrendingUp, 
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  GraduationCap,
  Briefcase,
  DollarSign,
  BarChart3,
  Download,
  Edit,
  Eye,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  UserCheck
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useUsers } from "@/contexts/UsersContext";

// Mock data for HR dashboard
const mockEmployees = [
  { 
    id: 1, 
    name: "Muhammad Shahood", 
    email: "Shahood1@joyapps.net", 
    role: "Permanent Worker", 
    department: "Operations",
    status: "Active", 
    joinDate: "2023-01-15",
    salary: 45000,
    performance: 92,
    attendance: 98,
    lastReview: "2024-01-15",
    // Extra HR information
    phoneNumber: "+1-555-0101",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: "Aisha Shahood",
    emergencyPhone: "+1-555-0102",
    dateOfBirth: "1990-05-15",
    socialSecurityNumber: "123-45-6789",
    bankAccount: "****1234",
    benefits: "Health, Dental, Vision",
    notes: "Excellent performer, potential for promotion"
  },
  { 
    id: 2, 
    name: "Sarah Johnson", 
    email: "sarah.johnson@joyapps.net", 
    role: "Permanent Worker", 
    department: "Operations",
    status: "Active", 
    joinDate: "2023-03-20",
    salary: 42000,
    performance: 88,
    attendance: 95,
    lastReview: "2024-01-10",
    // Extra HR information
    phoneNumber: "+1-555-0201",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    emergencyContact: "Mike Johnson",
    emergencyPhone: "+1-555-0202",
    dateOfBirth: "1988-12-03",
    socialSecurityNumber: "234-56-7890",
    bankAccount: "****5678",
    benefits: "Health, Dental",
    notes: "Reliable team member"
  },
  { 
    id: 3, 
    name: "Hasan Abbas", 
    email: "hasan.abbas@joyapps.net", 
    role: "Permanent Worker", 
    department: "Operations",
    status: "Active", 
    joinDate: "2022-11-10",
    salary: 48000,
    performance: 94,
    attendance: 99,
    lastReview: "2024-01-20",
    // Extra HR information
    phoneNumber: "+1-555-0301",
    address: "789 Pine St, Chicago, IL 60601",
    emergencyContact: "Fatima Abbas",
    emergencyPhone: "+1-555-0302",
    dateOfBirth: "1985-08-22",
    socialSecurityNumber: "345-67-8901",
    bankAccount: "****9012",
    benefits: "Health, Dental, Vision, 401k",
    notes: "Top performer, team lead material"
  },
  { 
    id: 4, 
    name: "Emma Wilson", 
    email: "emma.wilson@joyapps.net", 
    role: "Manager", 
    department: "Management",
    status: "Active", 
    joinDate: "2022-08-05",
    salary: 65000,
    performance: 89,
    attendance: 97,
    lastReview: "2024-01-18",
    // Extra HR information
    phoneNumber: "+1-555-0401",
    address: "321 Elm St, Boston, MA 02101",
    emergencyContact: "David Wilson",
    emergencyPhone: "+1-555-0402",
    dateOfBirth: "1982-03-10",
    socialSecurityNumber: "456-78-9012",
    bankAccount: "****3456",
    benefits: "Health, Dental, Vision, 401k, Stock Options",
    notes: "Strong leadership skills, manages team of 8"
  },
  { 
    id: 5, 
    name: "John QC", 
    email: "qc@joyapps.com", 
    role: "QC", 
    department: "Quality Assurance",
    status: "Active", 
    joinDate: "2023-02-14",
    salary: 55000,
    performance: 91,
    attendance: 96,
    lastReview: "2024-01-12",
    // Extra HR information
    phoneNumber: "+1-555-0501",
    address: "654 Maple Dr, Seattle, WA 98101",
    emergencyContact: "Jane QC",
    emergencyPhone: "+1-555-0502",
    dateOfBirth: "1987-11-18",
    socialSecurityNumber: "567-89-0123",
    bankAccount: "****7890",
    benefits: "Health, Dental, Vision, 401k",
    notes: "Detail-oriented, quality focused"
  },
  { 
    id: 6, 
    name: "Lisa Thompson", 
    email: "lisa.thompson@joyapps.net", 
    role: "Trainee Worker", 
    department: "Operations",
    status: "Active", 
    joinDate: "2024-01-08",
    salary: 35000,
    performance: 78,
    attendance: 92,
    lastReview: "2024-01-25",
    // Extra HR information
    phoneNumber: "+1-555-0601",
    address: "987 Cedar Ln, Miami, FL 33101",
    emergencyContact: "Robert Thompson",
    emergencyPhone: "+1-555-0602",
    dateOfBirth: "1995-07-25",
    socialSecurityNumber: "678-90-1234",
    bankAccount: "****2345",
    benefits: "Health",
    notes: "New employee, showing good progress"
  }
];

const mockDepartments = [
  { name: "Operations", count: 4, avgSalary: 42500 },
  { name: "Management", count: 1, avgSalary: 65000 },
  { name: "Quality Assurance", count: 1, avgSalary: 55000 }
];

const mockPerformanceData = [
  { month: "Jan", avgPerformance: 88, avgAttendance: 96, newHires: 1, reviews: 3 },
  { month: "Feb", avgPerformance: 89, avgAttendance: 97, newHires: 0, reviews: 2 },
  { month: "Mar", avgPerformance: 91, avgAttendance: 98, newHires: 1, reviews: 4 },
  { month: "Apr", avgPerformance: 90, avgAttendance: 97, newHires: 0, reviews: 2 },
  { month: "May", avgPerformance: 92, avgAttendance: 98, newHires: 1, reviews: 3 },
  { month: "Jun", avgPerformance: 89, avgAttendance: 96, newHires: 0, reviews: 2 }
];

// Calendar events state - this would typically come from a database
const initialEvents = [
  { id: 1, title: "Performance Review - Muhammad Shahood", date: "2024-02-15", type: "review", description: "Annual performance review", attendees: ["Muhammad Shahood", "Emma Wilson"] },
  { id: 2, title: "New Employee Orientation", date: "2024-02-20", type: "training", description: "Orientation for new hires", attendees: ["All new employees"] },
  { id: 3, title: "Team Building Event", date: "2024-02-25", type: "event", description: "Quarterly team building activity", attendees: ["All staff"] },
  { id: 4, title: "Salary Review Meeting", date: "2024-03-01", type: "meeting", description: "Management salary review discussion", attendees: ["Management team"] }
];

function HRDashboardContent() {
  const { user } = useAuth();
  const { isAttendanceMarkedToday } = useAttendance();
  const { users } = useUsers();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateEmployee, setShowCreateEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Check if attendance is marked for today
  useEffect(() => {
    if (user && (user.role === 'hr' || user.role === 'admin')) {
      const attendanceMarked = isAttendanceMarkedToday(user.id);
      
      if (!attendanceMarked) {
        setShowAttendanceModal(true);
      }
    }
  }, [user, isAttendanceMarkedToday]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState(initialEvents);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    salary: "",
    joinDate: "",
    phoneNumber: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    dateOfBirth: "",
    socialSecurityNumber: "",
    bankAccount: "",
    benefits: "",
    notes: ""
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    type: "meeting",
    description: "",
    attendees: ""
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    const action = searchParams.get('action');
    
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("overview");
    }
    
    if (action === 'add-employee') {
      setShowCreateEmployee(true);
      setActiveTab("employees");
    } else if (action === 'edit-employees') {
      setShowEditEmployee(true);
      setActiveTab("employees");
    }
  }, [searchParams]);

  const handleCreateEmployee = () => {
    // In a real app, this would make an API call
    console.log("Creating employee:", newEmployee);
    setNewEmployee({ name: "", email: "", role: "", department: "", salary: "", joinDate: "" });
    setShowCreateEmployee(false);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEditEmployee(true);
  };

  // Calendar event management functions
  const handleCreateEvent = () => {
    const event = {
      id: Date.now(),
      ...newEvent,
      attendees: newEvent.attendees.split(',').map(attendee => attendee.trim()).filter(attendee => attendee)
    };
    setCalendarEvents([...calendarEvents, event]);
    setNewEvent({ title: "", date: "", type: "meeting", description: "", attendees: "" });
    setShowCreateEvent(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date,
      type: event.type,
      description: event.description || "",
      attendees: event.attendees ? event.attendees.join(', ') : ""
    });
    setShowEditEvent(true);
  };

  const handleUpdateEvent = () => {
    const updatedEvent = {
      ...editingEvent,
      ...newEvent,
      attendees: newEvent.attendees.split(',').map(attendee => attendee.trim()).filter(attendee => attendee)
    };
    setCalendarEvents(calendarEvents.map(event => 
      event.id === editingEvent.id ? updatedEvent : event
    ));
    setNewEvent({ title: "", date: "", type: "meeting", description: "", attendees: "" });
    setShowEditEvent(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setCalendarEvents(calendarEvents.filter(event => event.id !== eventId));
  };

  const handleUpdateEmployee = () => {
    // In a real app, this would make an API call
    console.log("Updating employee:", editingEmployee);
    setEditingEmployee(null);
    setShowEditEmployee(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "On Leave": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-600";
    if (performance >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "review": return <Award className="h-4 w-4 text-blue-600" />;
      case "training": return <GraduationCap className="h-4 w-4 text-green-600" />;
      case "event": return <Calendar className="h-4 w-4 text-purple-600" />;
      case "meeting": return <Briefcase className="h-4 w-4 text-orange-600" />;
      default: return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  // Show attendance modal if attendance is not marked for today
  if (showAttendanceModal) {
    return (
      <HRMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Mark Your Attendance</CardTitle>
              <CardDescription className="text-gray-600">
                You must mark your attendance before accessing the HR dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Please mark your attendance for today to continue.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/hr-attendance')}
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
      </HRMainLayout>
    );
  }

  return (
    <HRMainLayout>
      <div className="space-y-6">
        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Employees */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">{users.filter(u => u.locked === "unlocked").length} active</span>
                  </p>
                </CardContent>
              </Card>

              {/* Inactive Employees */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inactive Employees</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {users.filter(u => u.locked === "locked").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Locked accounts
                  </p>
                </CardContent>
              </Card>

              {/* Departments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(users.map(u => {
                      let dept = u.workerType || u.role;
                      return dept === 'manager' ? 'QC' : dept;
                    })).size}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active departments
                  </p>
                </CardContent>
              </Card>

              {/* Total Users by Role */}
            
            </div>

            {/* Department Overview and Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Department Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <CardDescription>Employee distribution by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      // Group users by department/role
                      const departmentGroups = users.reduce((acc, user) => {
                        let dept = user.workerType || user.role || 'Unknown';
                        
                        // Replace 'manager' with 'QC' for display
                        if (dept === 'manager') {
                          dept = 'QC';
                        }
                        
                        if (!acc[dept]) {
                          acc[dept] = { name: dept, count: 0, users: [] };
                        }
                        acc[dept].count++;
                        acc[dept].users.push(user);
                        return acc;
                      }, {});

                      return Object.values(departmentGroups).map((dept, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{dept.name}</p>
                            <p className="text-sm text-gray-500">{dept.count} employees</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              {dept.users.filter(u => u.locked === "unlocked").length}
                            </p>
                            <p className="text-sm text-gray-500">active</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
             
            </div>

          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Employee Management</h2>
              <Dialog open={showCreateEmployee} onOpenChange={setShowCreateEmployee}>
                <DialogTrigger asChild>
                  <Button onClick={() => setShowCreateEmployee(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Add a new employee to the system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Permanent Worker">Permanent Worker</SelectItem>
                              <SelectItem value="Trainee Worker">Trainee Worker</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="QC">QC</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Management">Management</SelectItem>
                              <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                              <SelectItem value="Human Resources">Human Resources</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="salary">Salary</Label>
                          <Input
                            id="salary"
                            type="number"
                            value={newEmployee.salary}
                            onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                            placeholder="Enter salary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="joinDate">Join Date</Label>
                          <Input
                            id="joinDate"
                            type="date"
                            value={newEmployee.joinDate}
                            onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            value={newEmployee.phoneNumber}
                            onChange={(e) => setNewEmployee({...newEmployee, phoneNumber: e.target.value})}
                            placeholder="+1-555-0123"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={newEmployee.dateOfBirth}
                            onChange={(e) => setNewEmployee({...newEmployee, dateOfBirth: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={newEmployee.address}
                          onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                          placeholder="123 Main St, City, State 12345"
                        />
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Emergency Contact</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                          <Input
                            id="emergencyContact"
                            value={newEmployee.emergencyContact}
                            onChange={(e) => setNewEmployee({...newEmployee, emergencyContact: e.target.value})}
                            placeholder="Emergency contact name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                          <Input
                            id="emergencyPhone"
                            value={newEmployee.emergencyPhone}
                            onChange={(e) => setNewEmployee({...newEmployee, emergencyPhone: e.target.value})}
                            placeholder="+1-555-0123"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Financial Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
                          <Input
                            id="socialSecurityNumber"
                            value={newEmployee.socialSecurityNumber}
                            onChange={(e) => setNewEmployee({...newEmployee, socialSecurityNumber: e.target.value})}
                            placeholder="123-45-6789"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bankAccount">Bank Account (Last 4 digits)</Label>
                          <Input
                            id="bankAccount"
                            value={newEmployee.bankAccount}
                            onChange={(e) => setNewEmployee({...newEmployee, bankAccount: e.target.value})}
                            placeholder="****1234"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="benefits">Benefits</Label>
                        <Input
                          id="benefits"
                          value={newEmployee.benefits}
                          onChange={(e) => setNewEmployee({...newEmployee, benefits: e.target.value})}
                          placeholder="Health, Dental, Vision, 401k"
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Additional Information</h3>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                          id="notes"
                          value={newEmployee.notes}
                          onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                          placeholder="Additional notes about the employee"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateEmployee(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateEmployee}>
                        Add Employee
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Employee Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Name</th>
                        <th className="text-left p-4 font-medium">Contact</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Department</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Performance</th>
                        <th className="text-left p-4 font-medium">Salary</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-gray-500">{employee.address}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {employee.phoneNumber}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{employee.role}</Badge>
                          </td>
                          <td className="p-4">{employee.department}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                          </td>
                          <td className="p-4">
                            <span className={`font-medium ${getPerformanceColor(employee.performance)}`}>
                              {employee.performance}%
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">${employee.salary.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{employee.benefits}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEmployee(employee)}
                                title="Edit Employee"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/employee/${employee.id}`)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Employee Dialog */}
            <Dialog open={showEditEmployee && editingEmployee} onOpenChange={(open) => {
              setShowEditEmployee(open);
              if (!open) setEditingEmployee(null);
            }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Employee</DialogTitle>
                  <DialogDescription>
                    Update employee information
                  </DialogDescription>
                </DialogHeader>
                {editingEmployee && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input
                          id="edit-name"
                          value={editingEmployee.name}
                          onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editingEmployee.email}
                          onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-role">Role</Label>
                        <Select value={editingEmployee.role} onValueChange={(value) => setEditingEmployee({...editingEmployee, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Permanent Worker">Permanent Worker</SelectItem>
                            <SelectItem value="Trainee Worker">Trainee Worker</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="QC">QC</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-salary">Salary</Label>
                        <Input
                          id="edit-salary"
                          type="number"
                          value={editingEmployee.salary}
                          onChange={(e) => setEditingEmployee({...editingEmployee, salary: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                        setShowEditEmployee(false);
                        setEditingEmployee(null);
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateEmployee}>
                        Update Employee
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Performance Analytics</h2>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Employees with highest performance scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEmployees
                      .sort((a, b) => b.performance - a.performance)
                      .slice(0, 3)
                      .map((employee, index) => (
                        <div key={employee.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 font-bold text-xs">#{index + 1}</span>
                            </div>
                            <span className="font-medium">{employee.name}</span>
                          </div>
                          <span className="text-green-600 font-medium">{employee.performance}%</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Leaders</CardTitle>
                  <CardDescription>Employees with best attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEmployees
                      .sort((a, b) => b.attendance - a.attendance)
                      .slice(0, 3)
                      .map((employee, index) => (
                        <div key={employee.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-xs">#{index + 1}</span>
                            </div>
                            <span className="font-medium">{employee.name}</span>
                          </div>
                          <span className="text-blue-600 font-medium">{employee.attendance}%</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>Latest performance reviews completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEmployees
                      .sort((a, b) => new Date(b.lastReview) - new Date(a.lastReview))
                      .slice(0, 3)
                      .map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between">
                          <span className="font-medium">{employee.name}</span>
                          <span className="text-sm text-gray-500">{new Date(employee.lastReview).toLocaleDateString()}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">HR Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Employee Directory
                  </CardTitle>
                  <CardDescription>Complete list of all employees</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Generate a comprehensive employee directory with contact information and roles.</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Report
                  </CardTitle>
                  <CardDescription>Detailed performance analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Comprehensive performance metrics and trends for all employees.</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Salary Report
                  </CardTitle>
                  <CardDescription>Compensation and benefits overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Salary distribution, benefits, and compensation analysis.</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Attendance Report
                  </CardTitle>
                  <CardDescription>Attendance and leave tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Detailed attendance records and leave management reports.</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Department Report
                  </CardTitle>
                  <CardDescription>Department-wise employee analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Employee distribution and performance by department.</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Report
                  </CardTitle>
                  <CardDescription>Employee growth and development</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Career progression and development tracking reports.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === "departments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Department Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDepartments.map((dept, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Employees:</span>
                        <span className="font-medium">{dept.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Avg Salary:</span>
                        <span className="font-medium">${dept.avgSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">HR Calendar</h2>
              <Button onClick={() => setShowCreateEvent(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage HR calendar and important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calendarEvents
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        {event.description && (
                          <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            Attendees: {event.attendees.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          title="Delete Event"
                          className="text-red-600 hover:text-red-700"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {calendarEvents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No events scheduled</p>
                      <p className="text-sm">Click &quot;Add Event&quot; to create your first calendar event</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Event Dialog */}
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new calendar event
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-type">Type</Label>
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="review">Performance Review</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="event-description">Description</Label>
                    <Input
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Enter event description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-attendees">Attendees (comma-separated)</Label>
                    <Input
                      id="event-attendees"
                      value={newEvent.attendees}
                      onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                      placeholder="John Doe, Jane Smith, All staff"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent}>
                      Create Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={showEditEvent} onOpenChange={setShowEditEvent}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                  <DialogDescription>
                    Update calendar event details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-event-title">Event Title</Label>
                    <Input
                      id="edit-event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-event-date">Date</Label>
                      <Input
                        id="edit-event-date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-event-type">Type</Label>
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="review">Performance Review</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-event-description">Description</Label>
                    <Input
                      id="edit-event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Enter event description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-event-attendees">Attendees (comma-separated)</Label>
                    <Input
                      id="edit-event-attendees"
                      value={newEvent.attendees}
                      onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                      placeholder="John Doe, Jane Smith, All staff"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowEditEvent(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateEvent}>
                      Update Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </HRMainLayout>
  );
}

export default function HRDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HRDashboardContent />
    </Suspense>
  );
}
