"use client";

import { useState, useEffect, useCallback } from "react";
import HRMainLayout from "@/components/layout/HRMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Search,
  UserCheck,
  Shield,
  TrendingUp,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useAttendance } from "@/hooks/useAttendance";
import { toast } from "sonner";

// Generate mock previous month data
function generateMockPreviousMonthData() {
  const data = [];
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Skip weekends for mock data
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    data.push({
      date: date.toISOString().split('T')[0],
      day: day,
      dayName: dayName,
      status: Math.random() > 0.1 ? "present" : "absent", // 90% present
      checkIn: Math.random() > 0.1 ? "09:00" : null,
    });
  }
  
  return data;
}

export default function HRAttendancePage() {
  const { user } = useAuth();
  const { users: contextUsers } = useUsers();
  const { 
    attendance, 
    isLoading: attendanceLoading, 
    markAttendance, 
    getAttendanceStatus, 
    checkout, 
    checkin,
    getAttendanceRecords,
    verifyAttendance,
    getAttendanceStats,
    isAttendanceMarkedToday 
  } = useAttendance();
  
  // State for filters and data
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previousMonthData] = useState(generateMockPreviousMonthData());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load attendance data
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          // Get attendance records for the selected date
          const records = await getAttendanceRecords(selectedDate);
          setAttendanceData(records || []);
        } catch (error) {
          console.error('Error loading attendance data:', error);
          toast.error('Failed to load attendance data');
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadAttendanceData();
  }, [user, selectedDate]);

  // Check if attendance is already marked
  const attendanceMarked = user ? isAttendanceMarkedToday(user.id) : false;

  const handleMarkAttendance = async () => {
    if (!user) return;

    setIsMarking(true);

    try {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:MM format

      await markAttendance(timeString, null, `Attendance marked at ${now.toLocaleString()}`);
      
      // Reload attendance data
      const records = await getAttendanceRecords(selectedDate);
      setAttendanceData(records || []);

      toast.success("Attendance marked successfully!");
      setShowDashboard(true);
    } catch (error) {
      toast.error("Failed to mark attendance");
      console.error("Error marking attendance:", error);
    } finally {
      setIsMarking(false);
    }
  };

  if (!user) {
    return (
      <HRMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Please Log In</h2>
            <p className="text-muted-foreground">You need to be logged in to mark attendance.</p>
          </div>
        </div>
      </HRMainLayout>
    );
  }

  if (showDashboard || attendanceMarked) {
    const presentDays = previousMonthData.filter((day) => day.status === "present").length;
    const absentDays = previousMonthData.filter((day) => day.status === "absent").length;
    const totalWorkingDays = previousMonthData.length;
    const attendancePercentage = Math.round((presentDays / totalWorkingDays) * 100);

    return (
      <HRMainLayout>
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Attendance Marked Successfully!
              </CardTitle>
              <CardDescription className="text-green-600">Your attendance has been recorded for today.</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Present</div>
                <p className="text-xs text-muted-foreground">Marked at {currentTime.toLocaleTimeString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{attendancePercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  {presentDays} of {totalWorkingDays} days present
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Calendar className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">5 Days</div>
                <p className="text-xs text-muted-foreground">Current attendance streak</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Previous Month Summary
              </CardTitle>
              <CardDescription>
                {previousMonthData[0] &&
                  new Date(previousMonthData[0].date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}{" "}
                attendance record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{presentDays}</div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{absentDays}</div>
                    <div className="text-xs text-muted-foreground">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{attendancePercentage}%</div>
                    <div className="text-xs text-muted-foreground">Attendance</div>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {previousMonthData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">
                          {day.dayName}, {day.day}
                        </div>
                        <Badge
                          variant={day.status === "present" ? "default" : "destructive"}
                          className={day.status === "present" ? "bg-green-100 text-green-700 border-green-200" : ""}
                        >
                          {day.status === "present" ? "Present" : "Absent"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{day.checkIn || "--:--"}</div>
                    </div>
                  ))}
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <p className="text-muted-foreground mt-2">Click the button below to mark your attendance for today</p>
        </div>

        {/* Main Attendance Card */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <User className="h-6 w-6" />
              {user.name}
            </CardTitle>
            <CardDescription className="text-lg">
              {user.role} • HR Manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Time Display */}
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Current Time</span>
              </div>
              <div className="text-4xl font-bold">{currentTime.toLocaleTimeString()}</div>
              <div className="text-lg text-muted-foreground mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Mark Attendance Button */}
            <Button onClick={handleMarkAttendance} disabled={isMarking} size="lg" className="w-full text-lg py-6">
              {isMarking ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Marking Attendance...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Mark Attendance
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              Your attendance will be automatically recorded with the current time
            </p>
          </CardContent>
        </Card>
      </div>
    </HRMainLayout>
  );
}