"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border border-border bg-transparent text-foreground hover:bg-muted",
    ghost: "bg-transparent text-foreground hover:bg-muted",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm rounded-lg gap-1.5",
    md: "h-10 px-4 text-sm rounded-xl gap-2",
    lg: "h-12 px-6 text-base rounded-xl gap-2",
    xl: "h-14 px-8 text-lg rounded-2xl gap-3",
    icon: "h-10 w-10 rounded-xl p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            loading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={cn(
                    "inline-flex items-center justify-center font-semibold transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                    "active:scale-[0.98]",
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" || size === "xl" ? 20 : 16} />
                ) : leftIcon ? (
                    <span className="shrink-0">{leftIcon}</span>
                ) : null}
                {children && <span>{children}</span>}
                {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
            </button>
        );
    }
);
Button.displayName = "Button";

// ==================== ICON BUTTON ====================
export interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
    icon: ReactNode;
    "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, className, size = "icon", ...props }, ref) => {
        return (
            <Button
                ref={ref}
                size={size}
                className={className}
                {...props}
            >
                {icon}
            </Button>
        );
    }
);
IconButton.displayName = "IconButton";

// ==================== BUTTON GROUP ====================
export function ButtonGroup({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("inline-flex rounded-xl overflow-hidden divide-x divide-border", className)}>
            {children}
        </div>
    );
}
