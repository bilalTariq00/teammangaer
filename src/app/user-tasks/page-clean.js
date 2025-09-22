"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserMainLayout from "@/components/layout/UserMainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, AlertCircle, Upload, ExternalLink, Copy, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import RichTextDisplay from "@/components/RichTextDisplay";
import EnhancedTaskFlow from "@/components/tasks/EnhancedTaskFlow";

// Mock data for user tasks - IP and Session instructions
const userTaskInstructions = {
  ipInstructions: {
    proxyAddress: "proxy.smartproxy.net:3120:smart-m17mx1sjlcfe_area-US_life-15_session-pcf62219dd7a75fe8",
    exitIP: "2603:6081:7ef0:9d50:ecad:411:6bbf:81a9",
    location: "United States (US), North Carolina / Wilson",
    isp: "Charter Communications Inc",
    as: "AS11426 Charter Communications Inc",
    spamScore: "",
    oneTimeLink: "https://tasker.joyapps.net/I/Z-X33H4jbJ?m=MTk3ODV8NDI8MTc1ODA1MDU2NQiAKg_pHCLZvsaP9z8IScY6FLIMKjACy3qWwjt-ygsW",
    expiresIn: "09:56"
  },
  sessionInstructions: {
    profileCreationLink: "https://docs.google.com/spreadsheets/d/1Y1kM[redacted]Jck/edit?gid[redacted]4878",
    leadsPageLink: "https://docs.google.com/spreadsheets/d/1O[redacted]WFQ7ez[redacted]Y4UghuiWk/edit?usp=sharing",
    userAgentsLink: "https://docs.google.com/spreadsheets/[redacted]cBk8_ILLj3m-_K-Hm8kfs/edit?usp=drivesdk",
    howToAddUserAgentsLink: "https://example.com/how-to-add-user-agents",
    targetProfiles: 100,
    iosProfiles: 60,
    androidProfiles: 20,
    windowsMacProfiles: 20
  }
};

// Mock task content with images (this would come from the admin-created tasks)
const mockTaskContent = `**How to Add User Agents To Ads Power:** https://youtu.be/mfbiD0Gjhl8

• **If you are working on Android, use Android User Agents, If you are using iOS, use iPhone User Agents**

Please open or copy paste this link in your browser to get the list of user agents you'll be using for iOS and Android profiles.
https://docs.google.com/spreadsheets/d/1xoKRqP0e3wW_iTWU-nqG1PcBk8_ILLj3m-_K-Hm8kfs/edit?usp=drivesdk

• **Among the 200 target, you'll work on 120 iOS profiles, 40 Android profiles and 40 windows/mac profiles.**

**Steps for Ads Power:**
• You'll choose the iOS or Android and copy the user agent from the sheet and paste it in ads power.
• Check your profile settings and click on OK to create a profile.
• Copy the tracking link from above and open Ads Power and paste that link.
• It will do some checks and take you to a Facebook Page. If you are working on Android and iOS and using the User Agents, you won't see any pop-up, but if you do, close it, click **I couldn't complete**, click Others and write "Facebook Popup error." You'll need to click on the **Learn More** button, if you don't see it, scroll down and it will be visible.
• Continue your work like normal.

**Important Notes:**
• Make sure to follow the exact steps shown in the images below
• Pay attention to the highlighted areas in the screenshots
• If you encounter any issues, refer to the troubleshooting guide

**Screenshots:**
![Step 1](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkcyBQb3dlciBTZXR1cCBTdGVwIDE8L3RleHQ+Cjwvc3ZnPg==)

![Step 2](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkcyBQb3dlciBTZXR1cCBTdGVwIDI8L3RleHQ+Cjwvc3ZnPg==)

![Step 3](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkcyBQb3dlciBTZXR1cCBTdGVwIDM8L3RleHQ+Cjwvc3ZnPg==)`;

export default function UserTasksPage() {
  const { user } = useAuth();
  const { isAttendanceMarkedToday } = useAttendance();
  const router = useRouter();
  
  const [taskStatus, setTaskStatus] = useState("not-started");
  const [completionReason, setCompletionReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkClosed, setLinkClosed] = useState(false);

  // Check if attendance is marked for today
  useEffect(() => {
    if (user && (user.role === 'worker' || user.role === 'user')) {
      const attendanceMarked = isAttendanceMarkedToday(user.id);
      if (!attendanceMarked) {
        router.push('/user-dashboard');
      }
    }
  }, [user, isAttendanceMarkedToday, router]);

  const handleTaskSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Task submitted:", {
      taskStatus,
      completionReason,
      additionalDetails,
      pageCount,
      linkClosed
    });
    
    setIsSubmitting(false);
    
    // Reset form
    setTaskStatus("not-started");
    setCompletionReason("");
    setAdditionalDetails("");
    setPageCount("");
    setLinkClosed(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userTaskInstructions.ipInstructions.oneTimeLink);
    // You could add a toast notification here
  };

  if (!user) {
    return (
      <UserMainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
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
            <h1 className="text-3xl font-bold tracking-tight">Enhanced Task System</h1>
            <p className="text-muted-foreground">
              Complete your assigned tasks with detailed tracking
            </p>
          </div>
        </div>

        {/* Enhanced Task Flow */}
        <EnhancedTaskFlow />
      </div>
    </UserMainLayout>
  );
}
