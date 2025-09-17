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
  Link as LinkIcon,
  CheckSquare,
  Settings,
  Target,
  Plus,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Target,
  },
  
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Links",
    href: "/links",
    icon: LinkIcon,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isCollapsed, onToggle }) {
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
            <h1 className="text-xl font-bold">{dashboardTitle}</h1>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
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
      </nav>
    </div>
  );
}
