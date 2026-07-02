"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: ToastItem["type"]) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastItem["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const iconMap: Record<ToastItem["type"], string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  const colorMap: Record<ToastItem["type"], string> = {
    success: "border-l-accent bg-accent/5",
    error: "border-l-danger bg-danger/5",
    info: "border-l-primary bg-primary/5",
  };

  const iconColorMap: Record<ToastItem["type"], string> = {
    success: "bg-accent text-white",
    error: "bg-danger text-white",
    info: "bg-primary text-white",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-border shadow-lg animate-slide-down cursor-pointer ${colorMap[toast.type]}`}
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${iconColorMap[toast.type]}`}
            >
              {iconMap[toast.type]}
            </span>
            <p className="text-sm font-medium text-text">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
