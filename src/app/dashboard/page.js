"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MousePointer, 
  CheckCircle, 
  Target,
  BarChart3,
  Activity,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";


// Mock data for dashboard
const mockCampaigns = [
  { id: 1, name: "Summer Sale Campaign", status: "active", budget: 50000, spent: 32500, clicks: 15420, views: 23450, conversionRate: 12.5 },
  { id: 2, name: "Black Friday Blitz", status: "active", budget: 75000, spent: 68000, clicks: 28450, views: 45600, conversionRate: 18.2 },
  { id: 3, name: "Holiday Special", status: "paused", budget: 40000, spent: 15000, clicks: 8500, views: 12000, conversionRate: 8.7 },
  { id: 4, name: "New Year Launch", status: "active", budget: 60000, spent: 42000, clicks: 19800, views: 28900, conversionRate: 15.3 },
  { id: 5, name: "Spring Collection", status: "completed", budget: 35000, spent: 35000, clicks: 12500, views: 18700, conversionRate: 10.8 }
];

const mockWorkers = [
  { id: 1, name: "Muhammad Shahood", email: "Shahood1@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 139, success: 123, formFills: 0, failed: 19 },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 45, success: 38, formFills: 0, failed: 7 },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 92, success: 78, formFills: 0, failed: 14 },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 156, success: 142, formFills: 28, failed: 14 },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 134, success: 118, formFills: 32, failed: 16 },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "Permanent Worker", status: "Active", totalClicks: 142, success: 125, formFills: 25, failed: 17 },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 28, success: 22, formFills: 0, failed: 6 },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 45, success: 38, formFills: 28, failed: 7 },
  { id: 9, name: "Mike Chen", email: "mike.chen@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 32, success: 26, formFills: 18, failed: 6 },
  { id: 10, name: "David Kim", email: "david.kim@joyapps.net", type: "Trainee Worker", status: "Active", totalClicks: 38, success: 31, formFills: 15, failed: 7 }
];

// Mock recent activity data
const mockRecentActivity = [
  { id: 1, user: "Muhammad Shahood", action: "logged in", type: "login", timestamp: "2 minutes ago", lockCount: null },
  { id: 2, user: "Sarah Johnson", action: "account locked", type: "lock", timestamp: "15 minutes ago", lockCount: 1 },
  { id: 3, user: "Emma Wilson", action: "logged in", type: "login", timestamp: "1 hour ago", lockCount: null },
  { id: 4, user: "Hasan Abbas", action: "account locked", type: "lock", timestamp: "2 hours ago", lockCount: 3 },
  { id: 5, user: "Alex Rodriguez", action: "logged in", type: "login", timestamp: "3 hours ago", lockCount: null },
  { id: 6, user: "James Brown", action: "account locked", type: "lock", timestamp: "4 hours ago", lockCount: 2 },
  { id: 7, user: "Lisa Thompson", action: "logged in", type: "login", timestamp: "5 hours ago", lockCount: null },
  { id: 8, user: "Abid", action: "account locked", type: "lock", timestamp: "6 hours ago", lockCount: 1 },
  { id: 9, user: "Mike Chen", action: "logged in", type: "login", timestamp: "7 hours ago", lockCount: null },
  { id: 10, user: "David Kim", action: "account locked", type: "lock", timestamp: "8 hours ago", lockCount: 4 },
  { id: 11, user: "Muhammad Shahood", action: "logged in", type: "login", timestamp: "9 hours ago", lockCount: null },
  { id: 12, user: "Sarah Johnson", action: "account locked", type: "lock", timestamp: "10 hours ago", lockCount: 2 },
  { id: 13, user: "Emma Wilson", action: "logged in", type: "login", timestamp: "11 hours ago", lockCount: null },
  { id: 14, user: "Hasan Abbas", action: "account locked", type: "lock", timestamp: "12 hours ago", lockCount: 5 },
  { id: 15, user: "Alex Rodriguez", action: "logged in", type: "login", timestamp: "13 hours ago", lockCount: null },
  { id: 16, user: "James Brown", action: "account locked", type: "lock", timestamp: "14 hours ago", lockCount: 3 },
  { id: 17, user: "Lisa Thompson", action: "logged in", type: "login", timestamp: "15 hours ago", lockCount: null },
  { id: 18, user: "Abid", action: "account locked", type: "lock", timestamp: "16 hours ago", lockCount: 2 },
  { id: 19, user: "Mike Chen", action: "logged in", type: "login", timestamp: "17 hours ago", lockCount: null },
  { id: 20, user: "David Kim", action: "account locked", type: "lock", timestamp: "18 hours ago", lockCount: 6 }
];

export default function DashboardPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate metrics
  const totalCampaigns = mockCampaigns.length;
  const activeCampaigns = mockCampaigns.filter(c => c.status === "active").length;
  const totalWorkers = mockWorkers.length;
  const permanentWorkers = mockWorkers.filter(w => w.type.includes("Permanent Worker")).length;
  const traineeWorkers = mockWorkers.filter(w => w.type.includes("Trainee Worker")).length;
  
  const totalClicks = mockWorkers.reduce((sum, worker) => sum + worker.totalClicks, 0);
  const totalSuccess = mockWorkers.reduce((sum, worker) => sum + worker.success, 0);
  const totalCampaignClicks = mockCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalCampaignViews = mockCampaigns.reduce((sum, campaign) => sum + campaign.views, 0);
  
  const successRate = totalClicks > 0 ? ((totalSuccess / totalClicks) * 100).toFixed(1) : 0;

  // Pagination calculations
  const totalPages = Math.ceil(mockRecentActivity.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivity = mockRecentActivity.slice(startIndex, endIndex);

  const handleCampaignClick = () => {
    router.push(`/campaigns`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive overview of your platform performance</p>
          </div>
        </div>


        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Campaigns */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCampaignClick()}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{activeCampaigns} active</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Workers */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/users')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 font-medium">{permanentWorkers} permanent workers</span> • <span className="text-purple-600 font-medium">{traineeWorkers} trainee workers</span>
              </p>
            </CardContent>
          </Card>

          {/* Session */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Session</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(totalClicks * 0.2).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 font-medium">Active sessions</span>
              </p>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(totalClicks * 0.3).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 font-medium">Search queries</span>
              </p>
            </CardContent>
          </Card>

          {/* Clicks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{successRate}% success rate</span>
              </p>
            </CardContent>
          </Card>
        </div>
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            <CardDescription>User login events and account lock events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {/* Scrollable activity list */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {currentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'login' 
                          ? 'bg-green-100' 
                          : activity.lockCount && activity.lockCount > 3 
                            ? 'bg-red-100' 
                            : 'bg-orange-100'
                      }`}>
                        {activity.type === 'login' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : activity.lockCount && activity.lockCount > 3 ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        )}
                    </div>
                      <div>
                        <p className="font-medium">
                          {activity.user} {activity.action}
                          {activity.lockCount && ` (${activity.lockCount}${activity.lockCount === 1 ? 'st' : activity.lockCount === 2 ? 'nd' : activity.lockCount === 3 ? 'rd' : 'th'} time)`}
                        </p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                    </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        activity.type === 'login' 
                          ? 'text-green-600' 
                          : activity.lockCount && activity.lockCount > 3 
                            ? 'text-red-600' 
                            : 'text-orange-600'
                      }`}>
                        {activity.type === 'login' ? 'Login' : `Account Locked`}
                      </p>
                    </div>
                  </div>
                ))}
                  </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, mockRecentActivity.length)} of {mockRecentActivity.length} activities
          </div>
                <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
              >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
              </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button 
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
              </Button>
                    ))}
                  </div>
                  
              <Button 
                variant="outline" 
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
              >
                    Next
                    <ChevronRight className="w-4 h-4" />
              </Button>
                </div>
              </div>
                  </div>
                </CardContent>
              </Card>
        </div>
      </MainLayout>
    </RoleProtectedRoute>
  );
}
