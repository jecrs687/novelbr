import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ==================== CARD ====================
interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "elevated" | "outline" | "ghost";
    interactive?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
    default: "bg-card border border-border",
    elevated: "bg-card-hover border border-border shadow-lg shadow-black/10",
    outline: "bg-transparent border border-border",
    ghost: "bg-transparent border border-transparent",
};

const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
};

export function Card({
    children,
    className,
    variant = "default",
    interactive,
    padding = "md",
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl",
                variantStyles[variant],
                paddingStyles[padding],
                interactive && "cursor-pointer transition-all hover:border-border-hover hover:bg-card-hover",
                className
            )}
        >
            {children}
        </div>
    );
}

// ==================== CARD HEADER ====================
interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between gap-4 mb-4", className)}>
            {children}
        </div>
    );
}

// ==================== CARD TITLE ====================
interface CardTitleProps {
    children: ReactNode;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({ children, className, as: Tag = "h3" }: CardTitleProps) {
    return (
        <Tag className={cn("font-semibold text-foreground", className)}>
            {children}
        </Tag>
    );
}

// ==================== CARD DESCRIPTION ====================
interface CardDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
    return (
        <p className={cn("text-sm text-muted-foreground", className)}>
            {children}
        </p>
    );
}

// ==================== CARD CONTENT ====================
interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return <div className={cn("", className)}>{children}</div>;
}

// ==================== CARD FOOTER ====================
interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn("flex items-center gap-2 mt-4 pt-4 border-t border-border", className)}>
            {children}
        </div>
    );
}

// ==================== FEATURE CARD ====================
interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    className?: string;
    action?: ReactNode;
}

export function FeatureCard({
    icon,
    title,
    description,
    className,
    action,
}: FeatureCardProps) {
    return (
        <Card className={cn("", className)}>
            <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                    {action && <div className="mt-3">{action}</div>}
                </div>
            </div>
        </Card>
    );
}

// ==================== STAT CARD ====================
interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
    return (
        <Card className={cn("", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {trend && (
                        <p
                            className={cn(
                                "text-sm mt-1",
                                trend.isPositive ? "text-emerald-500" : "text-destructive"
                            )}
                        >
                            {trend.isPositive ? "+" : "-"}
                            {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}
