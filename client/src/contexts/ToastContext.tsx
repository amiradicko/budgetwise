import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '../components/Toast';

interface ToastContextType {
  showAchievement: (name: string, description: string, icon: string, points: number) => void;
  addToast: (toast: {
    title: string;
    message: string;
    icon?: string;
    type?: 'success' | 'info' | 'warning' | 'error' | 'achievement';
    duration?: number;
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { showAchievement, addToast, ToastContainer } = useToast();

  return (
    <ToastContext.Provider value={{ showAchievement, addToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}
