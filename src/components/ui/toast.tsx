"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const TOAST_STYLES = {
    success: "bg-emerald-500 text-white",
    error: "bg-destructive text-destructive-foreground",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-500 text-white",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const Icon = TOAST_ICONS[toast.type];

    useEffect(() => {
        if (toast.duration !== 0) {
            const timer = setTimeout(onRemove, toast.duration || 5000);
            return () => clearTimeout(timer);
        }
    }, [toast.duration, onRemove]);

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg animate-slideInRight ${TOAST_STYLES[toast.type]}`}
            role="alert"
        >
            <Icon className="shrink-0 mt-0.5" size={20} />
            <div className="flex-1 min-w-0">
                <p className="font-semibold">{toast.title}</p>
                {toast.message && (
                    <p className="text-sm opacity-90 mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={onRemove}
                className="shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback(
        (title: string, message?: string) => addToast({ type: "success", title, message }),
        [addToast]
    );

    const error = useCallback(
        (title: string, message?: string) => addToast({ type: "error", title, message }),
        [addToast]
    );

    const warning = useCallback(
        (title: string, message?: string) => addToast({ type: "warning", title, message }),
        [addToast]
    );

    const info = useCallback(
        (title: string, message?: string) => addToast({ type: "info", title, message }),
        [addToast]
    );

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}

            {/* Toast container */}
            <div
                className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
                aria-live="polite"
            >
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

// Standalone toast function for non-React contexts
let toastFn: ToastContextValue | null = null;

export function setToastInstance(instance: ToastContextValue) {
    toastFn = instance;
}

export const toast = {
    success: (title: string, message?: string) => toastFn?.success(title, message),
    error: (title: string, message?: string) => toastFn?.error(title, message),
    warning: (title: string, message?: string) => toastFn?.warning(title, message),
    info: (title: string, message?: string) => toastFn?.info(title, message),
};
