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

// Mock data for worker details - includes all users from users page
const workerData = {
  1: {
    id: 1,
    name: "Muhammad Shahood",
    email: "Shahood1@joyapps.net",
    workerId: "#1",
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
  2: {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@joyapps.net",
    workerId: "#2",
    type: "Permanent Viewer",
    status: "Active",
    totalClicks: 45,
    success: 38,
    formFills: 0,
    badClicks: 7,
    failedSubmissions: 7,
    duplicates: 0,
    networkRTC: 1
  },
  3: {
    id: 3,
    name: "Emma Wilson",
    email: "emma.wilson@joyapps.net",
    workerId: "#3",
    type: "Permanent Viewer",
    status: "Active",
    totalClicks: 92,
    success: 78,
    formFills: 0,
    badClicks: 14,
    failedSubmissions: 14,
    duplicates: 0,
    networkRTC: 0
  },
  4: {
    id: 4,
    name: "Hasan Abbas",
    email: "hasan.abbas@joyapps.net",
    workerId: "#4",
    type: "Permanent Clicker",
    status: "Active",
    totalClicks: 156,
    success: 142,
    formFills: 28,
    badClicks: 14,
    failedSubmissions: 14,
    duplicates: 0,
    networkRTC: 0
  },
  5: {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@joyapps.net",
    workerId: "#5",
    type: "Permanent Clicker",
    status: "Active",
    totalClicks: 134,
    success: 118,
    formFills: 32,
    badClicks: 16,
    failedSubmissions: 16,
    duplicates: 0,
    networkRTC: 0
  },
  6: {
    id: 6,
    name: "James Brown",
    email: "james.brown@joyapps.net",
    workerId: "#6",
    type: "Permanent Clicker",
    status: "Active",
    totalClicks: 142,
    success: 125,
    formFills: 25,
    badClicks: 17,
    failedSubmissions: 17,
    duplicates: 0,
    networkRTC: 0
  },
  7: {
    id: 7,
    name: "Lisa Thompson",
    email: "lisa.thompson@joyapps.net",
    workerId: "#7",
    type: "Trainee Viewer",
    status: "Active",
    totalClicks: 28,
    success: 22,
    formFills: 0,
    badClicks: 6,
    failedSubmissions: 6,
    duplicates: 0,
    networkRTC: 0
  },
  8: {
    id: 8,
    name: "Abid",
    email: "abid1@joyapps.net",
    workerId: "#8",
    type: "Trainee Clicker",
    status: "Active",
    totalClicks: 45,
    success: 38,
    formFills: 28,
    badClicks: 7,
    failedSubmissions: 7,
    duplicates: 0,
    networkRTC: 0
  },
  9: {
    id: 9,
    name: "Mike Chen",
    email: "mike.chen@joyapps.net",
    workerId: "#9",
    type: "Trainee Clicker",
    status: "Active",
    totalClicks: 32,
    success: 26,
    formFills: 18,
    badClicks: 6,
    failedSubmissions: 6,
    duplicates: 0,
    networkRTC: 0
  },
  10: {
    id: 10,
    name: "David Kim",
    email: "david.kim@joyapps.net",
    workerId: "#10",
    type: "Trainee Clicker",
    status: "Active",
    totalClicks: 38,
    success: 31,
    formFills: 15,
    badClicks: 7,
    failedSubmissions: 7,
    duplicates: 0,
    networkRTC: 0
  }
};

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

  // Different data patterns for different workers
  const workerChartData = {
    1: [ // Hasan Abbas - Permanent Clicker
      { date: "2025-09-10", clicks: 15, success: 12, formFills: 8, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 8, success: 6, formFills: 4, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 12, success: 10, formFills: 6, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-13", clicks: 6, success: 5, formFills: 3, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 10, success: 8, formFills: 5, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 7, success: 6, formFills: 4, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 9, success: 7, formFills: 5, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 }
    ],
    2: [ // Muhammad Shahood - Permanent Viewer
      { date: "2025-09-10", clicks: 25, success: 20, formFills: 0, badClicks: 5, failedSubmissions: 5, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 18, success: 15, formFills: 0, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 22, success: 18, formFills: 0, badClicks: 4, failedSubmissions: 4, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-13", clicks: 16, success: 13, formFills: 0, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 20, success: 16, formFills: 0, badClicks: 4, failedSubmissions: 4, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 14, success: 11, formFills: 0, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 19, success: 15, formFills: 0, badClicks: 4, failedSubmissions: 4, duplicates: 0, networkRTC: 0 }
    ],
    3: [ // Abid - Trainee Clicker
      { date: "2025-09-10", clicks: 8, success: 6, formFills: 4, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-11", clicks: 5, success: 4, formFills: 3, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 6, success: 5, formFills: 3, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-13", clicks: 3, success: 2, formFills: 2, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 4, success: 3, formFills: 2, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 2, success: 1, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 3, success: 2, formFills: 2, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 }
    ],
    4: [ // Sarah Johnson - Permanent Viewer
      { date: "2025-09-10", clicks: 12, success: 10, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 8, success: 6, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 10, success: 8, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-13", clicks: 6, success: 5, formFills: 0, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 9, success: 7, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 5, success: 4, formFills: 0, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 7, success: 6, formFills: 0, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 }
    ],
    5: [ // Mike Chen - Trainee Clicker
      { date: "2025-09-10", clicks: 4, success: 3, formFills: 2, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 3, success: 2, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 2, success: 2, formFills: 1, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-13", clicks: 1, success: 1, formFills: 1, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 3, success: 2, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 2, success: 1, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 1, success: 1, formFills: 1, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 }
    ],
    6: [ // Alex Rodriguez - Permanent Clicker
      { date: "2025-09-10", clicks: 12, success: 10, formFills: 3, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 8, success: 7, formFills: 2, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 10, success: 8, formFills: 2, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-13", clicks: 6, success: 5, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 9, success: 7, formFills: 2, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 7, success: 6, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 8, success: 6, formFills: 2, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 }
    ],
    7: [ // Emma Wilson - Permanent Viewer
      { date: "2025-09-10", clicks: 18, success: 15, formFills: 0, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 12, success: 10, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-12", clicks: 15, success: 12, formFills: 0, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-13", clicks: 10, success: 8, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 14, success: 11, formFills: 0, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-15", clicks: 9, success: 7, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 11, success: 9, formFills: 0, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 0 }
    ],
    8: [ // David Kim - Trainee Clicker
      { date: "2025-09-10", clicks: 5, success: 4, formFills: 2, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 3, success: 2, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 4, success: 3, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-13", clicks: 2, success: 1, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 3, success: 2, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 1, success: 1, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 2, success: 1, formFills: 1, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 }
    ],
    9: [ // Lisa Thompson - Trainee Viewer
      { date: "2025-09-10", clicks: 3, success: 2, formFills: 0, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 2, success: 2, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-12", clicks: 1, success: 1, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-13", clicks: 2, success: 1, formFills: 0, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-14", clicks: 1, success: 1, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 2, success: 1, formFills: 0, badClicks: 1, failedSubmissions: 1, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-16", clicks: 1, success: 1, formFills: 0, badClicks: 0, failedSubmissions: 0, duplicates: 0, networkRTC: 0 }
    ],
    10: [ // James Brown - Permanent Clicker
      { date: "2025-09-10", clicks: 25, success: 22, formFills: 5, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-11", clicks: 18, success: 15, formFills: 4, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-12", clicks: 22, success: 19, formFills: 4, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-13", clicks: 16, success: 13, formFills: 3, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-14", clicks: 20, success: 17, formFills: 4, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 },
      { date: "2025-09-15", clicks: 14, success: 12, formFills: 3, badClicks: 2, failedSubmissions: 2, duplicates: 0, networkRTC: 1 },
      { date: "2025-09-16", clicks: 17, success: 14, formFills: 3, badClicks: 3, failedSubmissions: 3, duplicates: 0, networkRTC: 0 }
    ]
  };

  return workerChartData[workerId] || baseData;
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

  const workerTaskData = {
    1: [ // Hasan Abbas - Permanent Clicker
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
  },
  {
        id: 2,
    ip: "10.0.0.50",
    device: "Desktop",
    region: "US Texas",
    allowed: true,
    reason: "",
    submission: "Success",
    deltaTime: "1m 45s",
    redirectLogged: "15:45:30",
    submissionTime: "2025-09-12"
      },
      {
        id: 3,
        ip: "172.16.0.25",
        device: "iPhone",
        region: "US Florida",
        allowed: false,
        reason: "distance_not_close:1200.5km",
        submission: "",
        deltaTime: "",
        redirectLogged: "16:20:10",
        submissionTime: "2025-09-12"
      }
    ],
    2: [ // Muhammad Shahood - Permanent Viewer
      {
        id: 1,
        ip: "192.168.1.101",
        device: "Android",
        region: "US New York",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "1m 30s",
        redirectLogged: "10:15:20",
        submissionTime: "2025-09-12"
      },
      {
        id: 2,
        ip: "10.0.0.51",
        device: "Desktop",
        region: "US California",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "2m 10s",
        redirectLogged: "11:30:45",
        submissionTime: "2025-09-12"
      }
    ],
    3: [ // Abid - Trainee Clicker
      {
        id: 1,
        ip: "192.168.1.102",
        device: "Android",
        region: "US Texas",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "3m 20s",
        redirectLogged: "09:45:30",
        submissionTime: "2025-09-12"
      },
      {
        id: 2,
        ip: "10.0.0.52",
        device: "iPhone",
        region: "US Florida",
        allowed: false,
        reason: "distance_not_close:800.2km",
        submission: "",
        deltaTime: "",
        redirectLogged: "10:20:15",
        submissionTime: "2025-09-12"
      }
    ],
    4: [ // Sarah Johnson - Permanent Viewer
      {
        id: 1,
        ip: "192.168.1.103",
        device: "Desktop",
        region: "US Washington",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "1m 50s",
        redirectLogged: "13:15:20",
        submissionTime: "2025-09-12"
      }
    ],
    5: [ // Mike Chen - Trainee Clicker
      {
        id: 1,
        ip: "192.168.1.104",
        device: "Android",
        region: "US Oregon",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "4m 10s",
        redirectLogged: "08:30:45",
        submissionTime: "2025-09-12"
      },
      {
        id: 2,
        ip: "10.0.0.53",
        device: "iPhone",
        region: "US Nevada",
        allowed: false,
        reason: "distance_not_close:1500.8km",
        submission: "",
        deltaTime: "",
        redirectLogged: "09:10:30",
        submissionTime: "2025-09-12"
      }
    ],
    6: [ // Alex Rodriguez - Permanent Clicker
      {
        id: 1,
        ip: "192.168.1.105",
        device: "Desktop",
        region: "US Colorado",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "2m 30s",
        redirectLogged: "11:15:20",
        submissionTime: "2025-09-12"
      },
      {
        id: 2,
        ip: "10.0.0.54",
        device: "Android",
        region: "US Arizona",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "1m 45s",
        redirectLogged: "12:30:15",
        submissionTime: "2025-09-12"
      },
      {
        id: 3,
        ip: "172.16.0.26",
        device: "iPhone",
        region: "US Utah",
        allowed: false,
        reason: "distance_not_close:900.3km",
        submission: "",
        deltaTime: "",
        redirectLogged: "13:45:30",
        submissionTime: "2025-09-12"
      }
    ],
    7: [ // Emma Wilson - Permanent Viewer
      {
        id: 1,
        ip: "192.168.1.106",
        device: "Desktop",
        region: "US Washington",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "1m 20s",
        redirectLogged: "14:20:10",
        submissionTime: "2025-09-12"
      },
      {
        id: 2,
        ip: "10.0.0.55",
        device: "Android",
        region: "US Oregon",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "2m 15s",
        redirectLogged: "15:35:25",
        submissionTime: "2025-09-12"
      }
    ],
    8: [ // David Kim - Trainee Clicker
      {
        id: 1,
        ip: "192.168.1.107",
        device: "Android",
        region: "US Nevada",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "3m 45s",
        redirectLogged: "09:15:30",
        submissionTime: "2025-09-12"
      },
      {
        id: 2,
        ip: "10.0.0.56",
        device: "iPhone",
        region: "US Idaho",
        allowed: false,
        reason: "distance_not_close:1200.7km",
        submission: "",
        deltaTime: "",
        redirectLogged: "10:25:45",
        submissionTime: "2025-09-12"
      }
    ],
    9: [ // Lisa Thompson - Trainee Viewer
      {
        id: 1,
        ip: "192.168.1.108",
        device: "Desktop",
        region: "US Montana",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "2m 10s",
        redirectLogged: "16:40:20",
        submissionTime: "2025-09-12"
      }
    ],
    10: [ // James Brown - Permanent Clicker
      {
        id: 1,
        ip: "192.168.1.109",
        device: "Desktop",
        region: "US California",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "1m 30s",
        redirectLogged: "08:45:15",
        submissionTime: "2025-09-12"
      },
      {
        id: 2,
        ip: "10.0.0.57",
        device: "Android",
        region: "US Texas",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "2m 45s",
        redirectLogged: "09:55:30",
        submissionTime: "2025-09-12"
      },
      {
        id: 3,
        ip: "172.16.0.27",
        device: "iPhone",
        region: "US Florida",
        allowed: false,
        reason: "distance_not_close:2000.5km",
        submission: "",
        deltaTime: "",
        redirectLogged: "10:15:45",
        submissionTime: "2025-09-12"
      },
      {
        id: 4,
        ip: "192.168.1.110",
        device: "Desktop",
        region: "US New York",
        allowed: true,
        reason: "",
        submission: "Success",
        deltaTime: "1m 55s",
        redirectLogged: "11:30:20",
        submissionTime: "2025-09-12"
      }
    ]
  };

  return workerTaskData[workerId] || baseTaskData;
};

const quickDateRanges = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  // "Last 14 Days",
  "Last 30 Days",
  // "Last 60 Days",
  // "Last 90 Days",
  // "This Month",
  // "Last Month",
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
  const chartData = getChartData(parseInt(workerId), worker?.type);
  const taskData = getTaskData(parseInt(workerId));

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
