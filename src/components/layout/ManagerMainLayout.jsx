"use client";

import { useState } from "react";
import ManagerHeader from "./ManagerHeader";
import ManagerSidebar from "./ManagerSidebar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

export default function ManagerMainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <RoleProtectedRoute allowedRoles={["manager"]}>
      <div className="flex h-screen bg-background">
        <ManagerSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ManagerHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleProtectedRoute>
  );
}
