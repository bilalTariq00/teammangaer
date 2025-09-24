"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserMainLayout from "@/components/layout/UserMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { 
  User, 
  Phone, 
  Shield, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Building, 
  DollarSign, 
  Award,
  Clock,
  FileText,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";

export default function UserPersonalInfoPage() {
  const { user } = useAuth();
  const { isAttendanceMarkedToday } = useAttendance();
  const router = useRouter();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Check if attendance is marked for today
  useEffect(() => {
    if (user && (user.role === 'worker' || user.role === 'user')) {
      const attendanceMarked = isAttendanceMarkedToday(user.id);
      if (!attendanceMarked) {
        setShowAttendanceModal(true);
      }
    }
  }, [user, isAttendanceMarkedToday]);

  if (!user) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </UserMainLayout>
    );
  }

  // Show attendance modal if attendance is not marked for today
  if (showAttendanceModal) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Mark Your Attendance</CardTitle>
              <CardDescription className="text-gray-600">
                You must mark your attendance before accessing personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Please mark your attendance for today to continue.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/user-attendance')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAttendanceModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personal Information</h1>
            <p className="text-muted-foreground">
              View your personal information and contact details
            </p>
          </div>
        </div>

        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Details
            </CardTitle>
            <CardDescription>
              Your basic information managed by HR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="name"
                    value={user.name || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>

              {/* Email - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    value={user.email || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>

              {/* Date of Birth - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="dob"
                    value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>

              {/* Position - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="position"
                    value={user.position || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Your personal contact details and emergency contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={user?.contactNumber || "Not provided"}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Your primary contact number
                </p>
              </div>

              {/* Emergency Number */}
              <div className="space-y-2">
                <Label htmlFor="emergencyNumber">Emergency Contact</Label>
                <Input
                  id="emergencyNumber"
                  type="tel"
                  value={user?.emergencyNumber || "Not provided"}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Emergency contact number for urgent situations
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* HR-Managed Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address & Contact Details
            </CardTitle>
            <CardDescription>
              Your address and contact information managed by HR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="address"
                    value={user.address || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="phoneNumber"
                    value={user.phoneNumber || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
            <CardDescription>
              Emergency contact information managed by HR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="emergencyContact"
                    value={user.emergencyContact || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="emergencyPhone"
                    value={user.emergencyPhone || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Employment Information
            </CardTitle>
            <CardDescription>
              Your employment details managed by HR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="department"
                    value={user.department || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="joinDate"
                    value={user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Information
            </CardTitle>
            <CardDescription>
              Your financial details managed by HR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="salary"
                    value={user.salary ? `$${user.salary.toLocaleString()}` : "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bankAccount"
                    value={user.bankAccount || "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="benefits"
                  value={user.benefits || "Not provided"}
                  disabled
                  className="bg-muted"
                />
                <span className="text-xs text-muted-foreground">HR managed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance Information
            </CardTitle>
            <CardDescription>
              Your performance metrics managed by HR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="performance">Performance Score</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="performance"
                    value={user.performance ? `${user.performance}%` : "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="attendance"
                    value={user.attendance ? `${user.attendance}%` : "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastReview">Last Review</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="lastReview"
                    value={user.lastReview ? new Date(user.lastReview).toLocaleDateString() : "Not provided"}
                    disabled
                    className="bg-muted"
                  />
                  <span className="text-xs text-muted-foreground">HR managed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Information
            </CardTitle>
            <CardDescription>
              Additional details managed by HR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">HR Notes</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="notes"
                  value={user.notes || "No notes available"}
                  disabled
                  className="bg-muted"
                />
                <span className="text-xs text-muted-foreground">HR managed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Shield className="h-5 w-5" />
              Information Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-600">
              <p>• Your name and email address cannot be changed for security reasons</p>
              <p>• Only you can update your contact and emergency numbers</p>
              <p>• All HR-managed information is read-only and can only be updated by HR</p>
              <p>• All information is securely stored and encrypted</p>
              <p>• Contact HR if you need to update any HR-managed information</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserMainLayout>
  );
}
