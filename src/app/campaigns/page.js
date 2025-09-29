"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, Target, Plus, MousePointer, Users, TrendingUp, CheckCircle, CalendarIcon, Search, ChevronLeft, ChevronRight, UserPlus, UserMinus, X, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

const quickDateRanges = [
  "Today",
  "Yesterday", 
  "Last 7 Days",
  
  "Last 30 Days",
  
  "All Time"
];

// Mock user data for assignment
const mockUsers = [
  { id: 1, name: "Muhammad Shahood", email: "muhammad.shahood@joyapps.net", type: "permanent", role: "viewer" },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@joyapps.net", type: "permanent", role: "viewer" },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@joyapps.net", type: "permanent", role: "viewer" },
  { id: 4, name: "Hasan Abbas", email: "hasan.abbas@joyapps.net", type: "permanent", role: "clicker" },
  { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@joyapps.net", type: "permanent", role: "clicker" },
  { id: 6, name: "James Brown", email: "james.brown@joyapps.net", type: "permanent", role: "clicker" },
  { id: 7, name: "Lisa Thompson", email: "lisa.thompson@joyapps.net", type: "trainee", role: "viewer" },
  { id: 8, name: "Abid", email: "abid1@joyapps.net", type: "trainee", role: "clicker" },
  { id: 9, name: "Mike Chen", email: "mike.chen@joyapps.net", type: "trainee", role: "clicker" },
  { id: 10, name: "David Kim", email: "david.kim@joyapps.net", type: "trainee", role: "clicker" },
  { id: 101, name: "John Manager", email: "john.manager@joyapps.net", type: "manager", role: "manager" },
  { id: 102, name: "Jane Supervisor", email: "jane.supervisor@joyapps.net", type: "manager", role: "manager" },
  { id: 103, name: "Mike Director", email: "mike.director@joyapps.net", type: "manager", role: "manager" },
  { id: 104, name: "Sarah Lead", email: "sarah.lead@joyapps.net", type: "manager", role: "manager" },
];

// Mock worker data
const permanentWorkers = [
  {
    id: 1,
    name: "Muhammad Shahood",
    email: "Shahood1@joyapps.net",
    clicks: 139,
    success: 123,
    formFills: 0,
    failed: 19,
    avgGapLast5: "9h 44m 34s",
    avgGapAll: "20m 07s",
    avgSubmitDelta: "1m 01s",
    workTime: "3h 03m 11s"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@joyapps.net",
    clicks: 45,
    success: 38,
    formFills: 0,
    failed: 7,
    avgGapLast5: "12h 30m 45s",
    avgGapAll: "2h 15m 30s",
    avgSubmitDelta: "8m 30s",
    workTime: "1h 45m 20s"
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.wilson@joyapps.net",
    clicks: 92,
    success: 78,
    formFills: 0,
    failed: 14,
    avgGapLast5: "9h 20m 15s",
    avgGapAll: "1h 15m 30s",
    avgSubmitDelta: "2m 45s",
    workTime: "11h 30m"
  }
];

const traineeWorkers = [
  {
    id: 4,
    name: "Hasan Abbas",
    email: "hasan.abbas@joyapps.net",
    clicks: 156,
    success: 142,
    formFills: 28,
    failed: 14,
    avgGapLast5: "1h 45m 20s",
    avgGapAll: "1h 20m 45s",
    avgSubmitDelta: "2m 30s",
    workTime: "14h 20m"
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@joyapps.net",
    clicks: 134,
    success: 118,
    formFills: 32,
    failed: 16,
    avgGapLast5: "1h 50m 30s",
    avgGapAll: "1h 25m 15s",
    avgSubmitDelta: "2m 15s",
    workTime: "13h 45m"
  },
  {
    id: 6,
    name: "James Brown",
    email: "james.brown@joyapps.net",
    clicks: 142,
    success: 125,
    formFills: 25,
    failed: 17,
    avgGapLast5: "1h 55m 45s",
    avgGapAll: "1h 30m 20s",
    avgSubmitDelta: "2m 45s",
    workTime: "13h 30m"
  }
];

const additionalWorkers = [
  {
    id: 7,
    name: "Lisa Thompson",
    email: "lisa.thompson@joyapps.net",
    clicks: 28,
    success: 22,
    formFills: 0,
    failed: 6,
    avgGapLast5: "15h 45m 20s",
    avgGapAll: "3h 30m 15s",
    avgSubmitDelta: "4m 30s",
    workTime: "4h 15m"
  }
];

const moreWorkers = [
  {
    id: 8,
    name: "Abid",
    email: "abid1@joyapps.net",
    clicks: 45,
    success: 38,
    formFills: 28,
    failed: 7,
    avgGapLast5: "10h 50m 31s",
    avgGapAll: "1h 52m 32s",
    avgSubmitDelta: "2m 15s",
    workTime: "8h 30m"
  },
  {
    id: 9,
    name: "Mike Chen",
    email: "mike.chen@joyapps.net",
    clicks: 32,
    success: 26,
    formFills: 18,
    failed: 6,
    avgGapLast5: "11h 15m 30s",
    avgGapAll: "2h 30m 45s",
    avgSubmitDelta: "4m 10s",
    workTime: "7h 30m"
  },
  {
    id: 10,
    name: "David Kim",
    email: "david.kim@joyapps.net",
    clicks: 38,
    success: 31,
    formFills: 15,
    failed: 7,
    avgGapLast5: "12h 20m 45s",
    avgGapAll: "2h 45m 30s",
    avgSubmitDelta: "3m 45s",
    workTime: "6h 45m"
  }
];

// Function to get metrics based on date range
const getMetricsForRange = (selectedRange, campaignWorkers) => {
  const rangeMultipliers = {
    "Today": 1,
    "Yesterday": 0.8,
    "Last 7 Days": 1.2,
    "Last 14 Days": 1.5,
    "Last 30 Days": 2,
    "Last 60 Days": 2.5,
    "Last 90 Days": 3,
    "This Month": 1.8,
    "Last Month": 1.6,
    "All Time": 3.5
  };

  const multiplier = rangeMultipliers[selectedRange] || 1;

  // Safely get worker arrays with fallbacks
  const permanentWorkers = campaignWorkers?.permanentWorkers || [];
  const traineeWorkers = campaignWorkers?.traineeWorkers || [];

  // Calculate actual worker counts and metrics from the campaign data
  const permanentWorkersCount = permanentWorkers.length;
  const traineeWorkersCount = traineeWorkers.length;

  // Calculate total clicks for each category - using the actual worker data
  const permanentWorkersClicks = permanentWorkers.reduce((sum, workerId) => {
    const worker = permanentWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.clicks : 0);
  }, 0);
  const permanentWorkersSuccess = permanentWorkers.reduce((sum, workerId) => {
    const worker = permanentWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.success : 0);
  }, 0);
  const permanentWorkersFailed = permanentWorkers.reduce((sum, workerId) => {
    const worker = permanentWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.failed : 0);
  }, 0);
  const permanentWorkersFormFills = permanentWorkers.reduce((sum, workerId) => {
    const worker = permanentWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.formFills : 0);
  }, 0);

  const traineeWorkersClicks = traineeWorkers.reduce((sum, workerId) => {
    const worker = traineeWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.clicks : 0);
  }, 0);
  const traineeWorkersSuccess = traineeWorkers.reduce((sum, workerId) => {
    const worker = traineeWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.success : 0);
  }, 0);
  const traineeWorkersFailed = traineeWorkers.reduce((sum, workerId) => {
    const worker = traineeWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.failed : 0);
  }, 0);
  const traineeWorkersFormFills = traineeWorkers.reduce((sum, workerId) => {
    const worker = traineeWorkers.find(w => w.id === workerId);
    return sum + (worker ? worker.formFills : 0);
  }, 0);

  const permanentMetrics = [
    {
      title: "Workers",
      icon: Users,
      metrics: {
        activeWorkers: permanentWorkersCount,
        totalClicks: Math.floor(permanentWorkersClicks * multiplier),
        goodClicks: Math.floor(permanentWorkersSuccess * multiplier),
        badClicks: Math.floor(permanentWorkersFailed * multiplier),
        formFills: Math.floor(permanentWorkersFormFills * multiplier)
      }
    }
  ];

  const traineeMetrics = [
    {
      title: "Workers",
      icon: Users,
      metrics: {
        activeWorkers: traineeWorkersCount,
        totalClicks: Math.floor(traineeWorkersClicks * multiplier),
        goodClicks: Math.floor(traineeWorkersSuccess * multiplier),
        badClicks: Math.floor(traineeWorkersFailed * multiplier),
        formFills: Math.floor(traineeWorkersFormFills * multiplier)
      }
    }
  ];

  return { permanentMetrics, traineeMetrics };
};

// Mock campaign data
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Sale Campaign",
    description: "Promotional campaign for summer products",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    totalClicks: 15420,
    totalViews: 23450,
    conversionRate: 12.5,
    budget: 50000,
    spent: 32500,
    sessions: 2500,
    searches: 1800,
    clicks: 15420,
    assignedUsers: [1, 2, 4, 101], // User IDs
    workers: {
      permanentWorkers: [1, 2, 3, 4, 5, 6], // Worker IDs
      traineeWorkers: [7, 8, 9, 10]
    },
    createdAt: "2024-05-15",
    updatedAt: "2024-12-19"
  },
  {
    id: 2,
    name: "Black Friday Blitz",
    description: "High-intensity campaign for Black Friday sales",
    status: "active",
    startDate: "2024-11-20",
    endDate: "2024-11-30",
    totalClicks: 28450,
    totalViews: 45600,
    conversionRate: 18.2,
    budget: 75000,
    spent: 68000,
    sessions: 3200,
    searches: 2400,
    clicks: 28450,
    assignedUsers: [3, 5, 6, 102, 103], // User IDs
    workers: {
      permanentWorkers: [1, 2, 4, 5, 6],
      traineeWorkers: [7, 8, 9, 10]
    },
    createdAt: "2024-11-01",
    updatedAt: "2024-12-19"
  },
  {
    id: 3,
    name: "Holiday Special",
    description: "Christmas and New Year promotional campaign",
    status: "paused",
    startDate: "2024-12-01",
    endDate: "2025-01-15",
    totalClicks: 12300,
    totalViews: 18900,
    conversionRate: 15.8,
    budget: 40000,
    spent: 18500,
    sessions: 1500,
    searches: 1200,
    clicks: 12300,
    assignedUsers: [], // No users assigned
    workers: {
      permanentWorkers: [1, 3, 4, 6],
      traineeWorkers: [7, 8, 9, 10]
    },
    createdAt: "2024-11-15",
    updatedAt: "2024-12-19"
  },
  {
    id: 4,
    name: "Product Launch",
    description: "New product introduction campaign",
    status: "completed",
    startDate: "2024-09-01",
    endDate: "2024-10-31",
    totalClicks: 18750,
    totalViews: 31200,
    conversionRate: 14.2,
    sessions: 2200,
    searches: 1600,
    clicks: 18750,
    budget: 60000,
    spent: 60000,
    assignedUsers: [7, 8, 9, 104], // User IDs
    workers: {
      permanentWorkers: [1, 2, 3, 4, 5],
      traineeWorkers: [7, 8, 9, 10]
    },
    createdAt: "2024-08-15",
    updatedAt: "2024-11-01"
  }
];

export default function CampaignsPage() {
  const router = useRouter();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Today");
  const [activeTab, setActiveTab] = useState("permanent-workers");
  const [detailedView, setDetailedView] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState("100");
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state for campaigns table
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 3; // Show 3 campaigns per page
  
  // Assignment dialog state
  const [assignmentDialog, setAssignmentDialog] = useState({
    isOpen: false,
    campaignId: null,
    searchQuery: "",
    userTypeFilter: "all"
  });

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
    setDetailedView(null);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setDetailedView(null);
  };

  const handleCreateCampaign = () => {
    router.push("/create-campaign");
  };

  const handleCardClick = (cardType) => {
    setDetailedView(cardType);
  };

  const handleWorkerClick = (workerId) => {
    router.push(`/worker/${workerId}`);
  };

  const handleShowData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFromDate(new Date());
    setToDate(new Date());
  };

  const handleQuickRange = (range) => {
    setSelectedRange(range);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    switch (range) {
      case "Today":
        setFromDate(today);
        setToDate(today);
        break;
      case "Yesterday":
        setFromDate(yesterday);
        setToDate(yesterday);
        break;
      case "Last 7 Days":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        setFromDate(last7Days);
        setToDate(today);
        break;
      // case "Last 14 Days":
      //   const last14Days = new Date(today);
      //   last14Days.setDate(last14Days.getDate() - 14);
      //   setFromDate(last14Days);
      //   setToDate(today);
      //   break;
      case "Last 30 Days":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        setFromDate(last30Days);
        setToDate(today);
        break;
      // case "Last 60 Days":
      //   const last60Days = new Date(today);
      //   last60Days.setDate(last60Days.getDate() - 60);
      //   setFromDate(last60Days);
      //   setToDate(today);
      //   break;
      // case "Last 90 Days":
      //   const last90Days = new Date(today);
      //   last90Days.setDate(last90Days.getDate() - 90);
      //   setFromDate(last90Days);
      //   setToDate(today);
      //   break;
      // case "This Month":
      //   const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      //   setFromDate(thisMonth);
      //   setToDate(today);
      //   break;
      // case "Last Month":
      //   const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      //   const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      //   setFromDate(lastMonth);
      //   setToDate(lastMonthEnd);
      //   break;
      case "All Time":
        const allTime = new Date(2024, 0, 1);
        setFromDate(allTime);
        setToDate(today);
        break;
      default:
        break;
    }
  };

  // Pagination calculations for campaigns
  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const startIndex = (currentPage - 1) * campaignsPerPage;
  const endIndex = startIndex + campaignsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Assignment functions
  const openAssignmentDialog = (campaignId) => {
    setAssignmentDialog({
      isOpen: true,
      campaignId,
      searchQuery: "",
      userTypeFilter: "all"
    });
  };

  const closeAssignmentDialog = () => {
    setAssignmentDialog({
      isOpen: false,
      campaignId: null,
      searchQuery: "",
      userTypeFilter: "all"
    });
  };

  const handleUserAssignment = (userId, assigned) => {
    const campaignId = assignmentDialog.campaignId;
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => {
        if (campaign.id === campaignId) {
          return {
            ...campaign,
            assignedUsers: assigned
              ? [...campaign.assignedUsers, userId]
              : campaign.assignedUsers.filter(id => id !== userId)
          };
        }
        return campaign;
      })
    );
  };

  const getAssignedUsers = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return [];
    return mockUsers.filter(user => campaign.assignedUsers.includes(user.id));
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(assignmentDialog.searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(assignmentDialog.searchQuery.toLowerCase());
    
    const matchesType = assignmentDialog.userTypeFilter === "all" || 
                       (assignmentDialog.userTypeFilter === "workers" && user.type !== "manager") ||
                       (assignmentDialog.userTypeFilter === "managers" && user.type === "manager");
    
    return matchesSearch && matchesType;
  });

  // Function to calculate filtered campaign data based on date range
  const getFilteredCampaignData = (campaign) => {
    // Get multiplier based on selected range
    const rangeMultipliers = {
      "Today": 0.1,
      "Yesterday": 0.15,
      "Last 7 Days": 0.3,
      // "Last 14 Days": 0.5,
      "Last 30 Days": 0.7,
      // "Last 60 Days": 0.85,
      // "Last 90 Days": 0.95,
      // "This Month": 0.6,
      // "Last Month": 0.4,
      "All Time": 1.0
    };
    
    const multiplier = rangeMultipliers[selectedRange] || 1;
    
    // Calculate filtered metrics
    const filteredTotalClicks = Math.floor(campaign.totalClicks * multiplier);
    const filteredTotalViews = Math.floor(campaign.totalViews * multiplier);
    const filteredSessions = Math.floor((campaign.sessions || 0) * multiplier);
    const filteredSearches = Math.floor((campaign.searches || 0) * multiplier);
    const filteredClicks = Math.floor((campaign.clicks || campaign.totalClicks) * multiplier);
    const totalEngagement = filteredSessions + filteredSearches + filteredClicks;
    const filteredConversionRate = filteredTotalViews > 0 
      ? ((totalEngagement / filteredTotalViews) * 100).toFixed(1)
      : campaign.conversionRate;
    const filteredSpent = Math.floor(campaign.spent * multiplier);
    
    return {
      ...campaign,
      totalClicks: filteredTotalClicks,
      totalViews: filteredTotalViews,
      sessions: filteredSessions,
      searches: filteredSearches,
      clicks: filteredClicks,
      conversionRate: parseFloat(filteredConversionRate),
      spent: filteredSpent
    };
  };

  // Get metrics based on selected range and campaign
  const { permanentMetrics, traineeMetrics } = selectedCampaign && selectedCampaign.workers
    ? getMetricsForRange(selectedRange, selectedCampaign.workers)
    : { permanentMetrics: [], traineeMetrics: [] };

  const getWorkerData = () => {
    if (!selectedCampaign) return [];
    
    // Get all workers from all categories
    const allWorkers = [...permanentWorkers, ...traineeWorkers, ...additionalWorkers, ...moreWorkers];
    
    // Get campaign-specific worker IDs
    const campaignWorkerIds = [
      ...selectedCampaign.workers.permanentWorkers,
      ...selectedCampaign.workers.traineeWorkers
    ];
    
    // Filter workers to only include those assigned to this campaign
    const campaignWorkers = allWorkers.filter(worker => campaignWorkerIds.includes(worker.id));
    
    // If detailed view is active, filter by specific worker type
    if (detailedView) {
      switch (detailedView) {
        case "permanent-workers":
          return campaignWorkers.filter(worker => 
            selectedCampaign.workers.permanentWorkers.includes(worker.id)
          );
        case "trainee-workers":
          return campaignWorkers.filter(worker => 
            selectedCampaign.workers.traineeWorkers.includes(worker.id)
          );
        default:
          return campaignWorkers;
      }
    }
    
    return campaignWorkers;
  };

  const getViewTitle = () => {
    const campaignPrefix = selectedCampaign ? `${selectedCampaign.name} · ` : "";
    switch (detailedView) {
      case "permanent-workers":
        return `${campaignPrefix}Permanent Workers`;
      case "trainee-workers":
        return `${campaignPrefix}Trainee Workers`;
      default:
        return `${campaignPrefix}Workers`;
    }
  };

  const filteredWorkers = getWorkerData().filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If detailed view is active, show the detailed table
  if (detailedView) {
    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Back Button and Title */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailedView(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cards
            </Button>
            <h1 className="text-2xl font-bold">{getViewTitle()}</h1>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
                <SelectItem value="200">200 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-600">
            Showing page 1 of 1 • {filteredWorkers.length} active
          </div>

          {/* Workers Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Form fills</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Avg gap (last 5)</TableHead>
                    <TableHead>Avg gap (all)</TableHead>
                    <TableHead>Avg submit Δ</TableHead>
                    <TableHead>Work time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">
                        <div 
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleWorkerClick(worker.id)}
                        >
                          <div className="font-medium hover:underline">{worker.name}</div>
                          <div className="text-sm text-muted-foreground">{worker.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{worker.clicks}</TableCell>
                      <TableCell className="text-green-600">{worker.success}</TableCell>
                      <TableCell>{worker.formFills}</TableCell>
                      <TableCell className="text-red-600">{worker.failed}</TableCell>
                      <TableCell>{worker.avgGapLast5}</TableCell>
                      <TableCell>{worker.avgGapAll}</TableCell>
                      <TableCell>{worker.avgSubmitDelta}</TableCell>
                      <TableCell>{worker.workTime}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWorkerClick(worker.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing page 1 of 1 • {filteredWorkers.length} active
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                &lt;&lt; Prev
              </Button>
              <Button variant="outline" size="sm" className="bg-black text-white">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next &gt;&gt;
              </Button>
            </div>
          </div>

          {/* Inactive Workers Section */}
          <Card>
            <CardHeader>
              <CardTitle>Inactive workers (no clicks in selected range)</CardTitle>
              <CardDescription>
                {(() => {
                  // Get all workers assigned to this campaign
                  const allWorkers = [...permanentWorkers, ...traineeWorkers, ...additionalWorkers, ...moreWorkers];
                  const campaignWorkerIds = [
                    ...selectedCampaign.workers.permanentWorkers,
                    ...selectedCampaign.workers.traineeWorkers
                  ];
                  const campaignWorkers = allWorkers.filter(worker => campaignWorkerIds.includes(worker.id));
                  
                  // Filter out workers with clicks (active workers)
                  const activeWorkerIds = filteredWorkers.map(w => w.id);
                  const inactiveWorkers = campaignWorkers.filter(worker => !activeWorkerIds.includes(worker.id));
                  
                  return `${inactiveWorkers.length} inactive`;
                })()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    // Get all workers assigned to this campaign
                    const allWorkers = [...permanentWorkers, ...traineeWorkers, ...additionalWorkers, ...moreWorkers];
                    const campaignWorkerIds = [
                      ...selectedCampaign.workers.permanentWorkers,
                      ...selectedCampaign.workers.traineeWorkers
                    ];
                    const campaignWorkers = allWorkers.filter(worker => campaignWorkerIds.includes(worker.id));
                    
                    // Filter out workers with clicks (active workers)
                    const activeWorkerIds = filteredWorkers.map(w => w.id);
                    const inactiveWorkers = campaignWorkers.filter(worker => !activeWorkerIds.includes(worker.id));
                    
                    return inactiveWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">
                          <div 
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => handleWorkerClick(worker.id)}
                          >
                            <div className="font-medium hover:underline">{worker.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{worker.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWorkerClick(worker.id)}
                            className="flex items-center gap-2"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (selectedCampaign) {
    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Back Button and Campaign Title */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToCampaigns}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedCampaign.name}</h1>
              <p className="text-muted-foreground">{selectedCampaign.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Status: <span className="font-medium text-green-600">{selectedCampaign.status}</span></span>
                <span>•</span>
                <span>Workers: <span className="font-medium">
                  {selectedCampaign.workers.permanentWorkers.length + selectedCampaign.workers.traineeWorkers.length}
                </span></span>
                <span>•</span>
                <span>Period: {selectedCampaign.startDate} → {selectedCampaign.endDate}</span>
              </div>
            </div>
          </div>

          {/* Date Range Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Date Range Filters</CardTitle>
              <CardDescription>
                Select a date range to filter your campaign data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row sm:flex-row gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-date">From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "MM/dd/yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to-date">To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "MM/dd/yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Quick Date Range Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickDateRanges.map((range) => (
                  <Button
                    key={range}
                    variant={selectedRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickRange(range)}
                    className={selectedRange === range ? "bg-black text-white" : ""}
                  >
                    {range}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleShowData} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Show"}
                </Button>
                <Button variant="outline" onClick={handleReset}>Reset</Button>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Cards with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger 
                  value="permanent-workers"
                  className={`${
                    activeTab === "permanent-workers" 
                      ? "!bg-black !text-white shadow-md" 
                      : ""
                  }`}
                  style={activeTab === "permanent-workers" ? { backgroundColor: 'black', color: 'white' } : {}}
                >
                  Permanent
                </TabsTrigger>
                <TabsTrigger 
                  value="trainee-workers"
                  className={`${
                    activeTab === "trainee-workers" 
                      ? "!bg-black !text-white shadow-md" 
                      : ""
                  }`}
                  style={activeTab === "trainee-workers" ? { backgroundColor: 'black', color: 'white' } : {}}
                >
                  Trainee
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="permanent-workers" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
                {permanentMetrics.map((item) => {
                  const cardType = "permanent-workers";
                  return (
                    <Card 
                      key={item.title} 
                      className="relative overflow-hidden transition-smooth hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                      onClick={() => handleCardClick(cardType)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Active Workers */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-1">{item.metrics.activeWorkers}</div>
                            <div className="text-sm text-muted-foreground font-medium">Active Workers</div>
                          </div>
                          
                          {/* Total Clicks */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-1">{(item.metrics.totalClicks || 0).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground font-medium">Total Clicks</div>
                          </div>
                          
                          {/* Good Clicks */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">{(item.metrics.goodClicks || 0).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground font-medium">Good Clicks</div>
                          </div>
                          
                          {/* Bad Clicks */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-1">{(item.metrics.badClicks || 0).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground font-medium">Bad Clicks</div>
                          </div>
                          
                          {/* Form Fills - spans full width */}
                          <div className="text-center col-span-2">
                            <div className="text-3xl font-bold text-purple-600 mb-1">{item.metrics.formFills}</div>
                            <div className="text-sm text-muted-foreground font-medium">Form Fills</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-muted-foreground">
                            Range: {format(fromDate, "yyyy-MM-dd")} → {format(toDate, "yyyy-MM-dd")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="trainee-workers" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
                {traineeMetrics.map((item) => {
                  const cardType = "trainee-workers";
                  return (
                    <Card 
                      key={item.title} 
                      className="relative overflow-hidden transition-smooth hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                      onClick={() => handleCardClick(cardType)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Active Workers */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-1">{item.metrics.activeWorkers}</div>
                            <div className="text-sm text-muted-foreground font-medium">Active Workers</div>
                          </div>
                          
                          {/* Total Clicks */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-1">{(item.metrics.totalClicks || 0).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground font-medium">Total Clicks</div>
                          </div>
                          
                          {/* Good Clicks */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">{(item.metrics.goodClicks || 0).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground font-medium">Good Clicks</div>
                          </div>
                          
                          {/* Bad Clicks */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-1">{(item.metrics.badClicks || 0).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground font-medium">Bad Clicks</div>
                          </div>
                          
                          {/* Form Fills - spans full width */}
                          <div className="text-center col-span-2">
                            <div className="text-3xl font-bold text-purple-600 mb-1">{item.metrics.formFills}</div>
                            <div className="text-sm text-muted-foreground font-medium">Form Fills</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-muted-foreground">
                            Range: {format(fromDate, "yyyy-MM-dd")} → {format(toDate, "yyyy-MM-dd")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">Manage your marketing campaigns</p>
          </div>
          <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Date Range Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range Filters</CardTitle>
            <CardDescription>
              Select a date range to filter your campaigns data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-date">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Quick Range</Label>
                <Select value={selectedRange} onValueChange={handleQuickRange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {quickDateRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleShowData}>Show Data</Button>
                <Button variant="outline" onClick={handleReset}>Reset</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Searches</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Assigned Users</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCampaigns.map((campaign) => {
                  const filteredCampaign = getFilteredCampaignData(campaign);
                  const assignedUsers = getAssignedUsers(campaign.id);
                  const hasAssignedUsers = assignedUsers.length > 0;
                  
                  return (
                    <TableRow key={campaign.id} className="hover:bg-muted/50">
                      <TableCell 
                        className="font-medium cursor-pointer" 
                        onClick={() => handleCampaignClick(campaign)}
                      >
                        {filteredCampaign.name}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          filteredCampaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          filteredCampaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {filteredCampaign.status}
                        </span>
                      </TableCell>
                      <TableCell>{(filteredCampaign.sessions || 0).toLocaleString()}</TableCell>
                      <TableCell>{(filteredCampaign.searches || 0).toLocaleString()}</TableCell>
                      <TableCell>{(filteredCampaign.clicks || 0).toLocaleString()}</TableCell>
                      <TableCell>{filteredCampaign.conversionRate}%</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {assignedUsers.length} users
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCampaignClick(campaign)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssignmentDialog(campaign.id);
                            }}
                          >
                            {hasAssignedUsers ? (
                              <>
                                <UserMinus className="h-4 w-4 mr-1" />
                                Manage Users
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-1" />
                                Assign Users
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
          </CardContent>
          <div className="px-6 py-3 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing data for: <span className="font-medium">{selectedRange}</span> 
              ({format(fromDate, "MMM dd")} - {format(toDate, "MMM dd, yyyy")})
            </p>
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, campaigns.length)} of {campaigns.length} campaigns
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

        {/* Assignment Dialog */}
        <Dialog open={assignmentDialog.isOpen} onOpenChange={closeAssignmentDialog}>
          <DialogContent className="!w-[70vw] !max-w-none h-[90vh]">
            <DialogHeader>
              <DialogTitle>Assign Users to Campaign</DialogTitle>
              <DialogDescription>
                Search and select users to assign to this campaign
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* User Type Filter */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Filter by User Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={assignmentDialog.userTypeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAssignmentDialog(prev => ({ ...prev, userTypeFilter: "all" }))}
                  >
                    All Users
                  </Button>
                  <Button
                    variant={assignmentDialog.userTypeFilter === "workers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAssignmentDialog(prev => ({ ...prev, userTypeFilter: "workers" }))}
                  >
                    Workers
                  </Button>
                  <Button
                    variant={assignmentDialog.userTypeFilter === "managers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAssignmentDialog(prev => ({ ...prev, userTypeFilter: "managers" }))}
                  >
                    Managers
                  </Button>
                </div>
              </div>

              {/* Side by Side Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Assigned Users */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Assigned Users</Label>
                  <div className="h-[60vh] overflow-y-auto border rounded-lg p-4 bg-muted/20">
                    {assignmentDialog.campaignId && getAssignedUsers(assignmentDialog.campaignId).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {getAssignedUsers(assignmentDialog.campaignId).map((user) => (
                          <Badge
                            key={user.id}
                            variant="secondary"
                            className="flex items-center gap-2 pr-2 py-2 px-3 text-sm"
                          >
                            <span>
                              {user.type === "manager" ? "👔" : "👷"} {user.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleUserAssignment(user.id, false)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No users assigned yet</p>
                          <p className="text-sm">Select users from the right panel</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - User Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Search and Select Users</Label>
                  <Command className="border rounded-md h-[60vh]">
                    <CommandInput
                      placeholder="Search users by name or email..."
                      value={assignmentDialog.searchQuery}
                      onValueChange={(value) => setAssignmentDialog(prev => ({ ...prev, searchQuery: value }))}
                      className="h-12"
                    />
                    <CommandList className="h-full">
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {filteredUsers.map((user) => {
                          const isAssigned = assignmentDialog.campaignId && 
                            campaigns.find(c => c.id === assignmentDialog.campaignId)?.assignedUsers.includes(user.id);
                          return (
                            <CommandItem
                              key={user.id}
                              onSelect={() => handleUserAssignment(user.id, !isAssigned)}
                              className="flex items-start justify-between p-3"
                            >
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                  {user.type === "manager" ? "👔" : "👷"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm break-words">{user.name}</div>
                                  <div className="text-xs text-muted-foreground break-all">{user.email}</div>
                                  <div className="text-xs text-muted-foreground capitalize break-words">
                                    {user.type} {user.role && `• ${user.role}`}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                {isAssigned ? (
                                  <Badge variant="default" className="text-xs px-2 py-1">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Assigned
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUserAssignment(user.id, true);
                                    }}
                                  >
                                    Assign
                                  </Button>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </MainLayout>
    </RoleProtectedRoute>
  );
}
