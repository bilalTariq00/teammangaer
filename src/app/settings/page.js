"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Upload, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { 
    dashboardTitle, 
    logoFile, 
    logoPreview, 
    updateDashboardTitle, 
    updateLogo, 
    removeLogo, 
    getInitials 
  } = useSettings();

  const [title, setTitle] = useState(dashboardTitle);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateLogo(file);
    }
  };

  const handleSaveSettings = () => {
    updateDashboardTitle(title);
    // You could add a toast notification here
  };

  const handleDeleteAccount = () => {
    // In a real app, you'd call an API to delete the account
    logout();
    setIsDeleteDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your dashboard preferences and account settings.
          </p>
        </div>

        {/* Dashboard Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Settings</CardTitle>
            <CardDescription>
              Customize your dashboard appearance and branding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dashboard Title */}
            <div className="space-y-2">
              <Label htmlFor="dashboard-title">Dashboard Title</Label>
              <Input
                id="dashboard-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter dashboard title"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Dashboard Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">
                      {getInitials(title)}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </label>
                    </Button>
                    {logoPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeLogo}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a logo or use initials: {getInitials(title)}
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value="Admin" disabled />
            </div>

            <div className="pt-4 border-t">
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all associated data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
