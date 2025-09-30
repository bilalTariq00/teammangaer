"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CalendarIcon, Search, TrendingUp, Users, MousePointer, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

// Mock chart data - different data for different workers
const getChartData = (workerId, workerType) => {
  const baseData = [
    { date: "2025-09-10", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
    { date: "2025-09-11", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
    { date: "2025-09-12", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
    { date: "2025-09-13", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
    { date: "2025-09-14", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
    { date: "2025-09-15", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
    { date: "2025-09-16", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 }
  ];

  // Generate random data based on worker type
  const isClicker = workerType?.toLowerCase().includes('clicker');
  const isPermanent = workerType?.toLowerCase().includes('permanent');
  
  const baseClicks = isPermanent ? 15 : 8;
  const baseSuccess = isPermanent ? 12 : 6;
  const baseFormFills = isClicker ? (isPermanent ? 5 : 3) : 0;
  
  return baseData.map((item, index) => ({
    ...item,
    clicks: Math.floor(Math.random() * baseClicks) + (isPermanent ? 5 : 2),
    success: Math.floor(Math.random() * baseSuccess) + (isPermanent ? 4 : 2),
    formFills: Math.floor(Math.random() * baseFormFills),
    badClicks: Math.floor(Math.random() * 3) + 1,
    failedSubmissions: Math.floor(Math.random() * 3) + 1,
    duplicates: Math.floor(Math.random() * 2),
    networkRTC: Math.floor(Math.random() * 2)
  }));
};

// Mock task data - different data for different workers
const getTaskData = (workerId) => {
  const baseTaskData = [
    {
      id: 1,
      ip: "192.168.1.100",
      device: "Android",
      region: "US California",
      allowed: true,
      reason: "",
      submission: "Success",
      deltaTime: "2m 15s",
      redirectLogged: "14:30:15",
      submissionTime: "2025-09-12"
    }
  ];

  // Generate random task data
  const devices = ["Android", "iPhone", "Desktop"];
  const regions = ["US California", "US Texas", "US New York", "US Florida", "US Washington"];
  
  const taskCount = Math.floor(Math.random() * 5) + 2;
  const tasks = [];
  
  for (let i = 0; i < taskCount; i++) {
    const allowed = Math.random() > 0.2; // 80% success rate
    tasks.push({
      id: i + 1,
      ip: `192.168.1.${100 + i}`,
      device: devices[Math.floor(Math.random() * devices.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      allowed,
      reason: allowed ? "" : "distance_not_close:1200.5km",
      submission: allowed ? "Success" : "",
      deltaTime: allowed ? `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s` : "",
      redirectLogged: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      submissionTime: "2025-09-12"
    });
  }
  
  return tasks;
};

const quickDateRanges = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "All Time"
];

const chartLines = [
  { key: "clicks", label: "Clicks", color: "#3b82f6", checked: true },
  { key: "success", label: "Success", color: "#10b981", checked: true },
  { key: "formFills", label: "Form fills", color: "#06b6d4", checked: true },
  { key: "badClicks", label: "Bad clicks", color: "#f59e0b", checked: true },
  { key: "failedSubmissions", label: "Failed submissions", color: "#ef4444", checked: true },
  { key: "duplicates", label: "Duplicates", color: "#8b5cf6", checked: true },
  { key: "networkRTC", label: "Network/RTC", color: "#d97706", checked: true }
];

export default function WorkerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params.id;
  
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(new Date("2025-09-10"));
  const [toDate, setToDate] = useState(new Date("2025-09-16"));
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  const [searchIP, setSearchIP] = useState("");
  const [enabledLines, setEnabledLines] = useState(
    chartLines.reduce((acc, line) => ({ ...acc, [line.key]: line.checked }), {})
  );

  // Fetch worker data
  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view worker details");
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/workers/${workerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        
        if (result.success) {
          setWorker(result.data);
        } else {
          setError(result.error || 'Failed to load worker data');
          toast.error(result.error || 'Failed to load worker data');
        }
      } catch (error) {
        console.error("Error loading worker data:", error);
        setError('Failed to load worker data');
        toast.error("Failed to load worker data");
      } finally {
        setLoading(false);
      }
    };

    if (workerId) {
      fetchWorkerData();
    }
  }, [workerId, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading worker data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !worker) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Worker not found</h2>
            <p className="text-gray-600 mt-2">{error || "The requested worker does not exist."}</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const chartData = getChartData(workerId, worker.type);
  const taskData = getTaskData(workerId);

  const handleLineToggle = (key) => {
    setEnabledLines(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredChartData = chartData.map(item => {
    const filtered = { date: item.date };
    chartLines.forEach(line => {
      if (enabledLines[line.key]) {
        filtered[line.key] = item[line.key];
      }
    });
    return filtered;
  });

  const filteredTaskData = taskData.filter(task =>
    !searchIP || task.ip.includes(searchIP)
  );

  return (
    <MainLayout>
      <div className="space-y-6 h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Worker Clicks — {worker.name} {worker.workerId}</h1>
            </div>
          </div>
        </div>

        {/* Worker Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Worker Information</CardTitle>
            <CardDescription>Basic details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">Name</Label>
                <p className="text-lg font-semibold">{worker.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-lg">{worker.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Worker ID</Label>
                <p className="text-lg font-mono">{worker.workerId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Type</Label>
                <p className="text-lg">{worker.type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <p className="text-lg">{worker.status}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Department</Label>
                <p className="text-lg">{worker.department || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Activity overview · {format(fromDate, "yyyy-MM-dd")} — {format(toDate, "yyyy-MM-dd")}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chart Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
              {chartLines.map((line) => (
                <div key={line.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={line.key}
                    checked={enabledLines[line.key]}
                    onCheckedChange={() => handleLineToggle(line.key)}
                  />
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: line.color }}
                    />
                    <label 
                      htmlFor={line.key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {line.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="h-80 w-full min-h-0 bg-white rounded-lg border">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickFormatter={(value) => format(new Date(value), "MM/dd")}
                    axisLine={{ stroke: '#e0e0e0' }}
                    tickLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666' } }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    tickLine={{ stroke: '#e0e0e0' }}
                    domain={[0, 25]}
                    ticks={[0, 5, 10, 15, 20, 25]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  {chartLines.map((line) => (
                    enabledLines[line.key] && (
                      <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={{ r: 4, fill: line.color }}
                        activeDot={{ r: 6, fill: line.color }}
                        connectNulls={false}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{worker.totalClicks}</div>
                <div className="text-sm text-gray-600">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{worker.success}</div>
                <div className="text-sm text-gray-600">Success</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{worker.formFills}</div>
                <div className="text-sm text-gray-600">Form fills</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{worker.badClicks}</div>
                <div className="text-sm text-gray-600">Bad clicks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{worker.failedSubmissions}</div>
                <div className="text-sm text-gray-600">Failed submissions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{worker.duplicates}</div>
                <div className="text-sm text-gray-600">Duplicates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{worker.networkRTC}</div>
                <div className="text-sm text-gray-600">Network/RTC</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter data by date range and IP address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="flex flex-wrap gap-2">
              {quickDateRanges.map((range) => (
                <Button
                  key={range}
                  variant={selectedRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange(range)}
                  className="text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ip-search">Search by IP</Label>
              <Input
                id="ip-search"
                placeholder="Enter IP address"
                value={searchIP}
                onChange={(e) => setSearchIP(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button>Show</Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Changes Per Task Table */}
        <Card className="flex-1 min-h-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Changes per task ({filteredTaskData.length} rows) · {format(fromDate, "yyyy-MM-dd")} → {format(toDate, "yyyy-MM-dd")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[200px] min-w-[200px]">IP</TableHead>
                    <TableHead className="w-[100px] min-w-[100px]">Device</TableHead>
                    <TableHead className="w-[150px] min-w-[150px]">Region</TableHead>
                    <TableHead className="w-[100px] min-w-[100px]">Allowed</TableHead>
                    <TableHead className="w-[200px] min-w-[200px]">Reason</TableHead>
                    <TableHead className="w-[120px] min-w-[120px]">Submission</TableHead>
                    <TableHead className="w-[100px] min-w-[100px]">Δ Time</TableHead>
                    <TableHead className="w-[120px] min-w-[120px]">Redirect logged</TableHead>
                    <TableHead className="w-[120px] min-w-[120px]">Submission time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaskData.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-sm whitespace-nowrap">{task.ip}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{task.device}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{task.region}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          task.allowed 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        )}>
                          {task.allowed ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">{task.reason}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{task.submission}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{task.deltaTime}</TableCell>
                      <TableCell className="text-sm font-mono whitespace-nowrap">{task.redirectLogged}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{task.submissionTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}