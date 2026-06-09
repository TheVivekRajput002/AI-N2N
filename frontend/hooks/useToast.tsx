"use client"

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Play the corresponding soundtrack from public/sound-tracks/
    if (typeof window !== 'undefined') {
      try {
        const soundFile = type === 'success' ? 'success.mp3' : 'info.mp3';
        const audio = new Audio(`/sound-tracks/${soundFile}`);
        audio.play().catch((err) => {
          // Playback may be blocked by browser autoplay policy until user interacts with the page.
          console.warn('Toast sound playback was prevented or failed:', err);
        });
      } catch (err) {
        console.error('Failed to play toast soundtrack:', err);
      }
    }

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-[360px] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`ios-toast pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border border-[var(--ios-card-border)] bg-[var(--navbar-bg-color)] backdrop-blur-xl saturate-150 animate-toast-in overflow-hidden`}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <FiCheckCircle className="w-5 h-5 text-[hsl(var(--ios-green))]" />
              )}
              {toast.type === 'error' && (
                <FiAlertCircle className="w-5 h-5 text-[hsl(var(--ios-red))]" />
              )}
              {toast.type === 'info' && (
                <FiInfo className="w-5 h-5 text-[hsl(var(--ios-blue))]" />
              )}
            </div>

            {/* Message Text */}
            <div className="flex-1 text-[13.5px] font-medium text-[var(--ios-text-primary)] leading-tight">
              {toast.message}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-[var(--ios-text-muted)] hover:text-[var(--ios-text-primary)] transition-colors p-0.5 rounded-full hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] active:scale-90"
              aria-label="Close"
            >
              <FiX className="w-4 h-4" />
            </button>
            
            {/* Ambient Accent Glow Bar */}
            <div 
              className={`absolute left-0 top-0 bottom-0 w-[4px] ${
                toast.type === 'success' ? 'bg-[hsl(var(--ios-green))]' :
                toast.type === 'error' ? 'bg-[hsl(var(--ios-red))]' :
                'bg-[hsl(var(--ios-blue))]'
              }`}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
