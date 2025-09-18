/**
 * Utility functions for authentication and cache management
 */

/**
 * Clear all browser storage and cache
 */
export const clearAllCache = () => {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear IndexedDB if available
    if ('indexedDB' in window) {
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          indexedDB.deleteDatabase(db.name);
        });
      }).catch(console.error);
    }
    
    // Clear service worker cache if available
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      }).catch(console.error);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

/**
 * Force reload to login page with cache clearing
 */
export const forceLogout = () => {
  clearAllCache();
  
  // Force reload to clear any cached data (only in browser)
  if (typeof window !== 'undefined') {
    window.location.href = "/login";
  }
};

/**
 * Set user role cookie with proper expiration
 */
export const setUserRoleCookie = (role) => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  // Clear existing user role cookie first
  document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  // Set new user role cookie
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
  document.cookie = `user-role=${role}; path=/; expires=${expirationDate.toUTCString()}`;
};

/**
 * Get user role from cookie
 */
export const getUserRoleFromCookie = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  const cookies = document.cookie.split(';');
  const userRoleCookie = cookies.find(cookie => cookie.trim().startsWith('user-role='));
  
  if (userRoleCookie) {
    return userRoleCookie.split('=')[1];
  }
  
  return null;
};

/**
 * Clear user role cookie
 */
export const clearUserRoleCookie = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
