"use client";

import { useState } from "react";
import QCHeader from "./QCHeader";
import QCSidebar from "./QCSidebar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

export default function QCMainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <RoleProtectedRoute allowedRoles={["qc"]}>
      <div className="flex h-screen bg-background">
        <QCSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <QCHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleProtectedRoute>
  );
}
