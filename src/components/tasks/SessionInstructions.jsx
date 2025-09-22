"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import RichTextDisplay from "@/components/RichTextDisplay";

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

export default function SessionInstructions({ task, taskType = 'viewer1' }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Card>
      <CardHeader 
        className="bg-purple-50 border-b-2 border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-purple-800 text-lg font-semibold">
              Session Task Instructions
            </CardTitle>
            <CardDescription>
              Session-specific instructions for this task
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
            content={task?.sessionInstructions?.content || getSessionContent(taskType)}
            showImages={false}
          />
        </CardContent>
      )}
    </Card>
  );
}

