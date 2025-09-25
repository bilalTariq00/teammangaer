"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { clearAllCache, forceLogout, setUserRoleCookie, clearUserRoleCookie } from "@/utils/authUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount (only in browser)
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Check if user is locked
          if (userData.locked === "locked") {
            // Log out locked user
            localStorage.removeItem("user");
            clearUserRoleCookie();
            setUser(null);
            return;
          }
          
          setUser(userData);
          // Set user role in cookie for middleware access
          setUserRoleCookie(userData.role);
        } catch (error) {
          // If there's an error parsing user data, clear it
          localStorage.removeItem("user");
          setUser(null);
        }
      }
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
        avatar: null,
        locked: "unlocked"
      },
      // Manager user
      {
        id: 2,
        name: "Muhammad Shahood",
        email: "Shahood1@joyapps.net",
        password: "manager123",
        role: "manager",
        avatar: null,
        assignedUsers: [1, 3], // Hasan Abbas and Abid
        locked: "unlocked"
      },
      // Additional Manager user
      {
        id: 8,
        name: "Sarah Manager",
        email: "manager@joyapps.com",
        password: "manager123",
        role: "manager",
        avatar: null,
        assignedUsers: [5, 6, 7], // Hasan Abbas, Adnan Amir, Waleed Bin Shakeel (matching UsersContext)
        locked: "unlocked"
      },
      // QC user
      {
        id: 3,
        name: "John QC",
        email: "qc@joyapps.com",
        password: "qc123",
        role: "qc",
        avatar: null,
        locked: "unlocked"
      },
      // HR user
      {
        id: 4,
        name: "Sarah HR",
        email: "hr@joyapps.com",
        password: "hr123",
        role: "hr",
        avatar: null,
        locked: "unlocked"
      },
      // Regular users (created by admin) - with comprehensive HR data
      {
        id: 5,
        name: "Hasan Abbas",
        email: "hasan@joyapps.net",
        password: "user123",
        role: "user",
        avatar: null,
        // Three-status demo: this user can do both viewer and clicker
        taskRole: "both",
        locked: "unlocked",
        // Basic contact info (user can edit)
        contactNumber: "+1-555-0123",
        emergencyNumber: "+1-555-0124",
        // HR-managed data (read-only for user)
        phoneNumber: "+1-555-0101",
        address: "123 Main St, New York, NY 10001",
        emergencyContact: "Aisha Shahood",
        emergencyPhone: "+1-555-0102",
        dateOfBirth: "1990-05-15",
        socialSecurityNumber: "123-45-6789",
        bankAccount: "****1234",
        benefits: "Health, Dental, Vision",
        notes: "Excellent performer, potential for promotion",
        department: "Operations",
        position: "Permanent Worker",
        salary: 45000,
        joinDate: "2023-01-15",
        performance: 92,
        attendance: 98,
        lastReview: "2024-01-15"
      },
      {
        id: 6,
        name: "Adnan Amir",
        email: "adnan@joyapps.net",
        password: "user123",
        role: "user",
        avatar: null,
        // Viewer-only
        taskRole: "viewer",
        locked: "unlocked",
        // Basic contact info (user can edit)
        contactNumber: "+1-555-0125",
        emergencyNumber: "+1-555-0126",
        // HR-managed data (read-only for user)
        phoneNumber: "+1-555-0201",
        address: "456 Oak Ave, Los Angeles, CA 90210",
        emergencyContact: "Mike Johnson",
        emergencyPhone: "+1-555-0202",
        dateOfBirth: "1988-12-03",
        socialSecurityNumber: "234-56-7890",
        bankAccount: "****5678",
        benefits: "Health, Dental",
        notes: "Reliable team member",
        department: "Operations",
        position: "Permanent Worker",
        salary: 42000,
        joinDate: "2023-03-20",
        performance: 88,
        attendance: 95,
        lastReview: "2024-01-10"
      },
      {
        id: 7,
        name: "Waleed Bin Shakeel",
        email: "waleed@joyapps.net",
        password: "user123",
        role: "user",
        avatar: null,
        workerType: "trainee-worker",
        // Clicker-only
        taskRole: "clicker",
        locked: "unlocked",
        // Basic contact info (user can edit)
        contactNumber: "+1-555-0127",
        emergencyNumber: "+1-555-0128",
        // HR-managed data (read-only for user)
        phoneNumber: "+1-555-0301",
        address: "789 Pine St, Chicago, IL 60601",
        emergencyContact: "Fatima Abbas",
        emergencyPhone: "+1-555-0302",
        dateOfBirth: "1985-08-22",
        socialSecurityNumber: "345-67-8901",
        bankAccount: "****9012",
        benefits: "Health, Dental, Vision, 401k",
        notes: "Top performer, team lead material",
        department: "Operations",
        position: "Trainee Worker",
        salary: 35000,
        joinDate: "2024-01-08",
        performance: 78,
        attendance: 92,
        lastReview: "2024-01-25"
      }
    ];

    // Also include users created via UsersContext (stored in localStorage)
    let dynamicUsers = [];
    if (typeof window !== 'undefined') {
      try {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
          dynamicUsers = JSON.parse(savedUsers);
        }
      } catch (e) {
        dynamicUsers = [];
      }
    }

    const allUsers = [...users, ...dynamicUsers];
    const foundUser = allUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Check if user is locked
      if (foundUser.locked === "locked") {
        throw new Error("Your account has been locked. Please contact your manager to unlock it.");
      }
      // Clear any existing data first (only in browser)
      if (typeof window !== 'undefined') {
        clearAllCache();
      }
      
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar,
        // New: task role for three user flows (viewer | clicker | both)
        taskRole: foundUser.taskRole || null,
        workerType: foundUser.workerType || null, // Add worker type
        locked: foundUser.locked || "unlocked", // Add lock status
        assignedUsers: foundUser.assignedUsers || [], // For managers
        // Basic contact info (user can edit)
        contactNumber: foundUser.contactNumber || "",
        emergencyNumber: foundUser.emergencyNumber || "",
        // HR-managed data (read-only for user)
        phoneNumber: foundUser.phoneNumber || "",
        address: foundUser.address || "",
        emergencyContact: foundUser.emergencyContact || "",
        emergencyPhone: foundUser.emergencyPhone || "",
        dateOfBirth: foundUser.dateOfBirth || "",
        socialSecurityNumber: foundUser.socialSecurityNumber || "",
        bankAccount: foundUser.bankAccount || "",
        benefits: foundUser.benefits || "",
        notes: foundUser.notes || "",
        department: foundUser.department || "",
        position: foundUser.position || "",
        salary: foundUser.salary || 0,
        joinDate: foundUser.joinDate || "",
        performance: foundUser.performance || 0,
        attendance: foundUser.attendance || 0,
        lastReview: foundUser.lastReview || ""
      };
      setUser(userData);
      
      // Save to localStorage and set cookie (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(userData));
        setUserRoleCookie(userData.role);
      }
      
      return { success: true };
    }
    
    return { success: false, error: "Invalid credentials" };
  };

  const updatePersonalInfo = (contactNumber, emergencyNumber) => {
    if (user) {
      const updatedUser = {
        ...user,
        contactNumber: contactNumber || user.contactNumber,
        emergencyNumber: emergencyNumber || user.emergencyNumber
      };
      setUser(updatedUser);
      
      // Save to localStorage (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      return { success: true };
    }
    return { success: false, error: "No user logged in" };
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Clear all cache and storage (only in browser)
    if (typeof window !== 'undefined') {
      clearAllCache();
      // Force logout with redirect
      forceLogout();
    }
  };

  // Function to check if current user is locked and log them out
  const checkUserLockStatus = () => {
    if (user && user.locked === "locked") {
      logout();
      return true; // User was locked and logged out
    }
    return false; // User is not locked
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePersonalInfo, checkUserLockStatus, loading }}>
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
