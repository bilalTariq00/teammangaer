"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProtectedRoute from "../ProtectedRoute";

export default function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block sticky top-0">
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header sidebarCollapsed={sidebarCollapsed} onSidebarToggle={toggleSidebar} />
          <main className="flex-1 p-6 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
