"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
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

export default function TaskInstructions({ task, taskType = 'viewer1' }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Card>
      <CardHeader 
        className="bg-blue-50 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-800 text-lg font-semibold">
              Task Instructions
            </CardTitle>
            <CardDescription>
              Detailed instructions for completing this task
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            {collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent className="p-6">
          <RichTextDisplay 
            content={task?.taskInstructions?.content || getTaskContent(taskType)}
            showImages={true}
          />
        </CardContent>
      )}
    </Card>
  );
}

