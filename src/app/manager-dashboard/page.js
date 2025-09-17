"use client";

import { useState } from "react";
import ManagerMainLayout from "@/components/layout/ManagerMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for manager's team
const mockTeamMembers = [
  { id: 1, name: "Muhammad Shahood", email: "Shahood1@joyapps.net", type: "Permanent Viewer", status: "Active", totalClicks: 139, success: 123, performance: 88.5 },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "Permanent Viewer", status: "Active", totalClicks: 45, success: 38, performance: 84.4 },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "Permanent Viewer", status: "Active", totalClicks: 92, success: 78, performance: 84.8 },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "Permanent Clicker", status: "Active", totalClicks: 156, success: 142, performance: 91.0 },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "Permanent Clicker", status: "Active", totalClicks: 134, success: 118, performance: 88.1 },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "Permanent Clicker", status: "Active", totalClicks: 142, success: 125, performance: 88.0 },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "Trainee Viewer", status: "Active", totalClicks: 28, success: 22, performance: 78.6 },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "Trainee Clicker", status: "Active", totalClicks: 45, success: 38, performance: 84.4 }
];

const mockTeamStats = {
  totalMembers: 8,
  activeMembers: 8,
  totalClicks: 781,
  totalSuccess: 584,
  averagePerformance: 86.2,
  topPerformer: "Hasan Abbas",
  recentActivity: 12
};

export default function ManagerDashboard() {
  const router = useRouter();

  const handleMemberClick = (memberId) => {
    router.push(`/worker/${memberId}`);
  };

  const handleViewTeam = () => {
    router.push("/manager-team");
  };

  const handleViewPerformance = () => {
    router.push("/manager-performance");
  };

  return (
    <ManagerMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Dashboard</h1>
            <p className="text-muted-foreground">Overview of your team&apos;s performance and activities</p>
          </div>
        </div>

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
                <span className="text-green-600 font-medium">{mockTeamStats.totalSuccess} successful</span>
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

        {/* Team Performance Overview */}
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={handleViewTeam}
              >
                <Users className="h-6 w-6" />
                <span>View Team Members</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={handleViewPerformance}
              >
                <BarChart3 className="h-6 w-6" />
                <span>Team Performance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push("/manager-settings")}
              >
                <Clock className="h-6 w-6" />
                <span>Schedule Review</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerMainLayout>
  );
}
