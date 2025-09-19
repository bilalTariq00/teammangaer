"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import HRSidebar from "./HRSidebar";
import ProtectedRoute from "../ProtectedRoute";
import RoleProtectedRoute from "../RoleProtectedRoute";

export default function UserManagementLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Choose the appropriate sidebar based on user role
  const SidebarComponent = user?.role === "hr" ? HRSidebar : Sidebar;

  return (
    <RoleProtectedRoute allowedRoles={["admin", "hr"]}>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block sticky top-0">
          <SidebarComponent isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
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
    </RoleProtectedRoute>
  );
}
