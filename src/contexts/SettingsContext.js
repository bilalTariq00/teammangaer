"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("Team Portal");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Load settings from localStorage
    const savedTitle = localStorage.getItem("dashboardTitle");
    const savedLogoPreview = localStorage.getItem("logoPreview");
    
    if (savedTitle) {
      setDashboardTitle(savedTitle);
    }
    if (savedLogoPreview) {
      setLogoPreview(savedLogoPreview);
    }
  }, []);

  const updateDashboardTitle = (title) => {
    setDashboardTitle(title);
    if (isClient) {
      localStorage.setItem("dashboardTitle", title);
    }
  };

  const updateLogo = (file) => {
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target.result;
        setLogoPreview(preview);
        if (isClient) {
          localStorage.setItem("logoPreview", preview);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (isClient) {
      localStorage.removeItem("logoPreview");
    }
  };

  const getInitials = (title) => {
    return title
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const value = {
    dashboardTitle,
    logoFile,
    logoPreview,
    updateDashboardTitle,
    updateLogo,
    removeLogo,
    getInitials,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    // Return default values for SSR safety
    return {
      dashboardTitle: "Team Portal",
      logoFile: null,
      logoPreview: null,
      updateDashboardTitle: () => {},
      updateLogo: () => {},
      removeLogo: () => {},
      getInitials: (title) => title.split(" ").map(word => word.charAt(0)).join("").toUpperCase().slice(0, 2),
    };
  }
  return context;
}
