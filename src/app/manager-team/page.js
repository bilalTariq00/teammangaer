"use client";

import { useState } from "react";
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
  Filter, 
  Plus, 
  Eye, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

// Mock data for manager's team
const mockTeamMembers = [
  {
    id: 1,
    name: "Muhammad Shahood",
    email: "muhammad@joyapps.net",
    role: "Permanent",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    performance: 92,
    tasksCompleted: 45,
    totalTasks: 50,
    avatar: null,
    skills: ["Click Quality", "Form Analysis", "Bot Detection"],
    currentCampaign: "Summer Sale Campaign"
  },
  {
    id: 2,
    name: "Hasan Abbas",
    email: "hasan@joyapps.net",
    role: "Permanent",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "2024-01-20",
    performance: 88,
    tasksCompleted: 32,
    totalTasks: 40,
    avatar: null,
    skills: ["User Experience", "Quality Control", "Data Analysis"],
    currentCampaign: "Holiday Special"
  },
  {
    id: 3,
    name: "Adnan Amir",
    email: "adnan@joyapps.net",
    role: "Trainee",
    status: "active",
    joinDate: "2024-01-05",
    lastActive: "2024-01-19",
    performance: 85,
    tasksCompleted: 28,
    totalTasks: 35,
    avatar: null,
    skills: ["Click Patterns", "Form Validation"],
    currentCampaign: "Black Friday"
  },
  {
    id: 4,
    name: "Waleed Bin Shakeel",
    email: "waleed@joyapps.net",
    role: "Trainee",
    status: "inactive",
    joinDate: "2024-01-01",
    lastActive: "2024-01-15",
    performance: 78,
    tasksCompleted: 15,
    totalTasks: 25,
    avatar: null,
    skills: ["Bot Detection", "Quality Metrics"],
    currentCampaign: "New Year Sale"
  }
];

export default function ManagerTeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || member.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      busy: "bg-yellow-100 text-yellow-800"
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getRoleBadge = (role) => {
    const variants = {
      permanent: "bg-blue-100 text-blue-800",
      trainee: "bg-purple-100 text-purple-800"
    };
    return variants[role.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-600";
    if (performance >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <ManagerMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Team</h1>
            <p className="text-muted-foreground">Manage and monitor your team members&apos; performance</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTeamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockTeamMembers.filter(m => m.status === "active").length} active
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
                {mockTeamMembers.filter(m => m.role === "Permanent").length}
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
                {mockTeamMembers.filter(m => m.role === "Trainee").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Learning and training
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockTeamMembers.reduce((sum, m) => sum + m.performance, 0) / mockTeamMembers.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Team average score
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
                    placeholder="Search by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="trainee">Trainee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {filteredMembers.length} member(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Tasks Progress</TableHead>
                    <TableHead>Current Campaign</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
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
                            <div className="flex gap-1 mt-1">
                              {member.skills.slice(0, 2).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {member.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadge(member.role)}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(member.status)}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(member.tasksCompleted / member.totalTasks) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {member.tasksCompleted}/{member.totalTasks}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{member.currentCampaign}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(member.lastActive).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Team Activity</CardTitle>
            <CardDescription>Latest updates from your team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Muhammad Shahood</span> completed task &quot;Review Click Quality - Campaign A&quot;
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>HA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Hasan Abbas</span> started working on &quot;Audit Form Submissions&quot;
                  </p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Adnan Amir</span> submitted quality report for &quot;Black Friday&quot; campaign
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <Badge variant="secondary">Report</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerMainLayout>
  );
}
