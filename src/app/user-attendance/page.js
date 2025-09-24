"use client"

import { useState, useEffect } from "react"
import UserMainLayout from "@/components/layout/UserMainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, User, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAttendance } from "@/contexts/AttendanceContext"
import { toast } from "sonner"

export default function AttendancePage() {
  const { user } = useAuth()
  const { markAttendance, isAttendanceMarkedToday } = useAttendance()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMarking, setIsMarking] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Check if attendance is already marked
  const attendanceMarked = user ? isAttendanceMarkedToday(user.id) : false

  const handleMarkAttendance = async () => {
    if (!user) return

    setIsMarking(true)

    try {
      const now = new Date()
      const timeString = now.toTimeString().slice(0, 5) // HH:MM format

      markAttendance(user.id, user, {
        checkIn: timeString,
        checkOut: null,
        hours: 0,
        notes: `Attendance marked at ${now.toLocaleString()}`,
        status: "present",
      })

      toast.success("Attendance marked successfully!")
      setShowDashboard(true)
    } catch (error) {
      toast.error("Failed to mark attendance")
      console.error("Error marking attendance:", error)
    } finally {
      setIsMarking(false)
    }
  }

  if (!user) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Please Log In</h2>
            <p className="text-muted-foreground">You need to be logged in to mark attendance.</p>
          </div>
        </div>
      </UserMainLayout>
    )
  }

  if (showDashboard || attendanceMarked) {
    return (
      <UserMainLayout>
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

          {/* Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Todays Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Present</div>
                <p className="text-xs text-muted-foreground">Marked at {currentTime.toLocaleTimeString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentTime.toLocaleTimeString()}</div>
                <p className="text-xs text-muted-foreground">{currentTime.toLocaleDateString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employee Info</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.name}</div>
                <p className="text-xs text-muted-foreground">
                  {user.role} • {user.workerType}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Dashboard Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Todays Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Attendance Status:</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Present
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Check-in Time:</span>
                  <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Date:</span>
                  <span className="text-sm">{currentTime.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UserMainLayout>
    )
  }

  return (
    <UserMainLayout>
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
              {user.role} • {user.workerType}
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
    </UserMainLayout>
  )
}
