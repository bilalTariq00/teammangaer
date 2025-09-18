"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on user role
        if (user.role === "admin") {
          router.push("/dashboard");
        } else if (user.role === "manager") {
          router.push("/manager-dashboard");
        } else if (user.role === "qc") {
          router.push("/qc-dashboard");
        } else if (user.role === "hr") {
          router.push("/hr-dashboard");
        } else if (user.role === "user") {
          router.push("/user-dashboard");
        }
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
