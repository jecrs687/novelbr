import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

// ==================== SKELETON ====================
interface SkeletonProps {
    className?: string;
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    style?: CSSProperties;
}

const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
};

export function Skeleton({ className, rounded = "md", style }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-muted",
                roundedStyles[rounded],
                className
            )}
            style={style}
        />
    );
}

// ==================== SKELETON TEXT ====================
interface SkeletonTextProps {
    lines?: number;
    className?: string;
    lastLineWidth?: string;
}

export function SkeletonText({
    lines = 3,
    className,
    lastLineWidth = "60%",
}: SkeletonTextProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="h-4"
                    style={{
                        width: index === lines - 1 ? lastLineWidth : "100%",
                    }}
                />
            ))}
        </div>
    );
}

// ==================== SKELETON CARD ====================
interface SkeletonCardProps {
    className?: string;
    hasImage?: boolean;
    imageHeight?: string;
}

export function SkeletonCard({
    className,
    hasImage = true,
    imageHeight = "h-48",
}: SkeletonCardProps) {
    return (
        <div
            className={cn(
                "bg-card border border-border rounded-xl overflow-hidden",
                className
            )}
        >
            {hasImage && <Skeleton className={cn("w-full", imageHeight)} rounded="none" />}
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16" rounded="full" />
                    <Skeleton className="h-6 w-20" rounded="full" />
                </div>
            </div>
        </div>
    );
}

// ==================== SKELETON NOVEL CARD ====================
export function SkeletonNovelCard({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "bg-card/50 border border-border/50 rounded-2xl overflow-hidden",
                className
            )}
        >
            <Skeleton className="aspect-[3/4] w-full" rounded="none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-3 pt-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-14" rounded="full" />
                    <Skeleton className="h-6 w-14" rounded="full" />
                </div>
            </div>
        </div>
    );
}

// ==================== SKELETON CHAPTER ====================
export function SkeletonChapter({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 p-4 bg-card border border-border rounded-xl",
                className
            )}
        >
            <Skeleton className="w-12 h-12" rounded="lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="w-8 h-8" rounded="full" />
        </div>
    );
}

// ==================== SKELETON AVATAR ====================
interface SkeletonAvatarProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const avatarSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
};

export function SkeletonAvatar({ size = "md", className }: SkeletonAvatarProps) {
    return <Skeleton className={cn(avatarSizes[size], className)} rounded="full" />;
}

// ==================== SKELETON LIST ====================
interface SkeletonListProps {
    count?: number;
    className?: string;
    itemClassName?: string;
}

export function SkeletonList({
    count = 5,
    className,
    itemClassName,
}: SkeletonListProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex items-center gap-3 p-3 bg-card border border-border rounded-lg",
                        itemClassName
                    )}
                >
                    <SkeletonAvatar size="sm" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ==================== SKELETON TABLE ====================
interface SkeletonTableProps {
    rows?: number;
    columns?: number;
    className?: string;
}

export function SkeletonTable({
    rows = 5,
    columns = 4,
    className,
}: SkeletonTableProps) {
    return (
        <div className={cn("w-full", className)}>
            {/* Header */}
            <div className="flex gap-4 p-3 border-b border-border">
                {Array.from({ length: columns }).map((_, index) => (
                    <Skeleton key={index} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 p-3 border-b border-border/50">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            className={cn("h-4 flex-1", colIndex === 0 && "w-1/4 flex-none")}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ==================== SKELETON PROFILE ====================
export function SkeletonProfile({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center gap-6">
                <SkeletonAvatar size="xl" />
                <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
            <SkeletonText lines={3} />
        </div>
    );
}
