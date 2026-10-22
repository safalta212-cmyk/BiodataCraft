import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastItem, ToastType } from '../types/toast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 4000) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => showToast(message, 'success', title),
    [showToast]
  );
  const error = useCallback(
    (message: string, title?: string) => showToast(message, 'error', title),
    [showToast]
  );
  const warning = useCallback(
    (message: string, title?: string) => showToast(message, 'warning', title),
    [showToast]
  );
  const info = useCallback(
    (message: string, title?: string) => showToast(message, 'info', title),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
      {children}
      {/* Toast Stack Viewport Container - Positioned cleanly above mobile bottom bars and safe area */}
      <div className="fixed bottom-20 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 max-w-sm sm:w-full z-50 flex flex-col gap-2 pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-white shadow-xl',
    error: 'border-red-200 bg-white shadow-xl',
    warning: 'border-amber-200 bg-white shadow-xl',
    info: 'border-blue-200 bg-white shadow-xl'
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 shadow-lg ${
        borders[toast.type]
      }`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-xs min-w-0">
        {toast.title && <div className="font-bold text-stone-900 mb-0.5 truncate">{toast.title}</div>}
        <p className="text-stone-700 leading-relaxed break-words">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-stone-400 hover:text-stone-700 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-2 rounded-xl cursor-pointer shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
