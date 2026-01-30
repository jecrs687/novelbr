import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
type BadgeSize = "sm" | "md" | "lg";

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-emerald-500/10 text-emerald-500",
    warning: "bg-amber-500/10 text-amber-500",
    error: "bg-destructive/10 text-destructive",
    outline: "border border-border text-foreground bg-transparent",
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
};

export interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    icon?: ReactNode;
    dot?: boolean;
    dotColor?: string;
}

export function Badge({
    children,
    variant = "default",
    size = "md",
    className,
    icon,
    dot,
    dotColor = "bg-current",
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 font-medium rounded-full",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />}
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </span>
    );
}

// ==================== STATUS BADGE ====================
export type StatusType = "online" | "offline" | "away" | "busy" | "active" | "inactive" | "pending";

const statusConfig: Record<StatusType, { color: string; label: string }> = {
    online: { color: "bg-emerald-500", label: "Online" },
    offline: { color: "bg-gray-400", label: "Offline" },
    away: { color: "bg-amber-500", label: "Ausente" },
    busy: { color: "bg-destructive", label: "Ocupado" },
    active: { color: "bg-emerald-500", label: "Ativo" },
    inactive: { color: "bg-gray-400", label: "Inativo" },
    pending: { color: "bg-amber-500", label: "Pendente" },
};

export function StatusBadge({
    status,
    showLabel = true,
    className,
}: {
    status: StatusType;
    showLabel?: boolean;
    className?: string;
}) {
    const config = statusConfig[status];

    return (
        <Badge variant="outline" size="sm" dot dotColor={config.color} className={className}>
            {showLabel && config.label}
        </Badge>
    );
}

// ==================== COUNT BADGE ====================
export function CountBadge({
    count,
    max = 99,
    variant = "error",
    className,
}: {
    count: number;
    max?: number;
    variant?: BadgeVariant;
    className?: string;
}) {
    if (count <= 0) return null;

    return (
        <Badge
            variant={variant}
            size="sm"
            className={cn("min-w-[1.25rem] justify-center px-1.5", className)}
        >
            {count > max ? `${max}+` : count}
        </Badge>
    );
}
