"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const EnhancedTaskContext = createContext();

export const useEnhancedTasks = () => {
  const context = useContext(EnhancedTaskContext);
  if (context === undefined) {
    throw new Error('useEnhancedTasks must be used within an EnhancedTaskProvider');
  }
  return context;
};

// Enhanced task data structure
const initialTasks = [
  {
    id: 1,
    title: "E-commerce Product Review Session 1",
    type: "viewer",
    description: "Review e-commerce products and provide detailed feedback",
    assignedTo: 5, // Hasan Abbas
    assignedBy: 2, // Muhammad Shahood (Manager)
    status: "assigned",
    priority: "high",
    expiryDate: "2024-12-25T23:59:59Z",
    createdAt: "2024-12-19T10:00:00Z",
    completedAt: null,
    sessionInstructions: {
      title: "Session Task Instructions",
      content: "This is a viewer task session. You will be reviewing 2 different e-commerce products. Each product has 2 links to review. Complete all 4 links, then submit your feedback for each product before proceeding to the final submission.",
      collapsed: true
    },
    taskInstructions: {
      title: "Task Instructions",
      content: "1. Click on each link to open the product page\n2. Spend at least 2 minutes reviewing each product\n3. Take notes on product quality, pricing, and user experience\n4. Complete both products before final submission\n5. Use the reload button if links don't work properly",
      collapsed: true
    },
    subtasks: [
      {
        id: 1,
        title: "Product 1: Smartphone Review",
        type: "viewer",
        status: "pending", // pending, in_progress, completed
        links: [
          {
            id: 1,
            displayUrl: "https://masked-link-1.example.com",
            realUrl: "https://example-store.com/smartphone-1",
            proxy: "proxy1.example.com:8080",
            title: "Smartphone Product Page",
            instructions: "Review the smartphone specifications, pricing, and customer reviews",
            timeRequired: 120, // seconds
            completed: false,
            completedAt: null,
            notes: ""
          },
          {
            id: 2,
            displayUrl: "https://masked-link-2.example.com",
            realUrl: "https://example-store.com/smartphone-1-reviews",
            proxy: "proxy2.example.com:8080",
            title: "Smartphone Reviews Page",
            instructions: "Read through customer reviews and ratings",
            timeRequired: 90,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ],
        submission: {
          completed: false,
          notes: "",
          screenshot: null,
          submittedAt: null
        }
      },
      {
        id: 2,
        title: "Product 2: Laptop Review",
        type: "viewer",
        status: "pending",
        links: [
          {
            id: 3,
            displayUrl: "https://masked-link-3.example.com",
            realUrl: "https://example-store.com/laptop-1",
            proxy: "proxy3.example.com:8080",
            title: "Laptop Product Page",
            instructions: "Review the laptop specifications, features, and pricing",
            timeRequired: 120,
            completed: false,
            completedAt: null,
            notes: ""
          },
          {
            id: 4,
            displayUrl: "https://masked-link-4.example.com",
            realUrl: "https://example-store.com/laptop-1-reviews",
            proxy: "proxy4.example.com:8080",
            title: "Laptop Reviews Page",
            instructions: "Analyze customer feedback and technical reviews",
            timeRequired: 90,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ],
        submission: {
          completed: false,
          notes: "",
          screenshot: null,
          submittedAt: null
        }
      }
    ],
    clickerTask: {
      id: 1,
      title: "Website Click Analysis",
      type: "clicker",
      status: "pending",
      links: [
        {
          id: 5,
          displayUrl: "https://masked-click-link.example.com",
          realUrl: "https://example-website.com/landing",
          proxy: "proxy5.example.com:8080",
          title: "Main Landing Page",
          instructions: "Click through the website and analyze user experience",
          timeRequired: 180,
          completed: false,
          completedAt: null,
          notes: ""
        }
      ],
      submission: {
        completed: false,
        notes: "",
        submittedAt: null
      }
    },
    finalSubmission: {
      completed: false,
      notes: "",
      submittedAt: null
    },
    metrics: {
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0
    }
  },
  {
    id: 2,
    title: "Social Media Content Analysis Session 2",
    type: "viewer",
    description: "Analyze social media content and provide detailed feedback",
    assignedTo: 5, // Hasan Abbas
    assignedBy: 2, // Muhammad Shahood (Manager)
    status: "assigned",
    priority: "medium",
    expiryDate: "2024-12-26T23:59:59Z",
    createdAt: "2024-12-19T11:00:00Z",
    completedAt: null,
    sessionInstructions: {
      title: "Session Task Instructions",
      content: "This is a social media analysis session. You will be reviewing 2 different social media platforms. Each platform has 2 links to review. Complete all 4 links, then submit your feedback for each platform before proceeding to the final submission.",
      collapsed: true
    },
    taskInstructions: {
      title: "Task Instructions",
      content: "1. Click on each link to open the social media page\n2. Spend at least 2 minutes analyzing each platform\n3. Take notes on content quality, engagement, and user experience\n4. Complete both platforms before final submission\n5. Use the reload button if links don't work properly",
      collapsed: true
    },
    subtasks: [
      {
        id: 1,
        title: "Platform 1: Instagram Analysis",
        type: "viewer",
        status: "pending",
        links: [
          {
            id: 1,
            displayUrl: "https://masked-social-1.example.com",
            realUrl: "https://instagram.com/brand1",
            proxy: "proxy3.example.com:8080",
            title: "Instagram Brand Page",
            instructions: "Analyze the Instagram brand page, content quality, and engagement",
            timeRequired: 120,
            completed: false,
            completedAt: null,
            notes: ""
          },
          {
            id: 2,
            displayUrl: "https://masked-social-2.example.com",
            realUrl: "https://instagram.com/brand1/posts",
            proxy: "proxy4.example.com:8080",
            title: "Instagram Posts Feed",
            instructions: "Review the posts feed and analyze content strategy",
            timeRequired: 90,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ],
        submission: {
          completed: false,
          notes: "",
          screenshot: null,
          submittedAt: null
        }
      },
      {
        id: 2,
        title: "Platform 2: Facebook Analysis",
        type: "viewer",
        status: "pending",
        links: [
          {
            id: 3,
            displayUrl: "https://masked-social-3.example.com",
            realUrl: "https://facebook.com/brand2",
            proxy: "proxy5.example.com:8080",
            title: "Facebook Brand Page",
            instructions: "Analyze the Facebook brand page and community engagement",
            timeRequired: 120,
            completed: false,
            completedAt: null,
            notes: ""
          },
          {
            id: 4,
            displayUrl: "https://masked-social-4.example.com",
            realUrl: "https://facebook.com/brand2/events",
            proxy: "proxy6.example.com:8080",
            title: "Facebook Events Page",
            instructions: "Review the events section and analyze community activity",
            timeRequired: 90,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ],
        submission: {
          completed: false,
          notes: "",
          screenshot: null,
          submittedAt: null
        }
      }
    ],
    clickerTask: {
      id: 1,
      title: "Social Media Click Analysis",
      type: "clicker",
      status: "pending",
      links: [
        {
          id: 5,
          displayUrl: "https://masked-social-click.example.com",
          realUrl: "https://social-platform.com/landing",
          proxy: "proxy7.example.com:8080",
          title: "Social Platform Landing Page",
          instructions: "Click through the social platform and analyze user experience",
          timeRequired: 180,
          completed: false,
          completedAt: null,
          notes: ""
        }
      ],
      submission: {
        completed: false,
        notes: "",
        submittedAt: null
      }
    },
    finalSubmission: {
      completed: false,
      notes: "",
      submittedAt: null
    },
    metrics: {
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0
    }
  },
  {
    id: 3,
    title: "Website Performance Review Session 3",
    type: "viewer",
    description: "Review website performance and user experience",
    assignedTo: 5, // Hasan Abbas
    assignedBy: 2, // Muhammad Shahood (Manager)
    status: "assigned",
    priority: "low",
    expiryDate: "2024-12-27T23:59:59Z",
    createdAt: "2024-12-19T12:00:00Z",
    completedAt: null,
    sessionInstructions: {
      title: "Session Task Instructions",
      content: "This is a website performance review session. You will be reviewing 2 different website sections. Each section has 2 links to review. Complete all 4 links, then submit your feedback for each section before proceeding to the final submission.",
      collapsed: true
    },
    taskInstructions: {
      title: "Task Instructions",
      content: "1. Click on each link to open the website section\n2. Spend at least 2 minutes reviewing each section\n3. Take notes on performance, design, and user experience\n4. Complete both sections before final submission\n5. Use the reload button if links don't work properly",
      collapsed: true
    },
    subtasks: [
      {
        id: 1,
        title: "Section 1: Homepage Review",
        type: "viewer",
        status: "pending",
        links: [
          {
            id: 1,
            displayUrl: "https://masked-web-1.example.com",
            realUrl: "https://example-website.com/home",
            proxy: "proxy8.example.com:8080",
            title: "Website Homepage",
            instructions: "Review the homepage design, layout, and user experience",
            timeRequired: 120,
            completed: false,
            completedAt: null,
            notes: ""
          },
          {
            id: 2,
            displayUrl: "https://masked-web-2.example.com",
            realUrl: "https://example-website.com/home/mobile",
            proxy: "proxy9.example.com:8080",
            title: "Mobile Homepage View",
            instructions: "Review the mobile version of the homepage",
            timeRequired: 90,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ],
        submission: {
          completed: false,
          notes: "",
          screenshot: null,
          submittedAt: null
        }
      },
      {
        id: 2,
        title: "Section 2: Product Pages Review",
        type: "viewer",
        status: "pending",
        links: [
          {
            id: 3,
            displayUrl: "https://masked-web-3.example.com",
            realUrl: "https://example-website.com/products",
            proxy: "proxy10.example.com:8080",
            title: "Products Listing Page",
            instructions: "Review the products listing page and navigation",
            timeRequired: 120,
            completed: false,
            completedAt: null,
            notes: ""
          },
          {
            id: 4,
            displayUrl: "https://masked-web-4.example.com",
            realUrl: "https://example-website.com/products/detail",
            proxy: "proxy11.example.com:8080",
            title: "Product Detail Page",
            instructions: "Review the product detail page and functionality",
            timeRequired: 90,
            completed: false,
            completedAt: null,
            notes: ""
          }
        ],
        submission: {
          completed: false,
          notes: "",
          screenshot: null,
          submittedAt: null
        }
      }
    ],
    clickerTask: {
      id: 1,
      title: "Website Click Analysis",
      type: "clicker",
      status: "pending",
      links: [
        {
          id: 5,
          displayUrl: "https://masked-web-click.example.com",
          realUrl: "https://example-website.com/checkout",
          proxy: "proxy12.example.com:8080",
          title: "Checkout Process Page",
          instructions: "Click through the checkout process and analyze user flow",
          timeRequired: 180,
          completed: false,
          completedAt: null,
          notes: ""
        }
      ],
      submission: {
        completed: false,
        notes: "",
        submittedAt: null
      }
    },
    finalSubmission: {
      completed: false,
      notes: "",
      submittedAt: null
    },
    metrics: {
      totalViews: 0,
      goodViews: 0,
      badViews: 0,
      totalClicks: 0,
      goodClicks: 0,
      badClicks: 0
    }
  }
  ,
  // Viewer-only sample task assigned to Adnan (id: 6)
  {
    id: 101,
    title: "Viewer Session A",
    type: "viewer",
    description: "Viewer-only session with two subtasks",
    assignedTo: 6,
    assignedBy: 2,
    status: "assigned",
    priority: "medium",
    expiryDate: "2025-12-26T23:59:59Z",
    createdAt: "2025-09-21T10:00:00Z",
    completedAt: null,
    sessionInstructions: { title: "Session Task Instructions", content: "Complete both viewer tasks.", collapsed: true },
    taskInstructions: { title: "Task Instructions", content: "Open each link and review.", collapsed: true },
    subtasks: [
      {
        id: 1,
        title: "Viewer A - Task 1",
        type: "viewer",
        status: "pending",
        links: [
          { id: 1, displayUrl: "https://masked-a1.example.com", realUrl: "https://example.com/a1", proxy: "proxyA:8080", title: "A1", instructions: "Review A1", timeRequired: 90, completed: false, completedAt: null, notes: "" }
        ],
        submission: { completed: false, notes: "", screenshot: null, submittedAt: null }
      },
      {
        id: 2,
        title: "Viewer A - Task 2",
        type: "viewer",
        status: "pending",
        links: [
          { id: 2, displayUrl: "https://masked-a2.example.com", realUrl: "https://example.com/a2", proxy: "proxyB:8080", title: "A2", instructions: "Review A2", timeRequired: 90, completed: false, completedAt: null, notes: "" }
        ],
        submission: { completed: false, notes: "", screenshot: null, submittedAt: null }
      }
    ],
    // No clickerTask for viewer-only flow
    finalSubmission: { completed: false, notes: "", submittedAt: null },
    metrics: { totalViews: 0, goodViews: 0, badViews: 0, totalClicks: 0, goodClicks: 0, badClicks: 0 }
  },
  // Second viewer-only task so next appears after finishing first
  {
    id: 102,
    title: "Viewer Session B",
    type: "viewer",
    description: "Second viewer-only session",
    assignedTo: 6,
    assignedBy: 2,
    status: "assigned",
    priority: "low",
    expiryDate: "2025-12-27T23:59:59Z",
    createdAt: "2025-09-21T11:00:00Z",
    completedAt: null,
    sessionInstructions: { title: "Session Task Instructions", content: "Complete both viewer tasks.", collapsed: true },
    taskInstructions: { title: "Task Instructions", content: "Open each link and review.", collapsed: true },
    subtasks: [
      {
        id: 1,
        title: "Viewer B - Task 1",
        type: "viewer",
        status: "pending",
        links: [
          { id: 1, displayUrl: "https://masked-b1.example.com", realUrl: "https://example.com/b1", proxy: "proxyC:8080", title: "B1", instructions: "Review B1", timeRequired: 80, completed: false, completedAt: null, notes: "" }
        ],
        submission: { completed: false, notes: "", screenshot: null, submittedAt: null }
      },
      {
        id: 2,
        title: "Viewer B - Task 2",
        type: "viewer",
        status: "pending",
        links: [
          { id: 2, displayUrl: "https://masked-b2.example.com", realUrl: "https://example.com/b2", proxy: "proxyD:8080", title: "B2", instructions: "Review B2", timeRequired: 85, completed: false, completedAt: null, notes: "" }
        ],
        submission: { completed: false, notes: "", screenshot: null, submittedAt: null }
      }
    ],
    finalSubmission: { completed: false, notes: "", submittedAt: null },
    metrics: { totalViews: 0, goodViews: 0, badViews: 0, totalClicks: 0, goodClicks: 0, badClicks: 0 }
  },
  // Clicker-only tasks for Waleed (id: 7)
  {
    id: 201,
    title: "Clicker Session 1",
    type: "clicker",
    description: "Clicker-only task",
    assignedTo: 7,
    assignedBy: 2,
    status: "assigned",
    priority: "medium",
    expiryDate: "2025-12-28T23:59:59Z",
    createdAt: "2025-09-21T12:00:00Z",
    completedAt: null,
    sessionInstructions: { title: "Session Task Instructions", content: "Complete the clicker analysis.", collapsed: true },
    taskInstructions: { title: "Task Instructions", content: "Open link and perform clicks.", collapsed: true },
    subtasks: [],
    clickerTask: {
      id: 1,
      title: "Click Analysis 1",
      type: "clicker",
      status: "pending",
      links: [
        { id: 1, displayUrl: "https://masked-c1.example.com", realUrl: "https://example.com/c1", proxy: "proxyE:8080", title: "C1", instructions: "Analyze clicks on landing.", timeRequired: 120, completed: false, completedAt: null, notes: "" }
      ],
      submission: { completed: false, notes: "", submittedAt: null }
    },
    finalSubmission: { completed: false, notes: "", submittedAt: null },
    metrics: { totalViews: 0, goodViews: 0, badViews: 0, totalClicks: 0, goodClicks: 0, badClicks: 0 }
  },
  {
    id: 202,
    title: "Clicker Session 2",
    type: "clicker",
    description: "Second clicker-only task",
    assignedTo: 7,
    assignedBy: 2,
    status: "assigned",
    priority: "low",
    expiryDate: "2025-12-29T23:59:59Z",
    createdAt: "2025-09-21T13:00:00Z",
    completedAt: null,
    sessionInstructions: { title: "Session Task Instructions", content: "Complete the clicker analysis.", collapsed: true },
    taskInstructions: { title: "Task Instructions", content: "Open link and perform clicks.", collapsed: true },
    subtasks: [],
    clickerTask: {
      id: 1,
      title: "Click Analysis 2",
      type: "clicker",
      status: "pending",
      links: [
        { id: 1, displayUrl: "https://masked-c2.example.com", realUrl: "https://example.com/c2", proxy: "proxyF:8080", title: "C2", instructions: "Analyze clicks on signup.", timeRequired: 100, completed: false, completedAt: null, notes: "" }
      ],
      submission: { completed: false, notes: "", submittedAt: null }
    },
    finalSubmission: { completed: false, notes: "", submittedAt: null },
    metrics: { totalViews: 0, goodViews: 0, badViews: 0, totalClicks: 0, goodClicks: 0, badClicks: 0 }
  }
];

export const EnhancedTaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [activeTask, setActiveTask] = useState(null);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [linkStartTime, setLinkStartTime] = useState(null);
  const [linkTimer, setLinkTimer] = useState(0);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('enhanced-tasks');
    console.log("Loading from localStorage:", savedTasks);
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      console.log("Parsed tasks from localStorage:", parsedTasks);
      // Only use saved tasks if they have content, otherwise use initial tasks
      if (parsedTasks && parsedTasks.length > 0) {
        setTasks(parsedTasks);
      } else {
        console.log("Empty saved tasks, using initial tasks:", initialTasks);
        setTasks(initialTasks);
      }
    } else {
      console.log("No saved tasks, using initial tasks:", initialTasks);
      setTasks(initialTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    console.log("Saving tasks to localStorage:", tasks);
    localStorage.setItem('enhanced-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer effect for link time tracking
  useEffect(() => {
    let interval = null;
    if (linkStartTime) {
      interval = setInterval(() => {
        setLinkTimer(Math.floor((Date.now() - linkStartTime) / 1000));
      }, 1000);
    } else {
      setLinkTimer(0);
    }
    return () => clearInterval(interval);
  }, [linkStartTime]);

  // Get tasks assigned to a specific user
  const getTasksForUser = (userId) => {
    console.log("getTasksForUser called with userId:", userId);
    console.log("All tasks:", tasks);
    const userTasks = tasks.filter(task => task.assignedTo === userId);
    console.log("User tasks:", userTasks);
    return userTasks;
  };

  // Get current active task for user
  const getCurrentTask = (userId) => {
    const userTasks = getTasksForUser(userId).filter(task => 
      task.status === "assigned" || task.status === "in_progress"
    );
    console.log("Filtered user tasks:", userTasks);
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

  // Start a link review
  const startLinkReview = (taskId, subtaskId, linkId) => {
    setLinkStartTime(Date.now());
    setLinkTimer(0);
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId 
                  ? {
                      ...subtask,
                      links: subtask.links.map(link => 
                        link.id === linkId 
                          ? { ...link, status: "in_progress" }
                          : link
                      )
                    }
                  : subtask
              )
            }
          : task
      )
    );
  };

  // Complete a link review
  const completeLinkReview = (taskId, subtaskId, linkId, notes, quality) => {
    setLinkStartTime(null);
    setLinkTimer(0);
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId 
                  ? {
                      ...subtask,
                      links: subtask.links.map(link => 
                        link.id === linkId 
                          ? { 
                              ...link, 
                              completed: true,
                              completedAt: new Date().toISOString(),
                              notes: notes,
                              quality: quality
                            }
                          : link
                      )
                    }
                  : subtask
              ),
              metrics: {
                ...task.metrics,
                totalViews: task.metrics.totalViews + 1,
                goodViews: task.metrics.goodViews + (quality === "good" ? 1 : 0),
                badViews: task.metrics.badViews + (quality === "bad" ? 1 : 0)
              }
            }
          : task
      )
    );
  };

  // Complete a subtask
  const completeSubtask = (taskId, subtaskId, notes, screenshot) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId 
                  ? {
                      ...subtask,
                      status: "completed",
                      submission: {
                        completed: true,
                        notes: notes,
                        screenshot: screenshot,
                        submittedAt: new Date().toISOString()
                      }
                    }
                  : subtask
              )
            }
          : task
      )
    );
  };

  // Complete clicker task
  const completeClickerTask = (taskId, notes, quality, screenshot) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? {
              ...task,
              clickerTask: {
                ...task.clickerTask,
                status: "completed",
                submission: {
                  completed: true,
                  notes: notes,
                  screenshot: screenshot,
                  submittedAt: new Date().toISOString()
                }
              },
              metrics: {
                ...task.metrics,
                totalClicks: task.metrics.totalClicks + 1,
                goodClicks: task.metrics.goodClicks + (quality === "good" ? 1 : 0),
                badClicks: task.metrics.badClicks + (quality === "bad" ? 1 : 0)
              }
            }
          : task
      )
    );
  };

  // Complete final task submission
  const completeFinalSubmission = (taskId, notes) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? {
              ...task,
              status: "completed",
              completedAt: new Date().toISOString(),
              finalSubmission: {
                completed: true,
                notes: notes,
                submittedAt: new Date().toISOString()
              }
            }
          : task
      )
    );
  };

  // Reload a link (generate new masked URL)
  const reloadLink = (taskId, subtaskId, linkId) => {
    const newMaskedUrl = `https://masked-link-${Date.now()}.example.com`;
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId 
                  ? {
                      ...subtask,
                      links: subtask.links.map(link => 
                        link.id === linkId 
                          ? { ...link, displayUrl: newMaskedUrl }
                          : link
                      )
                    }
                  : subtask
              )
            }
          : task
      )
    );
  };

  // Check if all subtasks are completed
  const areAllSubtasksCompleted = (task) => {
    const viewerDone = (task.subtasks || []).every(subtask => subtask.status === "completed");
    const hasClicker = !!task.clickerTask;
    const clickerDone = !hasClicker || task.clickerTask.status === "completed";
    return viewerDone && clickerDone;
  };

  // Reset tasks to initial state (for debugging)
  const resetTasks = () => {
    console.log("Resetting tasks to initial state");
    localStorage.removeItem('enhanced-tasks');
    setTasks(initialTasks);
  };

  // Get next task for user
  const getNextTask = (userId) => {
    const userTasks = getTasksForUser(userId).filter(task => 
      task.status === "assigned" || task.status === "in_progress"
    );
    return userTasks.length > 1 ? userTasks[1] : null;
  };

  // Create a new task
  const createTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      status: "assigned",
      createdAt: new Date().toISOString(),
      completedAt: null,
      finalSubmission: {
        completed: false,
        notes: "",
        submittedAt: null
      },
      metrics: {
        totalViews: 0,
        goodViews: 0,
        badViews: 0,
        totalClicks: 0,
        goodClicks: 0,
        badClicks: 0
      }
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  };

  const value = {
    tasks,
    currentTaskIndex,
    activeTask,
    setActiveTask,
    currentSubtaskIndex,
    setCurrentSubtaskIndex,
    currentLinkIndex,
    setCurrentLinkIndex,
    linkStartTime,
    linkTimer,
    getTasksForUser,
    getCurrentTask,
    startTask,
    startLinkReview,
    completeLinkReview,
    completeSubtask,
    completeClickerTask,
    completeFinalSubmission,
    reloadLink,
    areAllSubtasksCompleted,
    getNextTask,
    createTask,
    resetTasks
  };

  return (
    <EnhancedTaskContext.Provider value={value}>
      {children}
    </EnhancedTaskContext.Provider>
  );
};
