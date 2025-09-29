"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Debug logging
        console.log('Login successful, user data:', result.user);
        console.log('User role:', result.user.role);
        
        // Store token and user data
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Set user role cookie for middleware access
        document.cookie = `user-role=${result.user.role}; path=/; max-age=86400`; // 24 hours
        
        console.log('Stored user in localStorage:', JSON.parse(localStorage.getItem('user')));
        console.log('Cookie set:', document.cookie);
        
        // Dispatch custom event to notify AuthContext of login
        window.dispatchEvent(new CustomEvent('userLogin', { 
          detail: { user: result.user, token: result.token } 
        }));
        
        // Small delay to ensure localStorage is updated before redirect
        setTimeout(() => {
          // Redirect based on user role
          if (result.user.role === "admin") {
            router.push("/dashboard");
          } else if (result.user.role === "manager") {
            router.push("/manager-dashboard");
          } else if (result.user.role === "qc") {
            router.push("/qc-dashboard");
          } else if (result.user.role === "hr") {
            router.push("/hr-dashboard");
          } else if (result.user.role === "user") {
            router.push("/user-dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 100);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-xl">TP</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your Team Portal account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@joyapps.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <div className="space-y-1 font-mono text-xs">
              <p>admin@joyapps.com / admin123</p>
              <p>manager@joyapps.com / manager123</p>
              <p>qc@joyapps.com / qc123</p>
              <p>hr@joyapps.com / hr123</p>
              <p>User</p>
              <p>Viewer: adnan@joyapps.net / user123</p>
              <p>Clicker: waleed@joyapps.net / user123</p>
              <p>Both: hasan@joyapps.net / user123</p>
              
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
