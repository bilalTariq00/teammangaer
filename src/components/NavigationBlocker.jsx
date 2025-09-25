"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useManagerWorkflow } from '@/contexts/ManagerWorkflowContext';

export default function NavigationBlocker() {
  const { navigationBlocked } = useManagerWorkflow();
  const pathname = usePathname();

  // Don't block the manager attendance page or dashboard
  if (pathname === '/manager-attendance' || pathname === '/manager-dashboard') {
    return null;
  }

  // Don't block if navigation is not blocked
  if (!navigationBlocked) {
    return null;
  }

  // Simple redirect to dashboard
  if (typeof window !== 'undefined') {
    window.location.href = '/manager-dashboard';
  }

  return null;
}
