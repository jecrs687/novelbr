"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    className?: string;
}

const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className,
}: ModalProps) {
    // Handle escape key
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && closeOnEscape) {
                onClose();
            }
        },
        [closeOnEscape, onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative w-full bg-card border border-border rounded-2xl shadow-2xl animate-scaleIn",
                    sizeStyles[size],
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                aria-describedby={description ? "modal-description" : undefined}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div>
                            {title && (
                                <h2 id="modal-title" className="text-xl font-bold text-foreground">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p id="modal-description" className="text-sm text-muted-foreground mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={cn(!title && !showCloseButton && "pt-6")}>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ==================== MODAL BODY ====================
export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("p-6", className)}>{children}</div>;
}

// ==================== MODAL FOOTER ====================
export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("flex items-center justify-end gap-3 p-6 border-t border-border", className)}>
            {children}
        </div>
    );
}

// ==================== CONFIRM MODAL ====================
export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "default";
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "default",
    loading = false,
}: ConfirmModalProps) {
    const confirmButtonClass = {
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
    }[variant];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <ModalBody>
                <p className="text-muted-foreground">{message}</p>
            </ModalBody>
            <ModalFooter>
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                        "px-4 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50",
                        confirmButtonClass
                    )}
                >
                    {loading ? "Aguarde..." : confirmText}
                </button>
            </ModalFooter>
        </Modal>
    );
}
