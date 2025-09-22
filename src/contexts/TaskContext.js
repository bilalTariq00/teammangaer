"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

// Initial mock task data
const initialTasks = [
  {
    id: 1,
    title: "E-commerce Product Review",
    type: "clicker",
    description: "Click on product links and complete form submissions",
    assignedTo: 1, // Hasan Abbas
    assignedBy: 2, // Muhammad Shahood (Manager)
    status: "assigned", // assigned, in_progress, completed, expired
    priority: "high",
    expiryDate: "2024-12-25T23:59:59Z",
    createdAt: "2024-12-19T10:00:00Z",
    completedAt: null,
    links: [
      {
        id: 1,
        url: "https://example-store.com/product1",
        proxy: "proxy1.example.com:8080",
        title: "Product Link 1"
      },
      {
        id: 2,
        url: "https://example-store.com/product2", 
        proxy: "proxy2.example.com:8080",
        title: "Product Link 2"
      }
    ],
    metrics: {
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0
    },
    submissionDetails: {
      completed: false,
      notes: "",
      submittedAt: null
    }
  },
  {
    id: 2,
    title: "Social Media Content Review",
    type: "viewer",
    description: "Review social media content and provide feedback",
    assignedTo: 1, // Hasan Abbas
    assignedBy: 2, // Muhammad Shahood (Manager)
    status: "assigned",
    priority: "medium",
    expiryDate: "2024-12-26T23:59:59Z",
    createdAt: "2024-12-19T11:00:00Z",
    completedAt: null,
    tasks: [
      {
        id: 1,
        title: "Instagram Post Review",
        links: [
          {
            id: 1,
            url: "https://instagram.com/post1",
            proxy: "proxy3.example.com:8080",
            title: "Instagram Post 1"
          },
          {
            id: 2,
            url: "https://instagram.com/post2",
            proxy: "proxy4.example.com:8080", 
            title: "Instagram Post 2"
          }
        ]
      },
      {
        id: 2,
        title: "Facebook Ad Review",
        links: [
          {
            id: 3,
            url: "https://facebook.com/ad1",
            proxy: "proxy5.example.com:8080",
            title: "Facebook Ad 1"
          },
          {
            id: 4,
            url: "https://facebook.com/ad2",
            proxy: "proxy6.example.com:8080",
            title: "Facebook Ad 2"
          }
        ]
      }
    ],
    metrics: {
      totalViews: 0,
      goodViews: 0,
      badViews: 0
    },
    submissionDetails: {
      completed: false,
      notes: "",
      submittedAt: null
    }
  },
  {
    id: 3,
    title: "Website Content Analysis",
    type: "clicker",
    description: "Analyze website content and click through various sections",
    assignedTo: 3, // Abid
    assignedBy: 2, // Muhammad Shahood (Manager)
    status: "assigned",
    priority: "low",
    expiryDate: "2024-12-27T23:59:59Z",
    createdAt: "2024-12-19T12:00:00Z",
    completedAt: null,
    links: [
      {
        id: 1,
        url: "https://example-website.com/page1",
        proxy: "proxy7.example.com:8080",
        title: "Homepage"
      },
      {
        id: 2,
        url: "https://example-website.com/page2",
        proxy: "proxy8.example.com:8080",
        title: "About Page"
      }
    ],
    metrics: {
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0
    },
    submissionDetails: {
      completed: false,
      notes: "",
      submittedAt: null
    }
  }
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [activeTask, setActiveTask] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Get tasks assigned to a specific user
  const getTasksForUser = (userId) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Get current active task for user
  const getCurrentTask = (userId) => {
    const userTasks = getTasksForUser(userId).filter(task => 
      task.status === "assigned" || task.status === "in_progress"
    );
    return userTasks.length > 0 ? userTasks[0] : null;
  };

  // Start a task
  const startTask = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: "in_progress" }
          : task
      )
    );
  };

  // Update task metrics
  const updateTaskMetrics = (taskId, metrics) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              metrics: { ...task.metrics, ...metrics }
            }
          : task
      )
    );
  };

  // Complete a task
  const completeTask = (taskId, submissionDetails) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: "completed",
              completedAt: new Date().toISOString(),
              submissionDetails: {
                ...task.submissionDetails,
                ...submissionDetails,
                completed: true,
                submittedAt: new Date().toISOString()
              }
            }
          : task
      )
    );
  };

  // Create a new task
  const createTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      status: "assigned",
      createdAt: new Date().toISOString(),
      completedAt: null,
      metrics: taskData.type === "clicker" 
        ? { totalClicks: 0, goodClicks: 0, badClicks: 0 }
        : { totalViews: 0, goodViews: 0, badViews: 0 },
      submissionDetails: {
        completed: false,
        notes: "",
        submittedAt: null
      }
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  };

  // Check if task is expired
  const isTaskExpired = (task) => {
    return new Date(task.expiryDate) < new Date();
  };

  // Get next task for user
  const getNextTask = (userId) => {
    const userTasks = getTasksForUser(userId).filter(task => 
      task.status === "assigned" || task.status === "in_progress"
    );
    return userTasks.length > 1 ? userTasks[1] : null;
  };

  const value = {
    tasks,
    currentTaskIndex,
    activeTask,
    setActiveTask,
    getTasksForUser,
    getTasksByStatus,
    getCurrentTask,
    startTask,
    updateTaskMetrics,
    completeTask,
    createTask,
    isTaskExpired,
    getNextTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
