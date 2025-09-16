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
import { ArrowLeft, CalendarIcon, Search, TrendingUp, Users, MousePointer, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for worker details
const workerData = {
  1: {
    id: 1,
    name: "Adnan Amir",
    email: "adnan@joyapps.net",
    workerId: "#7",
    type: "Permanent Viewer",
    status: "Active",
    totalClicks: 26,
    success: 21,
    formFills: 18,
    badClicks: 5,
    failedSubmissions: 5,
    duplicates: 0,
    networkRTC: 2
  },
  2: {
    id: 2,
    name: "Waleed Bin Shakeel",
    email: "waleed@joyapps.net",
    workerId: "#8",
    type: "Permanent Viewer",
    status: "Active",
    totalClicks: 139,
    success: 123,
    formFills: 0,
    badClicks: 19,
    failedSubmissions: 19,
    duplicates: 0,
    networkRTC: 0
  },
  3: {
    id: 3,
    name: "Hasan Abbas",
    email: "hasan@joyapps.net",
    workerId: "#9",
    type: "Permanent Clicker",
    status: "Active",
    totalClicks: 89,
    success: 78,
    formFills: 12,
    badClicks: 11,
    failedSubmissions: 11,
    duplicates: 0,
    networkRTC: 0
  }
};

// Mock chart data - matching the reference image pattern
const chartData = [
  { date: "2025-09-10", clicks: 23, success: 21, formFills: 18, badClicks: 5, failedSubmissions: 5, duplicates: 0, networkRTC: 2 },
  { date: "2025-09-11", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
  { date: "2025-09-12", clicks: 3, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
  { date: "2025-09-13", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
  { date: "2025-09-14", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
  { date: "2025-09-15", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
  { date: "2025-09-16", clicks: 0, success: 0, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 }
];

// Mock task data
const taskData = [
  {
    id: 1,
    ip: "2603:7081:2000:447c:44dc:1efe:6fd:fbe6",
    device: "iPhone",
    region: "US New York / Rome",
    allowed: false,
    reason: "distance_not_close:2538.1km",
    submission: "",
    deltaTime: "",
    redirectLogged: "13:25:28",
    submissionTime: "2025-09-12"
  },
  {
    id: 2,
    ip: "192.168.1.100",
    device: "Android",
    region: "US California",
    allowed: true,
    reason: "",
    submission: "Success",
    deltaTime: "2m 15s",
    redirectLogged: "14:30:15",
    submissionTime: "2025-09-12"
  },
  {
    id: 3,
    ip: "10.0.0.50",
    device: "Desktop",
    region: "US Texas",
    allowed: true,
    reason: "",
    submission: "Success",
    deltaTime: "1m 45s",
    redirectLogged: "15:45:30",
    submissionTime: "2025-09-12"
  }
];

const quickDateRanges = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 14 Days",
  "Last 30 Days",
  "Last 60 Days",
  "Last 90 Days",
  "This Month",
  "Last Month",
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
  
  const [fromDate, setFromDate] = useState(new Date("2025-09-10"));
  const [toDate, setToDate] = useState(new Date("2025-09-16"));
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  const [searchIP, setSearchIP] = useState("");
  const [enabledLines, setEnabledLines] = useState(
    chartLines.reduce((acc, line) => ({ ...acc, [line.key]: line.checked }), {})
  );

  const worker = workerData[workerId];

  if (!worker) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Worker not found</h2>
            <p className="text-gray-600 mt-2">The requested worker does not exist.</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
                <div className="text-3xl font-bold text-blue-600 mb-1">26</div>
                <div className="text-sm text-gray-600">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">21</div>
                <div className="text-sm text-gray-600">Success</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
                <div className="text-sm text-gray-600">Form fills</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
                <div className="text-sm text-gray-600">Bad clicks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">5</div>
                <div className="text-sm text-gray-600">Failed submissions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-600">Duplicates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
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
