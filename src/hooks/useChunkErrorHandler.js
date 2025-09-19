"use client";

import { useEffect } from 'react';

export function useChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event) => {
      // Check if it's a chunk loading error
      if (event.reason && event.reason.name === 'ChunkLoadError') {
        console.warn('ChunkLoadError detected. Reloading page to fetch latest resources...');
        window.location.reload();
        return;
      }
      
      // Check for other chunk-related errors
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('Loading chunk') || 
           event.reason.message.includes('Loading CSS chunk'))) {
        console.warn('Chunk loading error detected. Reloading page...');
        window.location.reload();
        return;
      }
    };

    const handleError = (event) => {
      // Handle script loading errors
      if (event.target && event.target.tagName === 'SCRIPT' && event.target.src) {
        console.warn('Script loading error detected. Reloading page...');
        window.location.reload();
      }
    };

    // Listen for unhandled promise rejections (chunk errors)
    window.addEventListener('unhandledrejection', handleChunkError);
    
    // Listen for script loading errors
    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('unhandledrejection', handleChunkError);
      window.removeEventListener('error', handleError, true);
    };
  }, []);
}
