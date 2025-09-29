"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
import ProtectedRoute from "../ProtectedRoute";

export default function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Debug logging
  console.log('MainLayout Debug:', {
    user,
    userRole: user?.role,
    isAdmin: user?.role === "admin",
    loading
  });

  // Show loading state while user is being loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, show nothing (ProtectedRoute will handle redirect)
  if (!user) {
    return null;
  }

  // Use admin components for admin users, user components for regular users
  const isAdmin = user?.role === "admin";
  const HeaderComponent = isAdmin ? Header : UserHeader;
  const SidebarComponent = isAdmin ? Sidebar : UserSidebar;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block sticky top-0">
          <SidebarComponent isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <HeaderComponent sidebarCollapsed={sidebarCollapsed} onSidebarToggle={toggleSidebar} />
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
