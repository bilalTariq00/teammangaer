"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Set user role in cookie for middleware access
      document.cookie = `user-role=${userData.role}; path=/; max-age=86400`; // 24 hours
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call with different user types
    const users = [
      // Admin user
      {
        id: 1,
        name: "Admin Permanent",
        email: "admin@joyapps.com",
        password: "admin123",
        role: "admin",
        avatar: null
      },
      // Regular users (created by admin)
      {
        id: 2,
        name: "Hasan Abbas",
        email: "hasan@joyapps.net",
        password: "user123",
        role: "user",
        avatar: null
      },
      {
        id: 3,
        name: "Adnan Amir",
        email: "adnan@joyapps.net",
        password: "user123",
        role: "user",
        avatar: null
      },
      {
        id: 4,
        name: "Waleed Bin Shakeel",
        email: "waleed@joyapps.net",
        password: "user123",
        role: "user",
        avatar: null
      }
    ];

    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      // Set user role in cookie for middleware access
      document.cookie = `user-role=${userData.role}; path=/; max-age=86400`; // 24 hours
      return { success: true };
    }
    
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Clear user role cookie
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
