"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ManagerMainLayout from "@/components/layout/ManagerMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, User, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { ManagerWorkflowProvider } from "@/contexts/ManagerWorkflowContext";
import { toast } from "sonner";

// Mock data for previous month attendance
const generateMockPreviousMonthData = () => {
  const mockData = []
  const currentDate = new Date()
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  const daysInPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

  for (let day = 1; day <= daysInPreviousMonth; day++) {
    const date = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), day)
    const dayOfWeek = date.getDay()

    // Skip weekends for work attendance
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    // Random attendance with 85% present rate
    const isPresent = Math.random() > 0.15

    mockData.push({
      date: date.toISOString().split("T")[0],
      day: date.getDate(),
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      status: isPresent ? "present" : "absent",
      checkIn: isPresent
        ? `${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, "0")}`
        : null,
    })
  }

  return mockData.reverse() // Show most recent first
}

function ManagerAttendancePageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { markAttendance, isAttendanceMarkedToday } = useAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMarking, setIsMarking] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [previousMonthData] = useState(generateMockPreviousMonthData());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if attendance is already marked
  const attendanceMarked = user ? isAttendanceMarkedToday(user.id) : false;

  const handleMarkAttendance = async () => {
    if (!user) return;

    setIsMarking(true);

    try {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:MM format

      markAttendance(user.id, user, {
        checkIn: timeString,
        checkOut: null,
        hours: 0,
        notes: `Attendance marked at ${now.toLocaleString()}`,
        status: "present",
      });

      toast.success("Attendance marked successfully!");
      
      // Redirect to manager dashboard after a short delay
      setTimeout(() => {
        router.push('/manager-dashboard');
      }, 1500);
    } catch (error) {
      toast.error("Failed to mark attendance");
      console.error("Error marking attendance:", error);
    } finally {
      setIsMarking(false);
    }
  };

  if (!user) {
    return (
      <ManagerMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Please Log In</h2>
            <p className="text-muted-foreground">You need to be logged in to mark attendance.</p>
          </div>
        </div>
      </ManagerMainLayout>
    );
  }

  if (showDashboard || attendanceMarked) {
    const presentDays = previousMonthData.filter((day) => day.status === "present").length;
    const absentDays = previousMonthData.filter((day) => day.status === "absent").length;
    const totalWorkingDays = previousMonthData.length;
    const attendancePercentage = Math.round((presentDays / totalWorkingDays) * 100);

  return (
    <ManagerMainLayout>
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
      </ManagerMainLayout>
    );
  }

  return (
    <ManagerMainLayout>
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
              {user.role} • Manager
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
    </ManagerMainLayout>
  );
}

export default function ManagerAttendancePage() {
  return <ManagerAttendancePageContent />;
}
