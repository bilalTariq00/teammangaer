"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const UsersContext = createContext();

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

// Initial mock data
const initialUsers = [
  {
    id: 1,
    name: "Hasan Abbas",
    email: "abbas_hasan12@joysapps.com",
    role: "worker",
    workerType: "permanent-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "permanent",
    locked: "unlocked",
    links: 1,
    created: "2025-09-10 20:17:31",
    assignedUsers: []
  },
  {
    id: 2,
    name: "Muhammad Shahood",
    email: "Shahood1@joyapps.net",
    role: "manager",
    workerType: "manager",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "permanent",
    locked: "unlocked",
    links: 1,
    created: "2025-09-10 16:46:31",
    assignedUsers: [5, 6, 7]
  },
  {
    id: 3,
    name: "Abid",
    email: "Abid1@joyapps.net",
    role: "worker",
    workerType: "permanent-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "trainee",
    locked: "unlocked",
    links: 0,
    created: "2025-09-10 15:30:15",
    assignedUsers: []
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@joyapps.net",
    role: "worker",
    workerType: "trainee-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "trainee",
    locked: "unlocked",
    links: 0,
    created: "2025-09-09 14:22:10",
    assignedUsers: []
  },
  {
    id: 5,
    name: "Hasan Abbas",
    email: "hasan@joyapps.net",
    role: "worker",
    workerType: "permanent-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "permanent",
    locked: "unlocked",
    links: 0,
    created: "2025-09-09 10:15:30",
    assignedUsers: []
  },
  {
    id: 6,
    name: "Adnan Amir",
    email: "adnan@joyapps.net",
    role: "worker",
    workerType: "permanent-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "permanent",
    locked: "unlocked",
    links: 0,
    created: "2025-09-08 16:45:20",
    assignedUsers: []
  },
  {
    id: 7,
    name: "Waleed Bin Shakeel",
    email: "waleed@joyapps.net",
    role: "worker",
    workerType: "trainee-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "trainee",
    locked: "unlocked",
    links: 0,
    created: "2025-09-08 12:30:15",
    assignedUsers: []
  },
  {
    id: 8,
    name: "Lisa Brown",
    email: "lisa@joyapps.net",
    role: "worker",
    workerType: "trainee-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "trainee",
    locked: "unlocked",
    links: 0,
    created: "2025-09-07 09:20:45",
    assignedUsers: []
  },
  {
    id: 9,
    name: "David Lee",
    email: "david@joyapps.net",
    role: "worker",
    workerType: "trainee-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "trainee",
    locked: "unlocked",
    links: 0,
    created: "2025-09-07 08:15:30",
    assignedUsers: []
  },
  {
    id: 10,
    name: "Emma Davis",
    email: "emma@joyapps.net",
    role: "worker",
    workerType: "permanent-worker",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "permanent",
    locked: "unlocked",
    links: 3,
    created: "2025-09-06 14:10:20",
    assignedUsers: []
  },
  {
    id: 8,
    name: "Sarah Manager",
    email: "manager@joyapps.com",
    role: "manager",
    workerType: "manager",
    defaultTasker: "Tasker Worker",
    defaultTaskerSlug: "tasker-worker",
    status: "permanent",
    locked: "unlocked",
    links: 2,
    created: "2025-09-08 10:30:15",
    assignedUsers: [5, 6, 7]
  }
];

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [nextId, setNextId] = useState(12);

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    const savedNextId = localStorage.getItem('nextUserId');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedNextId) {
      setNextId(parseInt(savedNextId));
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('nextUserId', nextId.toString());
  }, [users, nextId]);

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: nextId,
      // Ensure taskRole is captured for login/display flows
      taskRole: userData.taskRole || 'viewer',
      created: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+),?\s*(.+)/, '$3-$1-$2 $4'),
      locked: "unlocked",
      links: 0,
      assignedUsers: userData.assignedUsers || []
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    setNextId(prevId => prevId + 1);
    return newUser;
  };

  const updateUser = (userId, userData) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, ...userData }
          : user
      )
    );
  };

  const deleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};
