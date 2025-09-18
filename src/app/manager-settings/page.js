"use client";

import { useState } from "react";
import ManagerMainLayout from "@/components/layout/ManagerMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Users,
  Target,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";

export default function ManagerSettingsPage() {
  const [settings, setSettings] = useState({
    // Profile Settings
    name: "Sarah Manager",
    email: "manager@joyapps.com",
    role: "Manager",
    department: "Quality Control",
    
    // Notification Settings
    emailNotifications: true,
    teamUpdates: true,
    performanceAlerts: true,
    weeklyReports: true,
    dailyDigest: false,
    
    // Team Management Settings
    teamSize: 4,
    maxTeamSize: 10,
    autoAssignTasks: true,
    taskDistribution: "balanced",
    performanceThreshold: 80,
    
    // Quality Control Settings
    qualityStandards: "high",
    reviewFrequency: "daily",
    escalationLevel: "medium",
    reportingLevel: "detailed",
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 60,
    passwordChangeRequired: false,
    teamAccessLevel: "full",
    
    // Display Settings
    theme: "light",
    itemsPerPage: 25,
    showAdvancedOptions: true,
    dashboardLayout: "standard"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Muhammad Shahood", email: "muhammad@joyapps.net", role: "Permanent", status: "active" },
    { id: 2, name: "Hasan Abbas", email: "hasan@joyapps.net", role: "Permanent", status: "active" },
    { id: 3, name: "Adnan Amir", email: "adnan@joyapps.net", role: "Trainee", status: "active" },
    { id: 4, name: "Waleed Bin Shakeel", email: "waleed@joyapps.net", role: "Trainee", status: "inactive" }
  ]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving settings:", settings);
    // Show success message
  };

  const handleRemoveTeamMember = (memberId) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800"
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <ManagerMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your manager account and team preferences</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Manage your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => handleSettingChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={settings.role}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={settings.department}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management
            </CardTitle>
            <CardDescription>Manage your team members and team settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Team Size</Label>
                <Input
                  type="number"
                  value={settings.teamSize}
                  onChange={(e) => handleSettingChange("teamSize", parseInt(e.target.value))}
                  min="1"
                  max={settings.maxTeamSize}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Team Size</Label>
                <Input
                  type="number"
                  value={settings.maxTeamSize}
                  onChange={(e) => handleSettingChange("maxTeamSize", parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Task Distribution</Label>
                <Select 
                  value={settings.taskDistribution} 
                  onValueChange={(value) => handleSettingChange("taskDistribution", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="skill-based">Skill-based</SelectItem>
                    <SelectItem value="workload">Workload-based</SelectItem>
                    <SelectItem value="manual">Manual Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Performance Threshold (%)</Label>
                <Input
                  type="number"
                  value={settings.performanceThreshold}
                  onChange={(e) => handleSettingChange("performanceThreshold", parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Assign Tasks</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign new tasks to team members
                </p>
              </div>
              <Switch
                checked={settings.autoAssignTasks}
                onCheckedChange={(checked) => handleSettingChange("autoAssignTasks", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your current team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {member.role}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${getStatusBadge(member.status)}`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveTeamMember(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Team Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about team member activities and updates
                </p>
              </div>
              <Switch
                checked={settings.teamUpdates}
                onCheckedChange={(checked) => handleSettingChange("teamUpdates", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Performance Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for team performance issues
                </p>
              </div>
              <Switch
                checked={settings.performanceAlerts}
                onCheckedChange={(checked) => handleSettingChange("performanceAlerts", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly team performance summary reports
                </p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily summary of team activities
                </p>
              </div>
              <Switch
                checked={settings.dailyDigest}
                onCheckedChange={(checked) => handleSettingChange("dailyDigest", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quality Control Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quality Control Settings
            </CardTitle>
            <CardDescription>Configure quality control parameters and standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quality Standards</Label>
                <Select 
                  value={settings.qualityStandards} 
                  onValueChange={(value) => handleSettingChange("qualityStandards", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="strict">Strict</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Review Frequency</Label>
                <Select 
                  value={settings.reviewFrequency} 
                  onValueChange={(value) => handleSettingChange("reviewFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Escalation Level</Label>
                <Select 
                  value={settings.escalationLevel} 
                  onValueChange={(value) => handleSettingChange("escalationLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reporting Level</Label>
                <Select 
                  value={settings.reportingLevel} 
                  onValueChange={(value) => handleSettingChange("reportingLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Select 
                value={settings.sessionTimeout.toString()} 
                onValueChange={(value) => handleSettingChange("sessionTimeout", parseInt(value))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Password Change</Label>
                <p className="text-sm text-muted-foreground">
                  Force password change on next login
                </p>
              </div>
              <Switch
                checked={settings.passwordChangeRequired}
                onCheckedChange={(checked) => handleSettingChange("passwordChangeRequired", checked)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Team Access Level</Label>
              <Select 
                value={settings.teamAccessLevel} 
                onValueChange={(value) => handleSettingChange("teamAccessLevel", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read-only">Read Only</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Display Settings
            </CardTitle>
            <CardDescription>Customize your interface and display preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleSettingChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Items Per Page</Label>
                <Select 
                  value={settings.itemsPerPage.toString()} 
                  onValueChange={(value) => handleSettingChange("itemsPerPage", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dashboard Layout</Label>
                <Select 
                  value={settings.dashboardLayout} 
                  onValueChange={(value) => handleSettingChange("dashboardLayout", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Advanced Options</Label>
                <p className="text-sm text-muted-foreground">
                  Display advanced configuration options in the interface
                </p>
              </div>
              <Switch
                checked={settings.showAdvancedOptions}
                onCheckedChange={(checked) => handleSettingChange("showAdvancedOptions", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-600">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your manager account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerMainLayout>
  );
}
