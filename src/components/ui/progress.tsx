import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ==================== PROGRESS BAR ====================
type ProgressVariant = "default" | "primary" | "success" | "warning" | "error" | "gradient";
type ProgressSize = "xs" | "sm" | "md" | "lg";

const variantStyles: Record<ProgressVariant, string> = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-destructive",
    gradient: "bg-gradient-to-r from-primary via-purple-500 to-pink-500",
};

const sizeStyles: Record<ProgressSize, string> = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
};

export interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: ProgressVariant;
    size?: ProgressSize;
    showValue?: boolean;
    label?: string;
    className?: string;
    animated?: boolean;
    striped?: boolean;
}

export function ProgressBar({
    value,
    max = 100,
    variant = "primary",
    size = "md",
    showValue,
    label,
    className,
    animated,
    striped,
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn("w-full", className)}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1.5 text-sm">
                    {label && <span className="text-foreground font-medium">{label}</span>}
                    {showValue && (
                        <span className="text-muted-foreground">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div
                className={cn(
                    "w-full bg-muted rounded-full overflow-hidden",
                    sizeStyles[size]
                )}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out",
                        variantStyles[variant],
                        striped && "bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]",
                        animated && striped && "animate-[progress-stripes_1s_linear_infinite]"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// ==================== CIRCULAR PROGRESS ====================
interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    variant?: ProgressVariant;
    showValue?: boolean;
    className?: string;
    children?: ReactNode;
}

export function CircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 10,
    variant = "primary",
    showValue,
    className,
    children,
}: CircularProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const strokeColors: Record<ProgressVariant, string> = {
        default: "stroke-muted-foreground",
        primary: "stroke-primary",
        success: "stroke-emerald-500",
        warning: "stroke-amber-500",
        error: "stroke-destructive",
        gradient: "stroke-[url(#gradient)]",
    };

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {variant === "gradient" && (
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                )}
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    className="stroke-muted fill-none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn(
                        "fill-none transition-all duration-500 ease-out",
                        variant === "gradient" ? "stroke-[url(#gradient)]" : strokeColors[variant]
                    )}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children ? (
                    children
                ) : showValue ? (
                    <span className="text-lg font-semibold">{Math.round(percentage)}%</span>
                ) : null}
            </div>
        </div>
    );
}

// ==================== READING PROGRESS ====================
interface ReadingProgressProps {
    current: number;
    total: number;
    className?: string;
    showChapterInfo?: boolean;
}

export function ReadingProgress({
    current,
    total,
    className,
    showChapterInfo,
}: ReadingProgressProps) {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <div className={cn("space-y-2", className)}>
            <ProgressBar value={current} max={total} variant="gradient" size="sm" />
            {showChapterInfo && (
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                        Capítulo {current} de {total}
                    </span>
                    <span className="font-medium text-primary">
                        {percentage.toFixed(1)}%
                    </span>
                </div>
            )}
        </div>
    );
}

// ==================== LOADING PROGRESS ====================
interface LoadingProgressProps {
    className?: string;
    label?: string;
}

export function LoadingProgress({ className, label }: LoadingProgressProps) {
    return (
        <div className={cn("w-full", className)}>
            {label && (
                <span className="text-sm text-muted-foreground mb-2 block">{label}</span>
            )}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear] rounded-full" />
            </div>
        </div>
    );
}
