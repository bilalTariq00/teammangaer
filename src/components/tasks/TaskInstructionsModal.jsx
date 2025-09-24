"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, FileText, Calendar } from "lucide-react";
import RichTextDisplay from "@/components/RichTextDisplay";

// Dynamic task content based on task type
const getTaskContent = (taskType) => {
  const taskContents = {
    viewer1: `**How to Add User Agents To Ads Power:** https://youtu.be/mrbiD0Gjh10

• **If you are working on Android, use Android User Agents, If you are using iOS, use iPhone User Agents**

Please open or copy paste this link in your browser to get the list of user agents you'll be using for iOS and Android profiles.
https://docs.google.com/spreadsheets/d/cxckcPQe3WW_TWU_nqG1PcBk8_JLLj3m_K_Hmakts/edit?usp=drivesdk

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

**Example Screenshot:**
![Step 1](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkcyBQb3dlciBTZXR1cCBTdGVwIDE8L3RleHQ+Cjwvc3ZnPg==)`,

    viewer2: `**How to Add User Agents To Ads Power:** https://youtu.be/mrbiD0Gjh10

• **If you are working on Android, use Android User Agents, If you are using iOS, use iPhone User Agents**

Please open or copy paste this link in your browser to get the list of user agents you'll be using for iOS and Android profiles.
https://docs.google.com/spreadsheets/d/cxckcPQe3WW_TWU_nqG1PcBk8_JLLj3m_K_Hmakts/edit?usp=drivesdk

• **Among the 150 target, you'll work on 90 iOS profiles, 30 Android profiles and 30 windows/mac profiles.**

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

**Example Screenshot:**
![Step 1](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkcyBQb3dlciBTZXR1cCBTdGVwIDI8L3RleHQ+Cjwvc3ZnPg==)`,

    clicker: `**How to Add User Agents To Ads Power:** https://youtu.be/mrbiD0Gjh10

• **If you are working on Android, use Android User Agents, If you are using iOS, use iPhone User Agents**

Please open or copy paste this link in your browser to get the list of user agents you'll be using for iOS and Android profiles.
https://docs.google.com/spreadsheets/d/cxckcPQe3WW_TWU_nqG1PcBk8_JLLj3m_K_Hmakts/edit?usp=drivesdk

• **Among the 100 target, you'll work on 60 iOS profiles, 20 Android profiles and 20 windows/mac profiles.**

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

**Example Screenshot:**
![Step 1](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkcyBQb3dlciBTZXR1cCBTdGVwIDM8L3RleHQ+Cjwvc3ZnPg==)`
  };

  return taskContents[taskType] || taskContents.viewer1;
};

// Dynamic session content based on task type
const getSessionContent = (taskType) => {
  const sessionContents = {
    viewer1: `**Session Task Instructions**

Make your AdsPower profile using the proxy provided above in the IP blank.

**Data for forms:** https://docs.google.com/spreadsheets/d/1Y1kM[redacted]Jck/edit?gid[redacted]4878

**User agents:** https://docs.google.com/spreadsheets/d/cxckcPQe3WW_TWU_nqG1PcBk8_JLLj3m_K_Hmakts/edit?usp=drivesdk

**How to Add User Agents in Ads Power:** https://example.com/how-to-add-user-agents

• **Among 200 target, you'll work on 120 iOS profiles, 40 Android profiles, and 40 Windows/Mac profiles.**

**Steps:**
• Choose the iOS or Android and copy the user agent from the sheet and paste it in ads power.
• Check your profile settings and click on OK to create a profile.
• **1. Copy the tracking link from above and open Ads Power and paste that link.**
• It will do some checks and take you to a Facebook Page. If you are working on Android and iOS and using the User Agents, you won't see any pop-up, but if you do, close it, click **I couldn't complete**, click Others and write "Facebook Popup error." You'll need to click on the **Learn More** button, if you don't see it, scroll down and it will be visible.
• Continue your work like normal.`,

    viewer2: `**Session Task Instructions**

Make your AdsPower profile using the proxy provided above in the IP blank.

**Data for forms:** https://docs.google.com/spreadsheets/d/1Y1kM[redacted]Jck/edit?gid[redacted]4878

**User agents:** https://docs.google.com/spreadsheets/d/cxckcPQe3WW_TWU_nqG1PcBk8_JLLj3m_K_Hmakts/edit?usp=drivesdk

**How to Add User Agents in Ads Power:** https://example.com/how-to-add-user-agents

• **Among 150 target, you'll work on 90 iOS profiles, 30 Android profiles, and 30 Windows/Mac profiles.**

**Steps:**
• Choose the iOS or Android and copy the user agent from the sheet and paste it in ads power.
• Check your profile settings and click on OK to create a profile.
• **1. Copy the tracking link from above and open Ads Power and paste that link.**
• It will do some checks and take you to a Facebook Page. If you are working on Android and iOS and using the User Agents, you won't see any pop-up, but if you do, close it, click **I couldn't complete**, click Others and write "Facebook Popup error." You'll need to click on the **Learn More** button, if you don't see it, scroll down and it will be visible.
• Continue your work like normal.`,

    clicker: `**Session Task Instructions**

Make your AdsPower profile using the proxy provided above in the IP blank.

**Data for forms:** https://docs.google.com/spreadsheets/d/1Y1kM[redacted]Jck/edit?gid[redacted]4878

**User agents:** https://docs.google.com/spreadsheets/d/cxckcPQe3WW_TWU_nqG1PcBk8_JLLj3m_K_Hmakts/edit?usp=drivesdk

**How to Add User Agents in Ads Power:** https://example.com/how-to-add-user-agents

• **Among 100 target, you'll work on 60 iOS profiles, 20 Android profiles, and 20 Windows/Mac profiles.**

**Steps:**
• Choose the iOS or Android and copy the user agent from the sheet and paste it in ads power.
• Check your profile settings and click on OK to create a profile.
• **1. Copy the tracking link from above and open Ads Power and paste that link.**
• It will do some checks and take you to a Facebook Page. If you are working on Android and iOS and using the User Agents, you won't see any pop-up, but if you do, close it, click **I couldn't complete**, click Others and write "Facebook Popup error." You'll need to click on the **Learn More** button, if you don't see it, scroll down and it will be visible.
• Continue your work like normal.`
  };

  return sessionContents[taskType] || sessionContents.viewer1;
};

export default function TaskInstructionsModal({ task, taskType = 'viewer1' }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <Info className="h-3 w-3 mr-1" />
          <span className="text-xs">Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Task Instructions
          </DialogTitle>
          <DialogDescription>
            Detailed instructions for completing this task
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Instructions Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FileText className="h-3 w-3 mr-1" />
                Task Instructions
              </Badge>
            </div>
            <div className="prose prose-sm max-w-none">
              <RichTextDisplay 
                content={task?.taskInstructions?.content || getTaskContent(taskType)}
                showImages={true}
              />
            </div>
          </div>

          {/* Session Instructions Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Calendar className="h-3 w-3 mr-1" />
                Session Task Instructions
              </Badge>
            </div>
            <div className="prose prose-sm max-w-none">
              <RichTextDisplay 
                content={task?.sessionInstructions?.content || getSessionContent(taskType)}
                showImages={false}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
