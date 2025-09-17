"use client";

import { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
import ProtectedRoute from "../ProtectedRoute";
import RoleProtectedRoute from "../RoleProtectedRoute";

export default function UserMainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <RoleProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block sticky top-0">
          <UserSidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <UserHeader sidebarCollapsed={sidebarCollapsed} onSidebarToggle={toggleSidebar} />
          <main className="flex-1 p-6 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleProtectedRoute>
  );
}
