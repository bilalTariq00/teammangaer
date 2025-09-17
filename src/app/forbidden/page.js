"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function ForbiddenPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleGoToDashboard = () => {
    if (user?.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/user-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <AlertCircle className="h-24 w-24 text-red-500 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            You don't have permission to access this page. This area is restricted to administrators only.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-500">
            You are currently logged in as: <span className="font-semibold">{user?.name}</span>
          </p>
          <p className="text-sm text-gray-400">
            Role: {user?.role === "admin" ? "Administrator" : "User"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleGoToDashboard} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go to Your Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push("/login")}
          >
            Switch Account
          </Button>
        </div>
      </div>
    </div>
  );
}
