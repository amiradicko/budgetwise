import { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  icon?: string;
  type?: 'success' | 'info' | 'warning' | 'error' | 'achievement';
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getBackgroundClass = () => {
    switch (toast.type) {
      case 'achievement':
        return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 text-white max-w-md w-full transition-all duration-300 ${
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0 animate-slide-in-right'
      } ${getBackgroundClass()}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {toast.type === 'achievement' ? (
          <div className="p-2 bg-white/20 rounded-full">
            <Trophy className="h-6 w-6" />
          </div>
        ) : toast.icon ? (
          <div className="text-4xl">{toast.icon}</div>
        ) : (
          <div className="p-2 bg-white/20 rounded-full">
            <Trophy className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-lg mb-1">{toast.title}</p>
        <p className="text-sm text-white/90">{toast.message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(toast.id), 300);
        }}
        className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Hook pour gérer les toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showAchievement = (name: string, description: string, icon: string, points: number) => {
    addToast({
      title: `🎉 Badge débloqué : ${name}`,
      message: `${description} (+${points} points)`,
      icon,
      type: 'achievement',
      duration: 6000,
    });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showAchievement,
    ToastContainer: () => <ToastContainer toasts={toasts} onClose={removeToast} />,
  };
}
