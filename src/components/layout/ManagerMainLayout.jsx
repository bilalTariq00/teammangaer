"use client";

import { useState } from "react";
import ManagerSidebar from "./ManagerSidebar";
import ManagerHeader from "./ManagerHeader";
import NavigationBlocker from "@/components/NavigationBlocker";
import { ManagerWorkflowProvider } from "@/contexts/ManagerWorkflowContext";

export default function ManagerMainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ManagerWorkflowProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <ManagerSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <ManagerHeader 
            sidebarCollapsed={sidebarCollapsed} 
            onSidebarToggle={toggleSidebar} 
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        
        {/* Navigation Blocker */}
        <NavigationBlocker />
      </div>
    </ManagerWorkflowProvider>
  );
}