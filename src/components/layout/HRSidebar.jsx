"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  UserPlus,
  Edit,
  FileText,
  Building,
  Calendar,
  Award,
  DollarSign,
  GraduationCap,
  Briefcase,
  ClipboardList
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/hr-dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    href: "/hr-dashboard?tab=employees",
    icon: Users,
  },
//   {
//     name: "Performance",
//     href: "/hr-dashboard?tab=performance",
//     icon: BarChart3,
//   },
//   {
//     name: "Reports",
//     href: "/hr-dashboard?tab=reports",
//     icon: FileText,
//   },
  {
    name: "Departments",
    href: "/hr-dashboard?tab=departments",
    icon: Building,
  },
  {
    name: "Calendar",
    href: "/hr-dashboard?tab=calendar",
    icon: Calendar,
  },
//   {
//     name: "Settings",
//     href: "/hr-settings",
//     icon: Settings,
//   },
];

const employeeManagement = [
  {
    name: "Add Employee",
    href: "/hr-dashboard?action=add-employee",
    icon: UserPlus,
  },
  {
    name: "Edit Employees",
    href: "/hr-dashboard?action=edit-employees",
    icon: Edit,
  },
];

export default function HRSidebar({ isCollapsed, onToggle }) {
  const pathname = usePathname();
  const { dashboardTitle, logoPreview, getInitials } = useSettings();

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r sticky top-0 transition-all duration-300 animate-slide-in min-h-screen",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo"
              className="h-8 w-8 object-contain"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {getInitials(dashboardTitle)}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <h1 className="text-xl font-bold">HR Portal</h1>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = item.href.includes('?') 
            ? pathname === item.href.split('?')[0] && 
              (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') === item.href.split('?')[1]?.split('=')[1] : false)
            : pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 transition-smooth hover:scale-[1.02]",
                  isCollapsed && "px-2"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
        
        {/* Employee Management Section */}
        
      </nav>
    </div>
  );
}
